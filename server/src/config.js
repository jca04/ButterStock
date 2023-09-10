require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  DB_HOST : process.env.DB_HOST,
  DB_DATABASE : process.env.DB_DATABASE,
  DB_USE : process.env.DB_USE,
  DB_PASS : process.env.DB_PASS,
  JWT_SECRET: process.env.JWT_SECRET,
};
