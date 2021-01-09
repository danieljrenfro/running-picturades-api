const { config } = require('dotenv/types');

require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": (process.env.NODE_ENV === 'test')
    ? config.TEST_DATABASE_URL
    : config.DATABASE_URL
};