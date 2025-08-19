const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

console.log('🟢 Notifications router loaded');

// GET alle notifications voor een bedrijf
router.get('/bedrijf/:bedrijfId', authenticateToken, async (req, res) => {
  console.log('🔵 GET /notifications/bedrijf/:bedrijfId called');
  console.log('🔵 bedrijfId:', req.params.bedrijfId);
  console.log('🔵 User from token:', req.user);
  
  const { bedrijfId } = req.params;
  
  try {
    console.log('🔵 Executing database query...');
    
    // Check if Notifications table exists first
    const [tableCheck] = await db.execute("SHOW TABLES LIKE 'Notifications'");
    console.log('🔵 Table check result:', tableCheck);
    
    if (tableCheck.length === 0) {
      console.log('🔴 Notifications table does not exist!');
      return res.status(500).json({ error: 'Notifications table not found' });
    }
    
    const [rows] = await db.execute(
      `SELECT 
        notification_id,
        user_id,
        user_type,
        type,
        bericht,
        related_data,
        gelezen,
        created_at
       FROM Notifications 
       WHERE user_id = ? AND user_type = 'bedrijf'
       ORDER BY created_at DESC
       LIMIT 50`,
      [bedrijfId]
    );

    console.log('🟢 Database query successful, rows found:', rows.length);

    // Parse JSON data
    const notifications = rows.map(notif => ({
      ...notif,
      related_data: notif.related_data ? JSON.parse(notif.related_data) : null
    }));

    console.log('🟢 Sending notifications:', notifications);
    res.json(notifications);
  } catch (error) {
    console.error('🔴 Fout bij ophalen notifications:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// GET alle notifications voor een student
router.get('/student/:studentId', authenticateToken, async (req, res) => {
  console.log('🔵 GET /notifications/student/:studentId called');
  const { studentId } = req.params;
  
  try {
    const [rows] = await db.execute(
      `SELECT 
        notification_id,
        user_id,
        user_type,
        type,
        bericht,
        related_data,
        gelezen,
        created_at
       FROM Notifications 
       WHERE user_id = ? AND user_type = 'student'
       ORDER BY created_at DESC
       LIMIT 50`,
      [studentId]
    );

    // Parse JSON data
    const notifications = rows.map(notif => ({
      ...notif,
      related_data: notif.related_data ? JSON.parse(notif.related_data) : null
    }));

    res.json(notifications);
  } catch (error) {
    console.error('🔴 Fout bij ophalen notifications:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Test route om te controleren of de router werkt
router.get('/test', (req, res) => {
  console.log('🔵 GET /notifications/test called');
  res.json({ message: 'Notifications router works!', timestamp: new Date() });
});

// PUT markeer notification als gelezen
router.put('/:notificationId/read', authenticateToken, async (req, res) => {
  console.log('🔵 PUT /:notificationId/read called');
  const { notificationId } = req.params;
  
  try {
    await db.execute(
      'UPDATE Notifications SET gelezen = TRUE WHERE notification_id = ?',
      [notificationId]
    );
    
    console.log('🟢 Notification marked as read:', notificationId);
    res.json({ success: true });
  } catch (error) {
    console.error('🔴 Fout bij markeren als gelezen:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE verwijder notification
router.delete('/:notificationId', authenticateToken, async (req, res) => {
  console.log('🔵 DELETE /:notificationId called');
  const { notificationId } = req.params;
  
  try {
    await db.execute(
      'DELETE FROM Notifications WHERE notification_id = ?',
      [notificationId]
    );
    
    console.log('🟢 Notification deleted:', notificationId);
    res.json({ success: true });
  } catch (error) {
    console.error('🔴 Fout bij verwijderen notification:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create nieuwe notification (gebruikt door andere routes)
router.post('/create', async (req, res) => {
  console.log('🔵 POST /create called');
  console.log('🔵 Body:', req.body);
  
  const { userId, userType, type, bericht, relatedData } = req.body;
  
  try {
    await db.execute(
      `INSERT INTO Notifications (user_id, user_type, type, bericht, related_data)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, userType, type, bericht, JSON.stringify(relatedData)]
    );
    
    console.log('🟢 Notification created successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('🔴 Fout bij maken notification:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT markeer alle notifications van een user als gelezen
router.put('/markall/:userId/:userType', authenticateToken, async (req, res) => {
  const { userId, userType } = req.params;
  
  try {
    await db.execute(
      'UPDATE Notifications SET gelezen = TRUE WHERE user_id = ? AND user_type = ?',
      [userId, userType]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Fout bij markeren alle als gelezen:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE verwijder alle gelezen notifications van een user
router.delete('/cleanup/:userId/:userType', authenticateToken, async (req, res) => {
  const { userId, userType } = req.params;
  
  try {
    await db.execute(
      'DELETE FROM Notifications WHERE user_id = ? AND user_type = ? AND gelezen = TRUE',
      [userId, userType]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Fout bij opruimen notifications:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET ongelezen count voor dashboard badge
router.get('/unread-count/:userId/:userType', authenticateToken, async (req, res) => {
  const { userId, userType } = req.params;
  
  try {
    const [rows] = await db.execute(
      'SELECT COUNT(*) as count FROM Notifications WHERE user_id = ? AND user_type = ? AND gelezen = FALSE',
      [userId, userType]
    );
    
    res.json({ count: rows[0].count });
  } catch (error) {
    console.error('Fout bij ophalen unread count:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

console.log('🟢 All notification routes registered');

module.exports = router;
