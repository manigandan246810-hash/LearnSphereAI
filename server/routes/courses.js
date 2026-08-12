import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/courses — Fetch course catalog & enrollment data
router.get('/', async (req, res) => {
  try {
    const studentCode = req.query.studentId || 'STU-88219';
    
    // Fetch courses with instructor name & calculated enrollment count
    const coursesRes = await pool.query(`
      SELECT 
        c.id AS uuid,
        c.course_code AS id,
        c.title,
        u.name AS instructor,
        c.category,
        c.description,
        c.cover_image_url AS "coverImage",
        c.difficulty,
        c.status,
        COALESCE(ce.is_bookmarked, FALSE) AS "isBookmarked",
        COALESCE(ce.is_favorite, FALSE) AS "isFavorite",
        COALESCE(enrolled_stats.student_count, 1)::INTEGER AS "enrolledStudents",
        4.9 AS rating,
        12 AS "totalModules",
        10 AS "completedModules",
        82 AS progress,
        '2h 45m' AS "estimatedTimeLeft"
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
      LEFT JOIN users s ON s.user_code = $1
      LEFT JOIN course_enrollments ce ON ce.course_id = c.id AND ce.student_id = s.id
      LEFT JOIN (
        SELECT course_id, COUNT(*) as student_count FROM course_enrollments GROUP BY course_id
      ) enrolled_stats ON enrolled_stats.course_id = c.id
      ORDER BY c.course_code ASC
    `, [studentCode]);

    // Fetch weekly timeline for each course
    const timelineRes = await pool.query(`
      SELECT 
        cm.course_id,
        cm.week_number AS week,
        cm.title AS topic,
        $1 AS student_code
      FROM course_modules cm
      ORDER BY cm.week_number ASC
    `, [studentCode]);

    const courses = coursesRes.rows.map(c => {
      const weeklyTimeline = timelineRes.rows
        .filter(t => t.course_id === c.uuid)
        .map(({ course_id, student_code, ...t }) => t);
      
      return {
        ...c,
        weeklyTimeline
      };
    });

    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Failed to fetch courses.' });
  }
});

// POST /api/courses — Create new course (Faculty)
router.post('/', async (req, res) => {
  try {
    const { title, category, description, instructorCode } = req.body;
    
    // Find instructor UUID
    const instRes = await pool.query('SELECT id, name FROM users WHERE user_code = $1 OR role = $2 LIMIT 1', [instructorCode || 'FAC-1042', 'Faculty']);
    const instructor = instRes.rows[0];

    const courseCode = `CS-${Math.floor(100 + Math.random() * 900)}`;
    const coverImage = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80';

    const insertRes = await pool.query(`
      INSERT INTO courses (course_code, title, category, description, instructor_id, cover_image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [courseCode, title, category, description || 'Newly created course module.', instructor.id, coverImage]);

    const newCourse = insertRes.rows[0];

    res.status(201).json({
      id: newCourse.course_code,
      title: newCourse.title,
      instructor: instructor.name,
      category: newCourse.category,
      progress: 0,
      totalModules: 10,
      completedModules: 0,
      estimatedTimeLeft: "10h 0m",
      enrolledStudents: 1,
      rating: 5.0,
      coverImage: newCourse.cover_image_url,
      description: newCourse.description
    });
  } catch (err) {
    console.error('Error creating course:', err);
    res.status(500).json({ error: 'Failed to create course.' });
  }
});

// POST /api/courses/:id/toggle-bookmark
router.post('/:id/toggle-bookmark', async (req, res) => {
  try {
    const courseCode = req.params.id;
    const { studentCode } = req.body;

    const studentRes = await pool.query('SELECT id FROM users WHERE user_code = $1', [studentCode || 'STU-88219']);
    const courseRes = await pool.query('SELECT id FROM courses WHERE course_code = $1', [courseCode]);

    if (studentRes.rowCount > 0 && courseRes.rowCount > 0) {
      await pool.query(`
        INSERT INTO course_enrollments (student_id, course_id, is_bookmarked)
        VALUES ($1, $2, TRUE)
        ON CONFLICT (student_id, course_id)
        DO UPDATE SET is_bookmarked = NOT course_enrollments.is_bookmarked
      `, [studentRes.rows[0].id, courseRes.rows[0].id]);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/courses/lessons/:id/complete
router.post('/lessons/:id/complete', async (req, res) => {
  try {
    const lessonId = req.params.id;
    const { studentCode, activityType } = req.body;

    await pool.query(`
      UPDATE lesson_progress
      SET status = $1, activity_type = $2, lesson_id = $3
      WHERE student_id = (SELECT id FROM users WHERE user_code = $4 OR id::text = $4 LIMIT 1)
    `, ['completed', activityType, lessonId, studentCode]);

    res.json({ success: true, message: 'Lesson progress updated successfully!' });
  } catch (err) {
    console.error('Error completing lesson:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/courses/:id/modules — Add a new course module (week) and lessons
router.post('/:id/modules', async (req, res) => {
  try {
    const courseCode = req.params.id;
    const { weekNumber, title, videoUrl, notesPdfUrl } = req.body;

    const courseRes = await pool.query('SELECT id FROM courses WHERE course_code = $1 OR id::text = $1 LIMIT 1', [courseCode]);
    if (courseRes.rowCount === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const courseId = courseRes.rows[0].id;

    // Create course module (week)
    const moduleRes = await pool.query(`
      INSERT INTO course_modules (course_id, week_number, title)
      VALUES ($1, $2, $3)
      ON CONFLICT (course_id, week_number) 
      DO UPDATE SET title = EXCLUDED.title
      RETURNING id
    `, [courseId, Number(weekNumber) || 1, title || 'New Week Module']);

    const moduleId = moduleRes.rows[0].id;

    // Create a lesson under this module
    await pool.query(`
      INSERT INTO lessons (module_id, title, video_url, notes_pdf_url, display_order)
      VALUES ($1, $2, $3, $4, 1)
    `, [moduleId, title || 'Lecture Video & Reading', videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4', notesPdfUrl || 'https://storage.learnsphere.edu/syllabus/notes.pdf']);

    res.json({ success: true, message: 'Module and lesson published successfully!' });
  } catch (err) {
    console.error('Error adding course module:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
