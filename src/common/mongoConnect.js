const mongoose = require('mongoose');

const uri = 'mongodb://127.0.0.1:27017/';

const dbName = 'thoi-tiet';

async function mongoConnect() {
  try {
    await mongoose.connect(`${uri}${dbName}`);
    console.log('Connected to mongo successfully!');
  } catch (error) {
    console.error(error);
    console.log('Connect to mongo failed!');
  }
}

module.exports = mongoConnect;
