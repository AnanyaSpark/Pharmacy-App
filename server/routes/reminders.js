const express = require('express');
const router = express.Router();
const { getDb } = require('../database/db');

// Create reminder
router.post('/', (req, res) => {
  const { user_id, medicine_name, reminder_time, frequency } = req.body;

  if (!user_id || !medicine_name || !reminder_time || !frequency) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const db = getDb();
  db.run(
    `INSERT INTO medicine_reminders (user_id, medicine_name, reminder_time, frequency)
     VALUES (?, ?, ?, ?)`,
    [user_id, medicine_name, reminder_time, frequency],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: 'Reminder created successfully',
        reminderId: this.lastID
      });
    }
  );
});

// Get user reminders
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const db = getDb();

  db.all(
    `SELECT * FROM medicine_reminders WHERE user_id = ? AND is_active = 1 ORDER BY reminder_time`,
    [userId],
    (err, reminders) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(reminders);
    }
  );
});

// Update reminder
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { medicine_name, reminder_time, frequency, is_active } = req.body;
  const db = getDb();

  db.run(
    `UPDATE medicine_reminders 
     SET medicine_name = ?, reminder_time = ?, frequency = ?, is_active = ?
     WHERE id = ?`,
    [medicine_name, reminder_time, frequency, is_active !== undefined ? is_active : 1, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Reminder not found' });
      }
      res.json({ message: 'Reminder updated successfully' });
    }
  );
});

// Delete reminder
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();

  db.run(`UPDATE medicine_reminders SET is_active = 0 WHERE id = ?`, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    res.json({ message: 'Reminder deleted successfully' });
  });
});

module.exports = router;

