import express from 'express';
import db from '../database/init.js';

const router = express.Router();

// Middleware to verify authentication
const verifyAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const jwt = await import('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const decoded = jwt.default.verify(token, JWT_SECRET);
    
    const user = db.users.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = { id: user.id, username: user.username, role: user.role };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get user's quiz history
router.get('/quiz-history', verifyAuth, (req, res) => {
  try {
    const history = db.quizHistory.findByUserId(req.user.id);
    res.json(history);
  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save quiz result
router.post('/quiz-history', verifyAuth, (req, res) => {
  try {
    const { topic, difficulty, score, totalQuestions, percentage, timeOutsideFullscreen } = req.body;

    if (!topic || !difficulty || score === undefined || !totalQuestions || !percentage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = db.quizHistory.create({
      user_id: req.user.id,
      topic,
      difficulty,
      score,
      total_questions: totalQuestions,
      percentage,
      time_outside_fullscreen: timeOutsideFullscreen || 0
    });

    // Save fullscreen violation if exists
    if (timeOutsideFullscreen > 0) {
      db.violations.create({
        user_id: req.user.id,
        quiz_history_id: result.id,
        time_outside_fullscreen: timeOutsideFullscreen,
        topic,
        difficulty
      });
    }

    res.status(201).json({
      id: result.id,
      message: 'Quiz history saved successfully'
    });
  } catch (error) {
    console.error('Save quiz history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get fullscreen violations for a user (for teachers/admin)
router.get('/violations', verifyAuth, (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const violations = db.violations.findAll();
    const users = db.users.findAll();
    
    const violationsWithUsernames = violations.map(v => {
      const user = users.find(u => u.id === v.user_id);
      return {
        ...v,
        username: user ? user.username : 'Unknown'
      };
    });

    res.json(violationsWithUsernames);
  } catch (error) {
    console.error('Get violations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

