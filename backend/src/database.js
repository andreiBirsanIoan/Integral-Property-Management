const mysql = require('mysql2/promise');//driverul myysql2 permite JavaScript sa comunice cu MYSQL

const pool = mysql.createPool({ //conexiuni deschise in avans, se tin deschise aceleasi conexiuni si se reutilizeaza
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = pool;