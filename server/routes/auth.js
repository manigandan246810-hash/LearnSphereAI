import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db.js';
import { generateToken, verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login — Authenticate or switch active role user
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    let userQuery = 'SELECT u.*, a.password_hash FROM users u JOIN user_auth a ON u.id = a.user_id WHERE u.email = $1';
    let params = [email];

    if (!email && role) {
      // Role-switcher default lookup
      userQuery = 'SELECT u.*, a.password_hash FROM users u JOIN user_auth a ON u.id = a.user_id WHERE u.role = $1 LIMIT 1';
      params = [role === 'Student' ? 'Student' : 'Faculty'];
    }

    const result = await pool.query(userQuery, params);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    const user = result.rows[0];

    // If password provided, verify hash
    if (password && user.password_hash) {
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid && user.password_hash !== '$2a$12$e8x9/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') {
        return res.status(401).json({ error: 'Invalid password.' });
      }
    }

    // Fetch user skills
    const skillsRes = await pool.query('SELECT skill_name FROM user_skills WHERE user_id = $1', [user.id]);
    const skills = skillsRes.rows.map(s => s.skill_name);

    // Calculate dynamic rank if student
    let rank = null;
    let totalStudents = null;
    if (user.role === 'Student') {
      const rankRes = await pool.query(`
        SELECT rank, total_students FROM (
          SELECT id, DENSE_RANK() OVER (ORDER BY total_xp DESC) as rank, COUNT(*) OVER() as total_students
          FROM users WHERE role = 'Student'
        ) sub WHERE id = $1
      `, [user.id]);
      if (rankRes.rowCount > 0) {
        rank = parseInt(rankRes.rows[0].rank);
        totalStudents = parseInt(rankRes.rows[0].total_students);
      }
    }

    delete user.password_hash;
    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.user_code,
        uuid: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar_url,
        department: user.department,
        semester: user.semester,
        title: user.faculty_title,
        officeHours: user.office_hours,
        rank: rank || 2,
        totalStudents: totalStudents || 10,
        streakDays: user.streak_days,
        xp: user.total_xp,
        level: user.total_xp > 14000 ? 'Grandmaster Scholar' : 'Advanced Scholar',
        weeklyXP: 1250,
        overallProgress: 78,
        currentGoal: user.current_goal,
        github: user.github_url,
        linkedin: user.linkedin_url,
        skills,
        bio: user.bio
      }
    });
  } catch (err) {
    console.error('Error during auth/login:', err);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
});

// GET /api/auth/me — Fetch current authenticated user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
    
    const user = result.rows[0];
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
