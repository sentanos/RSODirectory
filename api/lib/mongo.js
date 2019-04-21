const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'rsodirectory';

// Create a new MongoClient
const client = new MongoClient(url);

module.exports = async () => {
  await client.connect();
  console.log("Connected to server");
  return client.db(dbName);
};

