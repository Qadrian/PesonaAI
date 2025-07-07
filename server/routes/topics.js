import express from 'express';
import pool from '../db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all topics for user
router.get('/', auth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM topics WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
  res.json(rows);
});

// Create topic (max 5/user)
router.post('/', auth, async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const [countRows] = await pool.query('SELECT COUNT(*) as count FROM topics WHERE user_id = ?', [req.user.id]);
  if (countRows[0].count >= 5) return res.status(400).json({ error: 'Max 5 topics allowed' });
  const [result] = await pool.query('INSERT INTO topics (user_id, title) VALUES (?, ?)', [req.user.id, title]);
  res.json({ id: result.insertId, title });
});

// Rename topic
router.put('/:id', auth, async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  await pool.query('UPDATE topics SET title = ? WHERE id = ? AND user_id = ?', [title, req.params.id, req.user.id]);
  res.json({ success: true });
});

// Delete topic (and its chats)
router.delete('/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM topics WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.json({ success: true });
});

export default router; 