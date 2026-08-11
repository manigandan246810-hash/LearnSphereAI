import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/assignments — List assignments with rubrics
router.get('/', async (req, res) => {
  try {
    const studentCode = req.query.studentId || 'STU-88219';

    const result = await pool.query(`
      SELECT 
        a.id AS uuid,
        a.assignment_code AS id,
        a.title,
        c.id AS course_uuid,
        c.course_code AS "courseId",
        c.title AS "courseName",
        u.name AS faculty,
        a.due_date AS "dueDate",
        104 AS "remainingHours",
        COALESCE(sub.status, 'pending') AS status,
        a.max_marks AS "maxMarks",
        sub.earned_marks AS "earnedMarks",
        sub.feedback_comments AS feedback,
        a.instructions
      FROM assignments a
      JOIN courses c ON a.course_id = c.id
      JOIN users u ON a.faculty_id = u.id
      LEFT JOIN users s ON s.user_code = $1
      LEFT JOIN assignment_submissions sub ON sub.assignment_id = a.id AND sub.student_id = s.id
      ORDER BY a.due_date ASC
    `, [studentCode]);

    const rubricsRes = await pool.query(`
      SELECT assignment_id, criteria_text AS criteria, max_points AS points
      FROM assignment_rubrics
      ORDER BY display_order ASC
    `);

    const assignments = result.rows.map(a => {
      const rubric = rubricsRes.rows
        .filter(r => r.assignment_id === a.uuid)
        .map(({ assignment_id, ...r }) => r);
      
      return {
        ...a,
        rubric: rubric.length > 0 ? rubric : [
          { criteria: "Model Architecture Setup", points: 30 },
          { criteria: "Training Loop & Optimizer", points: 30 },
          { criteria: "Evaluation Metrics", points: 20 },
          { criteria: "Code Cleanliness", points: 20 }
        ]
      };
    });

    res.json(assignments);
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ error: 'Failed to fetch assignments.' });
  }
});

// POST /api/assignments — Create assignment (Faculty)
router.post('/', async (req, res) => {
  try {
    const { title, dueDate, maxMarks, instructions, rubrics, courseId, facultyCode } = req.body;
    
    const courseRes = await pool.query('SELECT id FROM courses LIMIT 1');
    const facultyRes = await pool.query('SELECT id FROM users WHERE role = $1 LIMIT 1', ['Faculty']);

    const courseUuid = courseRes.rows[0].id;
    const facultyUuid = facultyRes.rows[0].id;

    const code = `ASN-${Math.floor(100 + Math.random() * 900)}`;

    const insertRes = await pool.query(`
      INSERT INTO assignments (assignment_code, course_id, faculty_id, title, instructions, due_date, max_marks)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [code, courseUuid, facultyUuid, title, instructions || 'Complete assignment according to rubric criteria.', dueDate || new Date(Date.now() + 864000000), maxMarks || 100]);

    const newAssignment = insertRes.rows[0];

    // Insert rubrics
    if (Array.isArray(rubrics)) {
      for (let i = 0; i < rubrics.length; i++) {
        await pool.query(`
          INSERT INTO assignment_rubrics (assignment_id, criteria_text, max_points, display_order)
          VALUES ($1, $2, $3, $4)
        `, [newAssignment.id, rubrics[i].criteria || 'Criteria Item', rubrics[i].points || 10, i + 1]);
      }
    }

    res.status(201).json({ success: true, assignmentCode: code });
  } catch (err) {
    console.error('Error creating assignment:', err);
    res.status(500).json({ error: 'Failed to create assignment.' });
  }
});

// POST /api/assignments/:id/submit — Submit student solution
router.post('/:id/submit', async (req, res) => {
  try {
    const assignmentCode = req.params.id;
    const { studentCode, fileName } = req.body;

    const studentRes = await pool.query('SELECT id FROM users WHERE user_code = $1 OR role = $2 LIMIT 1', [studentCode || 'STU-88219', 'Student']);
    const asnRes = await pool.query('SELECT id FROM assignments WHERE assignment_code = $1 OR id::text = $1 LIMIT 1', [assignmentCode]);

    if (studentRes.rowCount > 0 && asnRes.rowCount > 0) {
      await pool.query(`
        INSERT INTO assignment_submissions (assignment_id, student_id, submitted_file_name, submitted_file_url, status)
        VALUES ($1, $2, $3, $4, 'completed')
        ON CONFLICT (assignment_id, student_id, submission_attempt)
        DO UPDATE SET status = 'completed', submitted_file_name = EXCLUDED.submitted_file_name, submitted_at = CURRENT_TIMESTAMP
      `, [asnRes.rows[0].id, studentRes.rows[0].id, fileName || 'Solution_Submission.ipynb', 'https://storage.learnsphere.edu/submissions/file.ipynb']);
    }

    res.json({ success: true, message: 'Assignment submitted successfully!' });
  } catch (err) {
    console.error('Error submitting assignment:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/submissions/:id/grade — Grade submission (Faculty Evaluation Desk)
router.post('/submissions/grade', async (req, res) => {
  try {
    const { studentCode, earnedMarks, feedback } = req.body;

    await pool.query(`
      UPDATE assignment_submissions
      SET earned_marks = $1, feedback_comments = $2, status = 'completed', evaluated_at = CURRENT_TIMESTAMP
      WHERE student_id = (SELECT id FROM users WHERE user_code = $3 OR role = 'Student' LIMIT 1)
    `, [earnedMarks || 96, feedback || 'Excellent work!', studentCode || 'STU-88219']);

    res.json({ success: true, message: 'Grade published to student!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
