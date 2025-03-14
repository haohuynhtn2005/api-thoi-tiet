const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

async function userSeed() {
  await User.deleteMany();
  const salt = await bcrypt.genSalt(10);
  const users = [
    {
      name: 'Admin',
      email: 'admin@mail.com',
      password: await bcrypt.hash('', salt),
      role: 'admin',
    },
    {
      name: 'Staff 1',
      email: 'staff1@mail.com',
      password: await bcrypt.hash('', salt),
      role: 'staff',
    },
    {
      name: 'User 1',
      email: 'user1@mail.com',
      password: await bcrypt.hash('', salt),
    },
    ...Array.from({ length: 12 }).map((_, idx) => ({
      name: faker.person.fullName(),
      email: `staff${idx + 2}@.mail.com`,
      password: bcrypt.hashSync('', salt),
      role: 'staff',
    })),
    ...Array.from({ length: 12 }).map(() => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: bcrypt.hashSync('', salt),
      role: 'user',
    })),
  ];

  await User.insertMany(users);
}

module.exports = userSeed;
