const User = require('../../models/User');
const bcrypt = require('bcryptjs');

async function userSeed() {
  await User.deleteMany({});
  const salt = await bcrypt.genSalt(10);
  const users = [
    {
      name: 'Admin',
      email: 'admin@mail.com',
      password: await bcrypt.hash('1234', salt),
      role: 'admin',
    },
    {
      name: 'Staff 01',
      email: 'staff01@mail.com',
      password: await bcrypt.hash('1234', salt),
      role: 'staff',
    },
    {
      name: 'User 01',
      email: 'user01@mail.com',
      password: await bcrypt.hash('1234', salt),
    },
    {
      name: 'User 02',
      email: 'user02@mail.com',
      password: await bcrypt.hash('1234', salt),
    },
  ];
  await User.insertMany(users);
}

module.exports = userSeed;
