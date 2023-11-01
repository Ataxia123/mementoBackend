import { MongoClient } from 'mongodb'
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL

const client = new MongoClient(process.env.MONGODB_URI);

// Database Name
const dbName = 'mementoMori';

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('players');

  // the following code examples can be pasted here...

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
