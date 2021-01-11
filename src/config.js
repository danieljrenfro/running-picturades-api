module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://danielrenfro@localhost/running-picturades',
  CLIENT_ORIGIN: 'https://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || 'my-super-secret-secret'
};