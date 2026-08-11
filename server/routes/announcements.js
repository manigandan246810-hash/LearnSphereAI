import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/announcements — List active feed
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.id,
        a.title,
        u.name AS author,
        TO_CHAR(a.created_at, 'YYYY-MM-DD HH24:MI') AS date,
        a.is_pinned AS pinned,
        a.category,
        a.content AS text
      FROM announcements a
      JOIN users u ON a.author_id = u.id
      ORDER BY a.is_pinned DESC, a.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ error: 'Failed to fetch announcements.' });
  }
});

// POST /api/announcements — Broadcast announcement (Faculty/Admin)
router.post('/', async (req, res) => {
  try {
    const { title, category, content, isPinned, authorCode } = req.body;

    const authorRes = await pool.query('SELECT id FROM users WHERE user_code = $1 OR role = $2 LIMIT 1', [authorCode || 'FAC-1042', 'Faculty']);
    const authorId = authorRes.rows[0].id;

    const insertRes = await pool.query(`
      INSERT INTO announcements (author_id, title, category, content, is_pinned)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title, category, content AS text, is_pinned AS pinned, created_at
    `, [authorId, title, category || 'Academic', content, Boolean(isPinned)]);

    res.status(201).json({
      ...insertRes.rows[0],
      author: 'Dr. Evelyn Vance',
      date: 'Just Now'
    });
  } catch (err) {
    console.error('Error creating announcement:', err);
    res.status(500).json({ error: 'Failed to broadcast announcement.' });
  }
});

export default router;
