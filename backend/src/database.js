const mysql = require('mysql2/promise'); // Driverul mysql2 permite JavaScript sa comunice cu MySQL

const pool = mysql.createPool({ 
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', 
  database: process.env.DB_NAME || 'ipm'
});

module.exports = pool;