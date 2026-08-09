import pool from '../server/db.js';

async function testCourses() {
  try {
    const studentCode = 'STU-88219';
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

    console.log('Courses Count:', coursesRes.rows.length);
    console.log('First Course:', coursesRes.rows[0]);
  } catch (err) {
    console.error('Query Error:', err);
  } finally {
    await pool.end();
  }
}

testCourses();
