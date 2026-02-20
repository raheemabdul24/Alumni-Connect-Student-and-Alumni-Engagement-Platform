const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Debug environment variables used for DB connection
console.log('DB env:', {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD_type: typeof process.env.DB_PASSWORD,
  DB_PASSWORD_value_preview:
    process.env.DB_PASSWORD && process.env.DB_PASSWORD.length > 0 ? '***' : 'EMPTY',
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

module.exports = sequelize;
