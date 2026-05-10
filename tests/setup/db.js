// tests/setup/db.js
// Integration Test DB Setup using mongodb-memory-server
// Provides connect, closeDatabase, clearDatabase for use in test suites

const path = require('path');
const mongoose = require('mongoose');

process.env.MONGOMS_MD5_CHECK = 'false';
process.env.MONGOMS_DOWNLOAD_DIR = path.join(__dirname, '..', '.cache', 'mongodb-memory-server');
process.env.MONGOMS_DEBUG = 'false';

const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

/**
 * Connect to the in-memory database.
 */
module.exports.connect = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

/**
 * Drop database, close connection, and stop server.
 */
module.exports.closeDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) await mongoServer.stop();
};

/**
 * Remove all data from all db collections.
 */
module.exports.clearDatabase = async () => {
  if (mongoose.connection.readyState === 0) return;

  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
};
