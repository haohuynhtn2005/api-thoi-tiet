require('dotenv/config');
const mongoConnect = require('../../common/mongoConnect');
const langSeed = require('./langSeed');
const locationSeed = require('./locationSeed');
const newsSeed = require('./newsSeed');
const userSeed = require('./userSeed');

const seeders = {
  location: locationSeed,
  lang: langSeed,
  user: userSeed,
  news: newsSeed,
};

async function seeder() {
  await mongoConnect();
  const seedName = process.argv[2];
  if (seedName) {
    const seedFunction = seeders[seedName];
    if (seedFunction) {
      await seedFunction();
      console.log(`Finished seeding ${seedName}`);
    } else {
      console.log(`Seeder ${seedName} not found`);
    }
  } else {
    for (const seed in seeders) {
      await seeders[seed]();
    }
    console.log('Finished seeding all');
  }
  process.exit(0);
}

seeder();
