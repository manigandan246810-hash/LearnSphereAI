import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/events — Fetch academic calendar events
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        title,
        description,
        TO_CHAR(event_date, 'Mon DD') AS date,
        time_slot_display AS time,
        category,
        color_code AS color
      FROM academic_events
      ORDER BY event_date ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching calendar events:', err);
    res.status(500).json({ error: 'Failed to fetch academic calendar events.' });
  }
});

export default router;
