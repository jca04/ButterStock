const mysql = require("mysql");
const {promisify} = require('util');

const pool = mysql.createPool({
  host: "localhost",
  database: "butterStock",
  user: "root",
  password: "",
});

pool.getConnection((err, connection) => {
  if (err){
    console.log(err.code)
  }

  if (connection){
    connection.release();
    console.log("db is connected")
  } 
  return;
});

pool.query = promisify(pool.query);

module.exports = pool;
