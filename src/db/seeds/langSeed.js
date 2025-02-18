const path = require('node:path');
const fs = require('node:fs/promises');
const LangModel = require('../../models/LangModel');

async function langSeed() {
  const data = JSON.parse(
    await fs.readFile(path.resolve(__dirname, '../data/lang.json'))
  );
  await LangModel.deleteMany();
  await LangModel.insertMany(data);
}

module.exports = langSeed;
