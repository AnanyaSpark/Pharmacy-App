const express = require('express');
const router = express.Router();
const { getDb } = require('../database/db');

// Create order
router.post('/', (req, res) => {
  const { user_id, pharmacy_id, items, total_amount } = req.body;

  if (!user_id || !pharmacy_id || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  const db = getDb();
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // Create order
    db.run(
      `INSERT INTO orders (user_id, pharmacy_id, total_amount, status, payment_status)
       VALUES (?, ?, ?, 'pending', 'pending')`,
      [user_id, pharmacy_id, total_amount],
      function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }

        const orderId = this.lastID;

        // Add order items and update medicine quantities
        let completed = 0;
        let hasError = false;

        items.forEach((item) => {
          db.run(
            `INSERT INTO order_items (order_id, medicine_id, quantity, price)
             VALUES (?, ?, ?, ?)`,
            [orderId, item.medicine_id, item.quantity, item.price],
            (err) => {
              if (err && !hasError) {
                hasError = true;
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
              }

              // Update medicine quantity
              db.run(
                `UPDATE medicines SET quantity = quantity - ? WHERE id = ?`,
                [item.quantity, item.medicine_id],
                (err) => {
                  if (err && !hasError) {
                    hasError = true;
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: err.message });
                  }

                  completed++;
                  if (completed === items.length && !hasError) {
                    db.run('COMMIT', (err) => {
                      if (err) {
                        return res.status(500).json({ error: err.message });
                      }
                      res.json({
                        message: 'Order created successfully',
                        orderId: orderId
                      });
                    });
                  }
                }
              );
            }
          );
        });
      }
    );
  });
});

// Get user orders
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const db = getDb();

  db.all(
    `SELECT o.*, u.name as pharmacy_name, u.address as pharmacy_address,
            d.name as delivery_agent_name, d.phone as delivery_agent_phone
     FROM orders o
     JOIN users u ON o.pharmacy_id = u.id
     LEFT JOIN users d ON o.delivery_agent_id = d.id
     WHERE o.user_id = ?
     ORDER BY o.created_at DESC`,
    [userId],
    (err, orders) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Get order items for each order
      const orderPromises = orders.map((order) => {
        return new Promise((resolve, reject) => {
          db.all(
            `SELECT oi.*, m.name as medicine_name
             FROM order_items oi
             JOIN medicines m ON oi.medicine_id = m.id
             WHERE oi.order_id = ?`,
            [order.id],
            (err, items) => {
              if (err) {
                reject(err);
              } else {
                order.items = items;
                resolve(order);
              }
            }
          );
        });
      });

      Promise.all(orderPromises)
        .then((ordersWithItems) => {
          res.json(ordersWithItems);
        })
        .catch((error) => {
          res.status(500).json({ error: error.message });
        });
    }
  );
});

// Get pharmacy orders
router.get('/pharmacy/:pharmacyId', (req, res) => {
  const { pharmacyId } = req.params;
  const db = getDb();

  db.all(
    `SELECT o.*, u.name as user_name, u.address as user_address, u.phone as user_phone,
            d.name as delivery_agent_name
     FROM orders o
     JOIN users u ON o.user_id = u.id
     LEFT JOIN users d ON o.delivery_agent_id = d.id
     WHERE o.pharmacy_id = ?
     ORDER BY o.created_at DESC`,
    [pharmacyId],
    (err, orders) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const orderPromises = orders.map((order) => {
        return new Promise((resolve, reject) => {
          db.all(
            `SELECT oi.*, m.name as medicine_name
             FROM order_items oi
             JOIN medicines m ON oi.medicine_id = m.id
             WHERE oi.order_id = ?`,
            [order.id],
            (err, items) => {
              if (err) {
                reject(err);
              } else {
                order.items = items;
                resolve(order);
              }
            }
          );
        });
      });

      Promise.all(orderPromises)
        .then((ordersWithItems) => {
          res.json(ordersWithItems);
        })
        .catch((error) => {
          res.status(500).json({ error: error.message });
        });
    }
  );
});

// Get available orders for delivery agents
router.get('/delivery/available', (req, res) => {
  const db = getDb();

  db.all(
    `SELECT o.*, u.name as user_name, u.address as user_address, u.phone as user_phone,
            p.name as pharmacy_name, p.address as pharmacy_address
     FROM orders o
     JOIN users u ON o.user_id = u.id
     JOIN users p ON o.pharmacy_id = p.id
     WHERE o.payment_status = 'paid' AND o.status = 'pending' AND o.delivery_agent_id IS NULL
     ORDER BY o.created_at DESC`,
    (err, orders) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const orderPromises = orders.map((order) => {
        return new Promise((resolve, reject) => {
          db.all(
            `SELECT oi.*, m.name as medicine_name
             FROM order_items oi
             JOIN medicines m ON oi.medicine_id = m.id
             WHERE oi.order_id = ?`,
            [order.id],
            (err, items) => {
              if (err) {
                reject(err);
              } else {
                order.items = items;
                resolve(order);
              }
            }
          );
        });
      });

      Promise.all(orderPromises)
        .then((ordersWithItems) => {
          res.json(ordersWithItems);
        })
        .catch((error) => {
          res.status(500).json({ error: error.message });
        });
    }
  );
});

// Get delivery agent orders
router.get('/delivery/:agentId', (req, res) => {
  const { agentId } = req.params;
  const db = getDb();

  db.all(
    `SELECT o.*, u.name as user_name, u.address as user_address, u.phone as user_phone,
            p.name as pharmacy_name, p.address as pharmacy_address
     FROM orders o
     JOIN users u ON o.user_id = u.id
     JOIN users p ON o.pharmacy_id = p.id
     WHERE o.delivery_agent_id = ?
     ORDER BY o.created_at DESC`,
    [agentId],
    (err, orders) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const orderPromises = orders.map((order) => {
        return new Promise((resolve, reject) => {
          db.all(
            `SELECT oi.*, m.name as medicine_name
             FROM order_items oi
             JOIN medicines m ON oi.medicine_id = m.id
             WHERE oi.order_id = ?`,
            [order.id],
            (err, items) => {
              if (err) {
                reject(err);
              } else {
                order.items = items;
                resolve(order);
              }
            }
          );
        });
      });

      Promise.all(orderPromises)
        .then((ordersWithItems) => {
          res.json(ordersWithItems);
        })
        .catch((error) => {
          res.status(500).json({ error: error.message });
        });
    }
  );
});

// Accept order by delivery agent
router.put('/:orderId/accept', (req, res) => {
  const { orderId } = req.params;
  const { delivery_agent_id } = req.body;
  const db = getDb();

  db.run(
    `UPDATE orders SET delivery_agent_id = ?, status = 'accepted' WHERE id = ?`,
    [delivery_agent_id, orderId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json({ message: 'Order accepted successfully' });
    }
  );
});

// Update order status
router.put('/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const db = getDb();

  const validStatuses = ['pending', 'accepted', 'picked_up', 'in_transit', 'delivered'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.run(
    `UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [status, orderId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json({ message: 'Order status updated successfully' });
    }
  );
});

// Process payment
router.post('/:orderId/payment', (req, res) => {
  const { orderId } = req.params;
  const { payment_id } = req.body;
  const db = getDb();

  db.run(
    `UPDATE orders SET payment_status = 'paid', payment_id = ? WHERE id = ?`,
    [payment_id || `PAY_${Date.now()}`, orderId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json({ message: 'Payment processed successfully' });
    }
  );
});

// Submit feedback
router.post('/:orderId/feedback', (req, res) => {
  const { orderId } = req.params;
  const { user_id, rating, comment } = req.body;
  const db = getDb();

  db.run(
    `INSERT INTO feedback (order_id, user_id, rating, comment)
     VALUES (?, ?, ?, ?)`,
    [orderId, user_id, rating, comment || ''],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Feedback submitted successfully' });
    }
  );
});

module.exports = router;

