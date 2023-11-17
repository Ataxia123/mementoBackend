import passport from 'passport';
import express, { Router } from 'express';
import path from 'path';
import { MongoClient } from 'mongodb'
import { fileURLToPath } from 'url';
import https from 'https';
import xml2js from 'xml2js';
import { SignedOffchainAttestation } from "@ethereum-attestation-service/eas-sdk";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
await client.connect();
console.log('Connected successfully to server');
// Database Name
const dbName = 'mementoMori';
const dbRouter = Router();

const useRegex = (input) => {
  let regex = /"displayid":(?<displayid>[0-9]+)/i;
  input = input.match(regex);
  let displayid = input?.groups.displayid;
  return displayid;
}  //let response = result.wowhead.item[0].json[0];
dbRouter.use(express.static(path.join(__dirname, "../../dist/")));
console.log(__dirname);



dbRouter.get('/database', async (req, res) => {
  // Use connect method to connect to the server
  const db = client.db(dbName); // Connect to the Database
  const collection = db.collection('players'); // Access to 'players' collection
  // Access to 'players' collection
  const itemCollection = db.collection('items'); // 


  const items = await itemCollection.find({}).toArray();
  const players = await collection.find({}).toArray();

  // Get all players from collection
  res.json({ items: items, players: players }); // Response to MongoClient
});


dbRouter.post('/db', async (req, res) => {
  // Write the generated HTML to the document body
  passport.authenticate('bnet', { failureMessage: 'Woopsie' });
  // Parse JSON body



  const db = client.db(dbName); // Connect to the database
  const collection = db.collection('players');
  const itemCollection = db.collection('items'); // 
  const attestationCollection = db.collection('attestations'); //
  // assumed input
  const inputPlayerData = req.body;

  // function to save player
  async function savePlayer(playerData) {
    // Save only if player id does not exist
    await collection.updateOne(
      { id: playerData.id },
      { $setOnInsert: playerData },
      { upsert: true }, // this creates new document if none match the filter
    );
    await attestationCollection.updateOne(
      { id: playerData.id },
      { $setOnInsert: playerData.Attestation },
      { upsert: true }, // this creates new document if none match the filter
    );
  }

  // function to save item from given player
  async function savePlayerItems(item, playerData) {
    let itemId = item.item.id;
    let itemInfoUrl = `https://www.wowhead.com/item=${itemId}&xml`;

    let data = '';
    const parser = new xml2js.Parser();
    https.get(itemInfoUrl, function(res) {
      try {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          res.on('data', function(data_) {
            data += data_.toString();

          });
          res.on('end', function() {

            parser.parseString(data, async function(err, result) {
              let dispid = result.wowhead.item[0].json[0];
              let response = useRegex(dispid)
              console.log(response)

              const itemData = {
                itemId: itemId,
                displayId: response,
                playerName: playerData.name,
              };
              return await itemCollection.updateOne(
                { itemId: itemId },
                { $setOnInsert: itemData },
                { upsert: true }, // this creates new document if none match the filter
              );
              // Save only if item id does not exist for that player

            });

          })



        }
      } catch (e) {
        parser.on('error', function(err) { console.log('Parser error', err); });
      }
    });


  }

  // Saving player and item
  async function savePlayerAndItems(playerData) {
    const playerItems = playerData.equipped_items || [];

    try {
      await savePlayer(playerData);
      await Promise.all(playerItems.map(item => savePlayerItems(item, playerData)));
    } catch (error) {
      return console.error('Unable to save player data. Error:', error);
    }

    return console.log('Player data saved');
  }

  // Finally call the function with input
  savePlayerAndItems(inputPlayerData);






  res.json({ status: 'success', message: 'Players added to DB', body: inputPlayerData });



})







export { dbRouter };

