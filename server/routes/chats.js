import express from 'express';
import pool from '../db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all chats for a topic
router.get('/:topicId', auth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM chats WHERE topic_id = ? ORDER BY created_at ASC', [req.params.topicId]);
  res.json(rows);
});

// Add chat to topic
router.post('/:topicId', auth, async (req, res) => {
  const { sender, message } = req.body;
  if (!sender || !message) return res.status(400).json({ error: 'Sender and message required' });
  await pool.query('INSERT INTO chats (topic_id, sender, message) VALUES (?, ?, ?)', [req.params.topicId, sender, message]);
  res.json({ success: true });
});

// Delete chat
router.delete('/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM chats WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

export default router; 