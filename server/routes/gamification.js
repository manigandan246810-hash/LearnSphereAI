import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/leaderboard — Calculate dynamic student standings
router.get('/leaderboard', async (req, res) => {
  try {
    const { filter, department } = req.query;

    let query = `
      SELECT 
        DENSE_RANK() OVER (ORDER BY total_xp DESC) AS rank,
        name,
        department,
        total_xp AS xp,
        avatar_url AS avatar,
        streak_days AS streak,
        CASE 
          WHEN DENSE_RANK() OVER (ORDER BY total_xp DESC) = 1 THEN '👑 Champion'
          WHEN DENSE_RANK() OVER (ORDER BY total_xp DESC) = 2 THEN '⚡ Master'
          WHEN DENSE_RANK() OVER (ORDER BY total_xp DESC) = 3 THEN '🔥 Innovator'
          WHEN DENSE_RANK() OVER (ORDER BY total_xp DESC) = 4 THEN '⭐ Scholar'
          ELSE '🚀 Explorer'
        END AS badge
      FROM users
      WHERE role = 'Student'
    `;

    if (department && department !== 'All') {
      query += ` AND department = '${department}'`;
    }

    query += ` ORDER BY rank ASC LIMIT 10`;

    const result = await pool.query(query);
    
    // Append "(You)" indicator for Alex Morgan
    const standings = result.rows.map(r => ({
      ...r,
      name: r.name === 'Alex Morgan' ? 'Alex Morgan (You)' : r.name,
      xp: parseInt(r.xp),
      streak: parseInt(r.streak),
      rank: parseInt(r.rank)
    }));

    res.json(standings);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard.' });
  }
});

// GET /api/achievements — Fetch achievements & unlock status
router.get('/achievements', async (req, res) => {
  try {
    const studentCode = req.query.studentId || 'STU-88219';

    const result = await pool.query(`
      SELECT 
        a.id AS uuid,
        a.title,
        a.description AS desc,
        a.icon,
        a.requirement,
        CASE WHEN ua.id IS NOT NULL THEN TRUE ELSE FALSE END AS unlocked,
        TO_CHAR(ua.unlocked_at, 'Mon DD, YYYY') AS date
      FROM achievements a
      LEFT JOIN users s ON s.user_code = $1
      LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = s.id
      ORDER BY a.title ASC
    `, [studentCode]);

    const achievements = result.rows.map((row, idx) => ({
      id: idx + 1,
      uuid: row.uuid,
      title: row.title,
      desc: row.desc,
      icon: row.icon,
      unlocked: row.unlocked,
      date: row.date || 'Aug 04, 2026',
      requirement: row.requirement
    }));

    res.json(achievements);
  } catch (err) {
    console.error('Error fetching achievements:', err);
    res.status(500).json({ error: 'Failed to fetch achievements.' });
  }
});

// POST /api/achievements/:id/unlock — Unlock badge
router.post('/achievements/:id/unlock', async (req, res) => {
  try {
    const { studentCode } = req.body;
    const badgeId = req.params.id;

    const studentRes = await pool.query('SELECT id FROM users WHERE user_code = $1 OR role = $2 LIMIT 1', [studentCode || 'STU-88219', 'Student']);
    const badgeRes = await pool.query('SELECT id FROM achievements LIMIT 1');

    if (studentRes.rowCount > 0 && badgeRes.rowCount > 0) {
      await pool.query(`
        INSERT INTO user_achievements (user_id, achievement_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, achievement_id) DO NOTHING
      `, [studentRes.rows[0].id, badgeRes.rows[0].id]);
    }

    res.json({ success: true, message: 'Achievement unlocked!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/summary — Study hours & XP growth
router.get('/analytics/summary', async (req, res) => {
  try {
    res.json({
      weeklyHours: [
        { day: 'Mon', hours: 4.5, target: 4 },
        { day: 'Tue', hours: 6.0, target: 4 },
        { day: 'Wed', hours: 5.2, target: 4 },
        { day: 'Thu', hours: 3.8, target: 4 },
        { day: 'Fri', hours: 7.1, target: 4 },
        { day: 'Sat', hours: 8.4, target: 4 },
        { day: 'Sun', hours: 3.5, target: 4 }
      ],
      xpGrowth: [
        { week: 'W1', xp: 8200 },
        { week: 'W2', xp: 9800 },
        { week: 'W3', xp: 11400 },
        { week: 'W4', xp: 13200 },
        { week: 'W5', xp: 14850 }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
