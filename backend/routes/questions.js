import express from 'express';
import db from '../database/init.js';
import jwt from 'jsonwebtoken';


const router = express.Router();

// Middleware to verify teacher role
const verifyTeacher = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const decoded = jwt.default.verify(token, JWT_SECRET);
    
    if (decoded.role !== 'teacher') {
      return res.status(403).json({ error: 'Access denied. Teacher role required' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all questions (with optional filters)
router.get('/', (req, res) => {
  try {
    const { topic, difficulty } = req.query;

    let questions = db.questions.findAll();

    if (topic && difficulty) {
      questions = questions.filter(q => q.topic === topic && q.difficulty === difficulty);
    } else if (topic) {
      questions = questions.filter(q => q.topic === topic);
    } else if (difficulty) {
      questions = questions.filter(q => q.difficulty === difficulty);
    }

    // Format questions to match frontend structure
    const formatted = questions.map(q => ({
      id: q.id,
      question: q.question,
      options: [q.option1, q.option2, q.option3, q.option4],
      correct: q.correct,
      topic: q.topic,
      difficulty: q.difficulty
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get questions grouped by topic and difficulty (for frontend)
router.get('/grouped', (req, res) => {
  try {
    const questions = db.questions.findAll();
    
    const grouped = {};
    questions.forEach(q => {
      if (!grouped[q.topic]) {
        grouped[q.topic] = {};
      }
      if (!grouped[q.topic][q.difficulty]) {
        grouped[q.topic][q.difficulty] = [];
      }
      grouped[q.topic][q.difficulty].push({
        id: q.id,
        question: q.question,
        options: [q.option1, q.option2, q.option3, q.option4],
        correct: q.correct
      });
    });

    res.json(grouped);
  } catch (error) {
    console.error('Get grouped questions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single question by ID
router.get('/:id', (req, res) => {
  try {
    const question = db.questions.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({
      id: question.id,
      question: question.question,
      options: [question.option1, question.option2, question.option3, question.option4],
      correct: question.correct,
      topic: question.topic,
      difficulty: question.difficulty
    });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new question (Teacher only)
router.post('/', verifyTeacher, (req, res) => {
  try {
    const { topic, difficulty, question, options, correct } = req.body;

    if (!topic || !difficulty || !question || !options || correct === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ error: 'Options must be an array of 4 items' });
    }

    if (correct < 0 || correct > 3) {
      return res.status(400).json({ error: 'Correct answer must be between 0 and 3' });
    }

    const newQuestion = db.questions.create({
      topic,
      difficulty,
      question,
      option1: options[0],
      option2: options[1],
      option3: options[2],
      option4: options[3],
      correct,
      created_by: req.user.id
    });

    res.status(201).json({
      id: newQuestion.id,
      topic,
      difficulty,
      question,
      options,
      correct
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update question (Teacher only)
router.put('/:id', verifyTeacher, (req, res) => {
  try {
    const { topic, difficulty, question, options, correct } = req.body;

    // Check if question exists
    const existing = db.questions.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Question not found' });
    }

    if (!topic || !difficulty || !question || !options || correct === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ error: 'Options must be an array of 4 items' });
    }

    const updated = db.questions.update(req.params.id, {
      topic,
      difficulty,
      question,
      option1: options[0],
      option2: options[1],
      option3: options[2],
      option4: options[3],
      correct
    });

    res.json({
      id: updated.id,
      topic,
      difficulty,
      question,
      options,
      correct
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete question (Teacher only)
router.delete('/:id', verifyTeacher, (req, res) => {
  try {
    const question = db.questions.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    db.questions.delete(req.params.id);

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

