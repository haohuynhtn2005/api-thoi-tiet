const path = require('node:path');
const fs = require('node:fs/promises');
const Lang = require('../../models/Lang');

async function langSeed() {
  const data = JSON.parse(
    await fs.readFile(path.resolve(__dirname, '../data/lang.json'))
  );
  await Lang.deleteMany();
  await Lang.insertMany(data);
}

module.exports = langSeed;
