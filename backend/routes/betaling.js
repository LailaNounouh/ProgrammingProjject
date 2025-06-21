const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '10.2.160.211',
  user: process.env.DB_USER || 'groep13',
  password: process.env.DB_PASS || 'aijQ8ZSp',
  database: process.env.DB_NAME || 'careerlaunch',
  port: process.env.DB_PORT || 3306
});

module.exports = pool;
