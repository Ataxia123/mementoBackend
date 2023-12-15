import { Router } from 'express';
import { MongoClient } from 'mongodb';
import { generateScannerOutput } from './aiu/oai/metaScan.js';
import { fetchToCompletion } from "./aiu/tnl/apiHandler.js";
const url = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017';
const client = new MongoClient(url);
await client.connect();
console.log('Connected successfully to server');
// Database Name
const dbName = 'mementoMori';
const aiuRouter = Router();
const TNL_API_KEY = process.env.MIDJOURNEY_AUTH_TOKEN || "";
const BASE_URL = "https://api.thenextleg.io/v2";
const AUTH_TOKEN = TNL_API_KEY;
const AUTH_HEADERS = {
    Authorization: `Bearer ${AUTH_TOKEN}`,
    "Content-Type": "application/json",
};
aiuRouter.get('/database', async (req, res) => {
    // Use connect method to connect to the server
    const db = client.db(dbName); // Connect to the Database
    const collection = db.collection('AIU_IPRs'); // Access to 'players' collection
    // Access to 'players' collection
    // Access to 'players' collection
    const pilotCollection = db.collection('pilots'); // 
    const planetCollection = db.collection('planets');
    const shipsCollection = db.collection('ships');
    const missionCollection = db.collection('missions');
    const encounterCollection = db.collection('encounters');
    const quipuxCollection = db.collection('quipuxs');
    const pilots = await pilotCollection.find({}).toArray();
    const ships = await shipsCollection.find({}).toArray();
    const missions = await missionCollection.find({}).toArray();
    const encounters = await encounterCollection.find({}).toArray();
    const quipux = await quipuxCollection.find({}).toArray();
    const planets = await planetCollection.find({}).toArray();
    const database = { pilots, ships, missions, encounters, quipux, planets };
    // Get all players from collection
    res.json({ database }); // Response to MongoClient
});
aiuRouter.post('/attest', async (req, res) => {
    // Use connect method to connect to the server
    const db = client.db(dbName); // Connect to the Database
    const pilots = db.collection('pilots'); // Access to 'players' collection
    // Access to 'players' collection
    const ships = db.collection('ships');
    const data = await req.body;
    const { pilotData, pilotAttestation, uid, address } = data.body;
    console.log(data, "data");
    // function to save player
    async function payRespects(pilot, offchainAttestation, uid, address) {
        // Save only if player id does not exist
        //
        //
        const oc = offchainAttestation;
        const pilotRecord = {
            _id: uid,
            address: address,
            pilotData: pilot,
            Attestation: oc,
        };
        console.log(pilotRecord, "pilotRecord");
        await pilots.updateOne({ id: uid }, { $setOnInsert: pilotRecord }, { upsert: true });
    }
    await payRespects(pilotData, pilotAttestation, uid, address);
    // Get all players from collection
    res.json({ status: 'success', message: 'Players added to DB' });
});
aiuRouter.post('/db', async (req, res) => {
    // Write the generated HTML to the document body
    // Parse JSON body
    const db = client.db(dbName); // Connect to the database
    const collection = db.collection('players');
    const attestationsDB = db.collection('attestations');
    const itemCollection = db.collection('items'); // 
    // assumed input
    const inputPlayerData = req.body;
    // function to save player
    async function savePlayer(playerData) {
        // Save only if player id does not exist
        await collection.updateOne({ id: playerData.id }, { $setOnInsert: playerData }, { upsert: true });
        const attestationData = {
            id: playerData.id,
            Attestation: JSON.parse(playerData.attestation),
        };
        await attestationsDB.updateOne({ id: playerData.id }, { $setOnInsert: attestationData }, { upsert: true });
    }
    res.json({ status: 'success', message: 'Players added to DB', body: inputPlayerData });
});
aiuRouter.post('/imagine', async (req, res) => {
    // Use connect method to connect to the server
    const db = client.db(dbName); // Connect to the Database
    const respects = db.collection('respects'); // Access to 'players' collection
    // Access to 'players' collection
    if (req.method === "POST") {
        const { metadata } = req.body;
        console.log(metadata);
        try {
            const scannerOutput = await generateScannerOutput(metadata);
            res.status(200).json({ scannerOutput });
        }
        catch (error) {
            res.status(500).json({ error: "Error generating scanner output." });
        }
    }
    else {
        res.status(405).json({ error: "Method not allowed." });
    }
});
aiuRouter.post('/attestss', async (req, res) => {
    // Use connect method to connect to the server
    const { url } = await req.body;
    console.log(url);
    console.log("|======DEBUGGING=======|", url, JSON.stringify(req.body));
    const config = {
        method: "post",
        url: "https://api.thenextleg.io/v2/describe",
        headers: {
            Authorization: "Bearer " + AUTH_TOKEN,
            "Content-Type": "application/json",
        },
        data: { url: url },
    };
    try {
        const imageRes = await fetch(`${BASE_URL}/imagine`, {
            method: "POST",
            headers: AUTH_HEADERS,
            body: JSON.stringify({ msg: prompt }),
        });
        const imageResponseData = await imageRes.json();
        console.log("\n=====================");
        console.log("IMAGE GENERATION MESSAGE DATA");
        console.log(imageResponseData);
        console.log("=====================");
        const completedImageData = await fetchToCompletion(imageResponseData.messageId, 0);
        console.log("\n=====================");
        console.log("COMPLETED IMAGE DATA");
        console.log(completedImageData);
        console.log("=====================");
        /**
         * INVOKE A VARIATION
         */
        const variationRes = await fetch(`${BASE_URL}/button`, {
            method: "POST",
            headers: AUTH_HEADERS,
            body: JSON.stringify({
                button: "U1",
                buttonMessageId: completedImageData.response.buttonMessageId,
            }),
        });
        const variationResponseData = await variationRes.json();
        console.log("\n=====================");
        console.log("IMAGE VARIATION MESSAGE DATA");
        console.log(variationResponseData);
        console.log("=====================");
        const completedVariationData = await fetchToCompletion(variationResponseData.messageId, 0);
        console.log("\n=====================");
        console.log("COMPLETED VARIATION DATA");
        console.log(completedVariationData);
        console.log("=====================");
        res.status(200).json(completedVariationData);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export { aiuRouter };
