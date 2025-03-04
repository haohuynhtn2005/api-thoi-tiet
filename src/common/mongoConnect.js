const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

async function mongoConnect() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to mongo successfully!');
  } catch (error) {
    console.error(error);
    console.log('Connect to mongo failed!');
  }
}

module.exports = mongoConnect;
