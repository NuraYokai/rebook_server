require("dotenv").config();
const mysql = require("mysql");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.getConnection((error) => {
  if (error) {
    console.error("Error connecting to MySQL: ", error);
    return;
  }
  console.log("Successfully connected to MySQL");
});

module.exports = pool;
