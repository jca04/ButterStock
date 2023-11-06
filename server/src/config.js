require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_DATABASE: process.env.DB_DATABASE,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_PORT: process.env.DB_PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  KEY_ENCRYPT: process.env.KEY_ENCRYPT,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,

};