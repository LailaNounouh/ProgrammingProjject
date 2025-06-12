require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Class2025',
      database: 'careerlaunch'
    });

    console.log('Database connectie succesvol!');

    //test query om  nieuwe tabellen te controleren

const [rows] = await connection.execute(
      'SHOW TABLES LIKE "event_participants"'
    );
  
     if (rows.length > 0) {
      console.log('✓ event_participants tabel gevonden');
    } else {
      console.log('✗ event_participants tabel niet gevonden');
    }

    await connection.end();
  } catch (error) {
    console.error('Database connectie fout:', error);
  }
}

testConnection();