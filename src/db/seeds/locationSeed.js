const path = require('node:path');
const fs = require('node:fs/promises');
const LocationModel = require('../../models/LocationModel');

async function locationSeed() {
  const data = JSON.parse(
    await fs.readFile(path.resolve(__dirname, '../data/locations.json'))
  );
  await LocationModel.deleteMany();
  await LocationModel.insertMany(data);
}

module.exports = locationSeed;
