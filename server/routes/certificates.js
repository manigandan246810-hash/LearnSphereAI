import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/certificates — List student certificates
router.get('/', async (req, res) => {
  try {
    const studentCode = req.query.studentId || 'STU-88219';

    const result = await pool.query(`
      SELECT 
        c.title,
        c.issuer,
        TO_CHAR(c.issue_date, 'Mon YYYY') AS date,
        c.certificate_code AS "certId",
        c.pdf_url AS "pdfUrl"
      FROM certificates c
      JOIN users s ON c.student_id = s.id
      WHERE s.user_code = $1 OR s.role = 'Student'
      ORDER BY c.issue_date DESC
    `, [studentCode]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching certificates:', err);
    res.status(500).json({ error: 'Failed to fetch certificates.' });
  }
});

export default router;
