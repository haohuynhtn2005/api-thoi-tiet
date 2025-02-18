const mongoConnect = require('../../common/mongoConnect');
const langSeed = require('./langSeed');
const locationSeed = require('./locationSeed');

async function seeder() {
  await mongoConnect();
  await locationSeed();
  await langSeed();
  console.log('Finished seeding');
  process.exit(0);
}

seeder();
