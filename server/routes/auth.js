import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pesonaai_secret';

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  try {
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length > 0) return res.status(409).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, hash]);
    const user = { id: result.insertId, name, email };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'All fields required' });
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get profile
router.get('/profile', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile (name, email, password)
router.put('/profile', auth, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (email) {
      const [rows] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, req.user.id]);
      if (rows.length > 0) return res.status(409).json({ error: 'Email already in use' });
    }
    let query = 'UPDATE users SET ';
    const params = [];
    if (name) { query += 'name = ?, '; params.push(name); }
    if (email) { query += 'email = ?, '; params.push(email); }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      query += 'password_hash = ?, '; params.push(hash);
    }
    query = query.replace(/, $/, '');
    query += ' WHERE id = ?';
    params.push(req.user.id);
    await pool.query(query, params);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete account
router.delete('/profile', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.user.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 