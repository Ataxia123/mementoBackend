import express, { Router } from 'express';
import { MongoClient } from 'mongodb'
import { fileURLToPath } from 'url';
import type { Request, Response } from "express";
import { generateScannerOutput } from './aiu/oai/metaScan.js';
import { fetchToCompletion } from "./aiu/tnl/apiHandler.js"
import { generateCodexOutput } from "./aiu/oai/heroCodex.js"

import * as fs from "fs/promises";
import {
    Document,
    storageContextFromDefaults,
    VectorStoreIndex,
    SimpleMongoReader,
    SummaryRetrieverMode,
    MongoDBAtlasVectorSearch,
    serviceContextFromDefaults,
    BaseEmbedding,
    LLM,
    MistralAI,
    MistralAIEmbedding,
    ContextChatEngine,
} from "llamaindex";

import { stdin as input, stdout as output } from "node:process";
import readline from "node:readline/promises";
import type { NftData, PilotState, ShipState, Location } from "../types/appTypes.js";
export const OLLAMA_HOST = `127.0.0.1:11435`;
export const OLLAMA_COMMAND = `OLLAMA_ORIGINS=* OLLAMA_HOST=${OLLAMA_HOST} ollama serve`;
const url = process.env.MONGODB_URL || 'mongodb+srv://At0x:r8MzJR2r4A1xlMOA@cluster1.upfglfg.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(url);
await client.connect();
console.log('Connected successfully to server');
// Database Name
const dbName = 'aiUniverse';
const indexName = "Navi"
const aiuRouter = Router();
const TNL_API_KEY = process.env.MIDJOURNEY_AUTH_TOKEN || "";

const BASE_URL = "https://api.thenextleg.io/v2";
const AUTH_TOKEN = TNL_API_KEY;
const AUTH_HEADERS = {
    Authorization: `Bearer ${AUTH_TOKEN}`,
    "Content-Type": "application/json",
}
//MISTRAL TRIALS
/*
async function rag(llm: LLM, embedModel: BaseEmbedding, query: string) {
    // Load essay from abramov.txt in Node
    const path = "node_modules/llamaindex/examples/abramov.txt";

    const essay = await fs.readFile(path, "utf-8");

    // Create Document object with essay
    const document = new Document({ text: essay, id_: path });

    // Split text and create embeddings. Store them in a VectorStoreIndex
    const serviceContext = serviceContextFromDefaults({ llm, embedModel });

    const index = await VectorStoreIndex.fromDocuments([document], {
        serviceContext,
    });

    // Query the index
    const queryEngine = index.asQueryEngine();
    const response = await queryEngine.query(query);
    return response.response;
}

(async () => {
    // embeddings
    const embedding = new MistralAIEmbedding();
    const embeddingsResponse = await embedding.getTextEmbedding(
        "What is the best French cheese?",
    );
    console.log(
        `MistralAI embeddings are ${embeddingsResponse.length} numbers long\n`,
    );

    // chat api (non-streaming)
    const llm = new MistralAI({ model: "mistral-tiny" });
    const response = await llm.chat([
        { content: "What is the best French cheese?", role: "user" },
    ]);
    console.log(response.message.content);

    // chat api (streaming)
    const stream = await llm.chat(
        [{ content: "Who is the most renowned French painter?", role: "user" }],
        undefined,
        true,
    );
    for await (const chunk of stream) {
        process.stdout.write(chunk);
    }

    // rag
    const ragResponse = await rag(
        llm,
        embedding,
        "What did the author do in college?",
    );
    console.log(ragResponse);
})();
*/
async function llamaindex(payload: string, id: string) {
    const vectorStore = new MongoDBAtlasVectorSearch({
        mongodbClient: client,
        dbName,
        collectionName: "naviIndex", // this is where your embeddings will be stored
        indexName, // this is the name of the index you will need to create
    });

    // now create an index from all the Documents and store them in Atlas
    const storageContext = await storageContextFromDefaults({ vectorStore });

    const essay = payload;


    // Create Document object with essay
    const document = new Document({ text: essay, id_: id });

    // Split text and create embeddings. Store them in a VectorStoreIndex
    await VectorStoreIndex.fromDocuments([document], { storageContext });
    console.log(
        `Successfully created embeddings in the MongoDB collection ${dbName}`,
    );
}

async function loadAndIndex() {
    // Create a new client and connect to the server
    // load objects from mongo and convert them into LlamaIndex Document objects
    // llamaindex has a special class that does this for you
    // it pulls every object in a given collection
    const reader = new SimpleMongoReader(client);
    const documents = await reader.loadData(dbName, "heroCodex", [
        "full_text",
    ]);

    // create Atlas as a vector store
    const vectorStore = new MongoDBAtlasVectorSearch({
        mongodbClient: client,
        dbName,
        collectionName: "naviIndex", // this is where your embeddings will be stored
        indexName, // this is the name of the index you will need to create
    });

    // now create an index from all the Documents and store them in Atlas
    const storageContext = await storageContextFromDefaults({ vectorStore });
    await VectorStoreIndex.fromDocuments(documents, { storageContext });
    console.log(
        `Successfully created embeddings in the MongoDB collection ${dbName}`,
    );
    return await navi();
}

async function navi() {
    //Dummy test code
    const serviceContext = serviceContextFromDefaults();
    //Where the real code starts
    const vectorStore = new MongoDBAtlasVectorSearch({
        mongodbClient: client,
        dbName: dbName,
        collectionName: "naviIndex", // this is where your embeddings will be stored
        indexName, // this is the name of the index you will need to create
    });

    // now create an index from all the Documents and store them in Atlas

    const index = await VectorStoreIndex.fromVectorStore(vectorStore, serviceContext);
    //
    const retriever = index.asRetriever({ similarityTopK: 5 });

    //Making Vector Store from documents
    //
    const chatEngine = new ContextChatEngine({ retriever });
    const rl = readline.createInterface({ input, output });

    return async (query: any) => {

        query = await rl.question("Query: ");
        const response = await chatEngine.chat(query);
        return response.toString();
    };




}

async function newDay(capname: string) {
    const serviceContext = serviceContextFromDefaults();
    const vectorStore = new MongoDBAtlasVectorSearch({
        mongodbClient: client,
        dbName: dbName,
        collectionName: "naviIndex", // this is where your embeddings will be stored
        indexName, // this is the name of the index you will need to create
    });

    // now create an index from all the Documents and store them in Atlas

    const index = await VectorStoreIndex.fromVectorStore(vectorStore, serviceContext);
    const retriever = index.asRetriever({ similarityTopK: 5 });


    // Create query engine
    const queryEngine = index.asQueryEngine({

        retriever
    });
    const response = await queryEngine.query(
        `Generate a status report from the prespective of the the following captain: ${capname}
`
    );


    // Output response
    console.log(response.response);
    return response.response;
}

aiuRouter.post('/codex', async (req, res) => {

    const db = client.db(dbName); // Connect to the Database
    const heroCodex = db.collection('heroCodex');
    if (req.method === "POST") {

        const payload = await req.body;
        const { image, codexData, capname } = payload;
        console.log(payload);



        try {
            const attestationRecord = {
                _id: codexData.nftQuery.nftQuery.nftId,
                image: image,
                data: codexData,
                full_text: JSON.stringify(codexData),
            };
            //await llamaindex(attestationRecord.full_text, attestationRecord._id, capname);

            await heroCodex.updateOne(
                { id: attestationRecord._id },
                { $setOnInsert: attestationRecord },
                { upsert: true },
            );

            res.status(200).json({ message: "Data embedded and saved successfully" });
        } catch (error) {
            res.status(500).json({ error });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }

})

aiuRouter.post('/navi', async (req, res) => {
    await navi();

    // Output response
    res.json({ status: "success" })

});


aiuRouter.post('/attest', async (req, res) => {
    // Use connect method to connect to the server
    const db = client.db(dbName); // Connect to the Database
    const pilots = db.collection('pilots'); // Access to 'players' collection
    // Access to 'players' collection
    const ships = db.collection('ships');
    const locations = db.collection('locations');
    const quipux = db.collection('quipuxs');

    const data = await req.body
    const { pilotData, pilotAttestation, shipData, address, heroCodexId } = data.body
    console.log(data, "data")

    // function to save player
    async function payRespects(
        pilot: PilotState, pilotAttestation: { updatedData: string, uid: string },
        shipData: { state: ShipState, image: string, location: Location },
        address: string,
        heroCodexId: any) {
        // Save only if player id does not exist
        //
        //
        const oc = pilotAttestation
        const pilotRecord = {
            _id: oc.uid,
            address: address,
            pilotData: pilot,
            locationId: shipData.location.locationId,
            shipData: shipData,
            nearestPlanetId: shipData.location.nearestLocationId,
            locationData: shipData.location,
            heroCodexId,
            Attestation: oc,
            full_text: JSON.stringify({ pilot, shipData, heroCodexId })
        };


        await quipux.updateOne(
            { id: oc.uid },
            { $setOnInsert: pilotRecord },
            { upsert: true },
        );
    }
    try {
        await payRespects(pilotData, pilotAttestation, shipData, address, heroCodexId)
        // Get all players from collection
        res.status(200).json({ status: 'success', message: 'Players added to DB' });
    } catch (error) {
        res.status(500).json({ error: error });
    }

});

aiuRouter.get('/database', async (req, res) => {
    // Use connect method to connect to the server
    const db = client.db(dbName); // Connect to the Database
    const collection = db.collection('AIU_IPRs'); // Access to 'players' collection
    // Access to 'players' collection
    // Access to 'players' collection
    // const planetCollection = db.collection('planets')
    // const missionCollection = db.collection('missions');
    // const encounterCollection = db.collection('encounters');
    // const locationCollection = db.collection('locations');

    //const quipuxCollection = db.collection('quipuxs');
    const heroCodexCollection = db.collection('heroCodex');
    const heroCodexes = await heroCodexCollection.find({}).toArray();
    const pilotData = db.collection('pilots'); // 

    const beaconData = db.collection('beacons'); // 

    const locations = await beaconData.find({}).toArray();
    const pilots = await pilotData.find({}).toArray();
    //const encounters = await encounterCollection.find({}).toArray();
    //const quipux = await quipuxCollection.find({}).toArray();
    //const planets = await planetCollection.find({}).toArray();

    const database = { heroCodexes, locations, pilots }

    // Get all players from collection
    res.json({ database }); // Response to MongoClient
});




aiuRouter.post('/userPilot', async (req, res) => {
    const { address } = await req.body

    console.log(address, "address", req.body)
    const db = client.db(dbName);
    // Connect to the Database
    try {
        const locationCollection = db.collection('locations');
        const quipuxCollection = db.collection('quipuxs');
        const heroCodex = db.collection('heroCodex');
        const myHeroCodex = await heroCodex.find({}).toArray();
        const myQuipuxs = await quipuxCollection.find({ address: address }).toArray();
        const myLocations = await locationCollection.find({ address: address }).toArray();
        res.status(200).json({ myLocations, myQuipuxs, myHeroCodex })
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});

aiuRouter.post('/heroCodex', async (req: Request, res: Response) => {
    // Write the generated HTML to the document body
    // Parse JSON body
    const playerData = await req.body;
    const db = client.db(dbName); // Connect to the database
    const heroCodex = db.collection('heroCodex'); // 

    const beaconDb = db.collection('beacons'); // 
    // assumed input
    const beaconData = playerData.beaconData;
    const attestationData = {
        _id: playerData.heroCodex.heroId,
        Attestation: playerData,
    };

    await llamaindex(JSON.stringify(attestationData), attestationData._id);
    await heroCodex.updateOne(
        { _id: playerData.heroCodex.heroId },
        { $setOnInsert: attestationData },
        { upsert: true }, // this creates new document if none match the filter
    );
    const beData = {

        _id: playerData.beaconData.locationId,
        beaconData,
        fullText: JSON.stringify(playerData.beaconData),
    };

    await beaconDb.updateOne(
        { _id: beaconData.locationId },
        { $setOnInsert: beData },
        { upsert: true }, // this creates new document if none match the filter
    );


    res.json({ status: 'success', message: 'Players added to DB' }
    );
})

aiuRouter.post('/pilotShip', async (req: Request, res: Response) => {
    // Write the generated HTML to the document body
    // Parse JSON body
    const load = await req.body;
    const db = client.db(dbName); // Connect to the database
    const pilotCollection = db.collection('pilots'); // 

    const beaconDb = db.collection('beacons'); // 
    // assumed input
    const beaconData = load.beaconData;
    console.log(load, "load")
    const attestationData = {

        _id: load.address,
        address: load.address,
        load,
        fullText: JSON.stringify(load),
    };

    await llamaindex(JSON.stringify(attestationData.fullText), attestationData._id);

    await pilotCollection.updateOne(
        { _id: load.address },//address
        { $setOnInsert: attestationData },
        { upsert: true }, // this creates new document if none match the filter
    );
    const beData = {
        _id: beaconData.locationId,
        beaconData,
        fullText: JSON.stringify(beaconData),
    };

    await beaconDb.updateOne(
        { _id: beaconData.locationId },
        { $setOnInsert: beData },
        { upsert: true }, // this creates new document if none match the filter
    );

    res.json({ status: 'success', message: 'Players added to DB' }
    );
})

aiuRouter.post('/quipuxUpdate', async (req: Request, res: Response) => {
    // Write the generated HTML to the document body
    // Parse JSON body
    const da = await req.body;
    const load = da.newManifest;
    console.log(load, "load")
    const db = client.db(dbName); // Connect to the database
    const pilotCollection = db.collection('pilots'); // 
    const beaconDb = db.collection('beacons'); // 
    // assumed input

    const beaconData = load.currentLocation;
    console.log(load, "load")
    const attestationData = {
        _id: load.uid,
        address: load.address,
        load,
        fullText: JSON.stringify(load),
    };

    await llamaindex(attestationData.fullText, attestationData._id);

    await pilotCollection.updateOne(
        { _id: load.uid },//address
        { $setOnInsert: attestationData },
        { upsert: true }, // this creates new document if none match the filter
    );
    const beData = {
        _id: load.currentLocation.locationId,
        beaconData,
        fullText: JSON.stringify(load.beaconData),
    };

    await beaconDb.updateOne(
        { _id: beaconData.quadrantId },
        { $setOnInsert: beData },
        { upsert: true }, // this creates new document if none match the filter
    );

    res.json({ status: 'success', message: 'Players added to DB' }
    );

})


aiuRouter.post('/db', async (req: Request, res: Response) => {
    // Write the generated HTML to the document body
    // Parse JSON body
    const db = client.db(dbName); // Connect to the database
    const collection = db.collection('players');
    const attestationsDB = db.collection('attestations');
    const itemCollection = db.collection('items'); // 
    // assumed input
    const inputPlayerData = req.body;

    // function to save player
    async function savePlayer(playerData: any) {
        // Save only if player id does not exist
        await collection.updateOne(
            { id: playerData.id },
            { $setOnInsert: playerData },
            { upsert: true }, // this creates new document if none match the filter
        );
        const attestationData = {
            id: playerData.id,
            Attestation: JSON.parse(playerData.attestation),
        };
        await attestationsDB.updateOne(
            { id: playerData.id },
            { $setOnInsert: attestationData },
            { upsert: true }, // this creates new document if none match the filter
        );
    }
    res.json({ status: 'success', message: 'Players added to DB', body: inputPlayerData });

})

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
        } catch (error) {
            res.status(500).json({ error: "Error generating scanner output." });
        }
    } else {
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
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});



export { aiuRouter };

