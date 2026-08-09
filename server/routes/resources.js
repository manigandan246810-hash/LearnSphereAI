import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/resources — Fetch resource repository
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        name,
        resource_type AS type,
        file_size AS size,
        TO_CHAR(created_at, 'Mon DD, YYYY') AS updated,
        category,
        file_url AS "fileUrl"
      FROM resource_library
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching resource library:', err);
    res.status(500).json({ error: 'Failed to fetch resource library.' });
  }
});

// POST /api/resources — Upload resource
router.post('/', async (req, res) => {
  try {
    const { name, resourceType, fileSize, category, fileUrl } = req.body;
    const uploaderRes = await pool.query('SELECT id FROM users WHERE role = $1 LIMIT 1', ['Faculty']);

    const insertRes = await pool.query(`
      INSERT INTO resource_library (name, resource_type, file_size, category, file_url, uploader_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [name, resourceType || 'PDF', fileSize || '2.5 MB', category || 'Cheatsheet', fileUrl || 'https://storage.learnsphere.edu/file.pdf', uploaderRes.rows[0].id]);

    res.status(201).json(insertRes.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
