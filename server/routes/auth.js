const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { getDb } = require('../database/db');

// Register user
router.post('/register', async (req, res) => {
  const { name, email, phone, address, password, type } = req.body;

  if (!name || !email || !phone || !address || !password || !type) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!['user', 'pharmacy', 'delivery'].includes(type)) {
    return res.status(400).json({ error: 'Invalid user type' });
  }

  try {
    const db = getDb();
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (name, email, phone, address, password, type) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, phone, address, hashedPassword, type],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint')) {
            return res.status(400).json({ error: 'Email already registered' });
          }
          return res.status(500).json({ error: err.message });
        }
        res.json({ 
          message: 'Registration successful',
          userId: this.lastID,
          type: type
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password, type } = req.body;

  if (!email || !password || !type) {
    return res.status(400).json({ error: 'Email, password, and type are required' });
  }

  try {
    const db = getDb();
    db.get(
      `SELECT * FROM users WHERE email = ? AND type = ?`,
      [email, type],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
          message: 'Login successful',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            type: user.type
          }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
router.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();

  db.get(`SELECT id, name, email, phone, address, type FROM users WHERE id = ?`, 
    [id], (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    });
});

module.exports = router;

