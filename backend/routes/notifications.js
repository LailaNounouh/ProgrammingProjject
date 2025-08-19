const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// GET alle notifications voor een bedrijf
router.get('/bedrijf/:bedrijfId', authenticateToken, async (req, res) => {
  const { bedrijfId } = req.params;
  
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
       WHERE user_id = ? AND user_type = 'bedrijf'
       ORDER BY created_at DESC
       LIMIT 50`,
      [bedrijfId]
    );

    // Parse JSON data
    const notifications = rows.map(notif => ({
      ...notif,
      related_data: notif.related_data ? JSON.parse(notif.related_data) : null
    }));

    res.json(notifications);
  } catch (error) {
    console.error('Fout bij ophalen notifications:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET alle notifications voor een student
router.get('/student/:studentId', authenticateToken, async (req, res) => {
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
    console.error('Fout bij ophalen notifications:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT markeer notification als gelezen
router.put('/:notificationId/read', authenticateToken, async (req, res) => {
  const { notificationId } = req.params;
  
  try {
    await db.execute(
      'UPDATE Notifications SET gelezen = TRUE WHERE notification_id = ?',
      [notificationId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Fout bij markeren als gelezen:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE verwijder notification
router.delete('/:notificationId', authenticateToken, async (req, res) => {
  const { notificationId } = req.params;
  
  try {
    await db.execute(
      'DELETE FROM Notifications WHERE notification_id = ?',
      [notificationId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Fout bij verwijderen notification:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create nieuwe notification (gebruikt door andere routes)
router.post('/create', async (req, res) => {
  const { userId, userType, type, bericht, relatedData } = req.body;
  
  try {
    await db.execute(
      `INSERT INTO Notifications (user_id, user_type, type, bericht, related_data)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, userType, type, bericht, JSON.stringify(relatedData)]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Fout bij maken notification:', error);
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

module.exports = router;
