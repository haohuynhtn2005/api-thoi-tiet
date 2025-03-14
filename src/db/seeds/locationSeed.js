const path = require('node:path');
const fs = require('node:fs/promises');
const Location = require('../../models/Location');

async function locationSeed() {
  const data = JSON.parse(
    await fs.readFile(path.resolve(__dirname, '../data/locations.json'))
  );
  await Location.deleteMany();
  await Location.insertMany(data);
}

module.exports = locationSeed;
