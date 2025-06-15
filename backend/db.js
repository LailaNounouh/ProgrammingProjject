require('dotenv').config();
const mysql = require('mysql2');

const isProd = process.env.NODE_ENV === 'production';


const pool = mysql.createPool({
  host: isProd ? process.env.DB_HOST_PROD : process.env.DB_HOST_DEV,
  user: isProd ? process.env.DB_USER_PROD : process.env.DB_USER_DEV,
  password: isProd ? process.env.DB_PASS_PROD : process.env.DB_PASS_DEV,
  database: isProd ? process.env.DB_NAME_PROD : process.env.DB_NAME_DEV,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
