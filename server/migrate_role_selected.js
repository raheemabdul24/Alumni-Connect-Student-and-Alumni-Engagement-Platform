require('dotenv').config();
const seq = require('./src/config/db');
const User = require('./src/models/user');

(async () => {
  try {
    await seq.sync({ alter: true });
    console.log('Schema synced with roleSelected column');

    await seq.query('UPDATE "Users" SET "roleSelected" = true WHERE "roleSelected" = false OR "roleSelected" IS NULL');
    console.log('Set roleSelected=true for all existing users');

    const users = await User.findAll({ attributes: ['name', 'email', 'role', 'roleSelected'] });
    users.forEach(u => console.log(u.name?.padEnd(22), '|', u.role?.padEnd(8), '| roleSelected:', u.roleSelected));
    console.log('Total:', users.length);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
