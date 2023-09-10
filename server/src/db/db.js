const mysql = require("mysql");
const config = require("../config");
const { promisify } = require("util");

const pool = mysql.createPool({
  host:  config.DB_HOST,
  database: config.DB_DATABASE,
  user: config.DB_USE,
  password: config.DB_PASS,
  
});

pool.getConnection((err, connection) => {
  if (err) {
    console.log(err.code);
  }

  if (connection) {
    connection.release();
    console.log("db is connected");
  }
  return;
});

pool.query = promisify(pool.query);

module.exports = pool;
