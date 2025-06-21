const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '10.2.160.211',
  user: 'groep13',
  password: 'aijQ8ZSp',
  database: 'careerlaunch',
  port: 3306
});

module.exports = pool;
