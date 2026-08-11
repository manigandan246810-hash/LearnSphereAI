import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

// Route Imports
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import assignmentRoutes from './routes/assignments.js';
import quizRoutes from './routes/quizzes.js';
import gamificationRoutes from './routes/gamification.js';
import announcementRoutes from './routes/announcements.js';
import calendarRoutes from './routes/calendar.js';
import resourceRoutes from './routes/resources.js';
import certificateRoutes from './routes/certificates.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PHASE 13 — API Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1 + 1 AS health_check');
    if (result.rows[0].health_check === 2) {
      return res.status(200).json({
        status: 'ok',
        database: 'connected'
      });
    } else {
      return res.status(500).json({
        status: 'error',
        database: 'unexpected response'
      });
    }
  } catch (err) {
    console.error('Database Health Check Failed:', err.message);
    return res.status(500).json({
      status: 'error',
      database: 'disconnected'
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api', gamificationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/events', calendarRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/ai', aiRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 LearnSphere AI Backend API listening on port ${PORT}`);
  console.log(`🏥 Health Check Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
});
