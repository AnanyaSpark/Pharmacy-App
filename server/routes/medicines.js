const express = require('express');
const router = express.Router();
const { getDb } = require('../database/db');

// Get all medicines from all pharmacies
router.get('/', (req, res) => {
  const db = getDb();
  db.all(
    `SELECT m.*, u.name as pharmacy_name, u.address as pharmacy_address, u.phone as pharmacy_phone
     FROM medicines m
     JOIN users u ON m.pharmacy_id = u.id
     WHERE m.quantity > 0
     ORDER BY m.created_at DESC`,
    (err, medicines) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(medicines);
    }
  );
});

// Get medicines by pharmacy
router.get('/pharmacy/:pharmacyId', (req, res) => {
  const { pharmacyId } = req.params;
  const db = getDb();
  db.all(
    `SELECT * FROM medicines WHERE pharmacy_id = ? ORDER BY created_at DESC`,
    [pharmacyId],
    (err, medicines) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(medicines);
    }
  );
});

// Add medicine (pharmacy only)
router.post('/', (req, res) => {
  const { pharmacy_id, name, price, quantity, expiration_date, description } = req.body;

  if (!pharmacy_id || !name || !price || !quantity || !expiration_date) {
    return res.status(400).json({ error: 'All required fields must be provided' });
  }

  const db = getDb();
  db.run(
    `INSERT INTO medicines (pharmacy_id, name, price, quantity, expiration_date, description)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [pharmacy_id, name, price, quantity, expiration_date, description || ''],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: 'Medicine added successfully',
        medicineId: this.lastID
      });
    }
  );
});

// Update medicine
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, quantity, expiration_date, description } = req.body;
  const db = getDb();

  db.run(
    `UPDATE medicines 
     SET name = ?, price = ?, quantity = ?, expiration_date = ?, description = ?
     WHERE id = ?`,
    [name, price, quantity, expiration_date, description || '', id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Medicine not found' });
      }
      res.json({ message: 'Medicine updated successfully' });
    }
  );
});

// Delete medicine
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();

  db.run(`DELETE FROM medicines WHERE id = ?`, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    res.json({ message: 'Medicine deleted successfully' });
  });
});

module.exports = router;

