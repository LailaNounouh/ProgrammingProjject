#!/usr/bin/env node

/**
 * Test script voor users database operaties
 */

require('dotenv').config();
const db = require('./config/database');

async function testUsersDatabase() {
  let connection;
  
  try {
    console.log('🔗 Testing database connection...');
    
    // Test basic connection
    const [testResult] = await db.execute('SELECT 1 as test');
    console.log('✅ Database connection successful');

    // Test Studenten table
    console.log('\n📚 Testing Studenten table...');
    const [studenten] = await db.execute(`
      SELECT student_id, naam, email 
      FROM Studenten 
      LIMIT 3
    `);
    console.log(`Found ${studenten.length} students:`);
    console.table(studenten);

    // Test Werkzoekenden table
    console.log('\n💼 Testing Werkzoekenden table...');
    const [werkzoekenden] = await db.execute(`
      SELECT werkzoekende_id, naam, email 
      FROM Werkzoekenden 
      LIMIT 3
    `);
    console.log(`Found ${werkzoekenden.length} werkzoekenden:`);
    console.table(werkzoekenden);

    // Test combined users query (like the API does)
    console.log('\n👥 Testing combined users query...');
    const [studentenForAPI] = await db.execute(`
      SELECT student_id AS id, naam, email, "student" AS rol 
      FROM Studenten
    `);
    const [werkzoekendenForAPI] = await db.execute(`
      SELECT werkzoekende_id AS id, naam, email, "werkzoekende" AS rol 
      FROM Werkzoekenden
    `);
    
    const allUsers = [...studentenForAPI, ...werkzoekendenForAPI];
    console.log(`Total users: ${allUsers.length}`);
    console.table(allUsers.slice(0, 5)); // Show first 5

    // Test update operation (if there are users)
    if (allUsers.length > 0) {
      const testUser = allUsers[0];
      console.log(`\n🧪 Testing update for user ${testUser.id} (${testUser.rol})...`);
      
      const originalName = testUser.naam;
      const testName = `${originalName}_TEST`;
      
      let updateResult;
      if (testUser.rol === 'student') {
        [updateResult] = await db.execute(
          'UPDATE Studenten SET naam = ? WHERE student_id = ?',
          [testName, testUser.id]
        );
      } else {
        [updateResult] = await db.execute(
          'UPDATE Werkzoekenden SET naam = ? WHERE werkzoekende_id = ?',
          [testName, testUser.id]
        );
      }
      
      console.log(`✅ Update successful: ${updateResult.affectedRows} row(s) affected`);
      
      // Revert the change
      if (testUser.rol === 'student') {
        await db.execute(
          'UPDATE Studenten SET naam = ? WHERE student_id = ?',
          [originalName, testUser.id]
        );
      } else {
        await db.execute(
          'UPDATE Werkzoekenden SET naam = ? WHERE werkzoekende_id = ?',
          [originalName, testUser.id]
        );
      }
      
      console.log('🔄 Test change reverted');
    }

    console.log('\n🎉 All tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState
    });
  } finally {
    if (db && db.end) {
      await db.end();
      console.log('📡 Database connection closed');
    }
  }
}

// Run test if script is executed directly
if (require.main === module) {
  testUsersDatabase().catch(error => {
    console.error('Test script failed:', error);
    process.exit(1);
  });
}

module.exports = testUsersDatabase;
