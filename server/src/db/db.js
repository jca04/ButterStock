const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "localhost",
  database: "versastock",
  user: "root",
  password: "",
});

module.exports = conn;
