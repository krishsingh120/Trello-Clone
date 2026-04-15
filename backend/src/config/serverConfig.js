// Reads backend environment variables and exports runtime constants.
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DEFAULT_MEMBER_ID: parseInt(process.env.DEFAULT_MEMBER_ID, 10) || 1,
};
