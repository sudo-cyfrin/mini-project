import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname);
const usersFile = path.join(dataDir, 'users.json');
const questionsFile = path.join(dataDir, 'questions.json');
const quizHistoryFile = path.join(dataDir, 'quiz_history.json');
const violationsFile = path.join(dataDir, 'fullscreen_violations.json');

// Helper functions to read/write JSON files
const readFile = (filePath, defaultValue = []) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultValue;
  }
};

const writeFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// Database operations
export const db = {
  users: {
    findAll: () => readFile(usersFile, []),
    findByUsername: (username) => {
      const users = readFile(usersFile, []);
      return users.find(u => u.username === username);
    },
    findByUsernameAndRole: (username, role) => {
      const users = readFile(usersFile, []);
      return users.find(u => u.username === username && u.role === role);
    },
    findById: (id) => {
      const users = readFile(usersFile, []);
      return users.find(u => u.id === parseInt(id));
    },
    create: (user) => {
      const users = readFile(usersFile, []);
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      const newUser = { ...user, id: newId, created_at: new Date().toISOString() };
      users.push(newUser);
      writeFile(usersFile, users);
      return newUser;
    },
    update: (id, updates) => {
      const users = readFile(usersFile, []);
      const index = users.findIndex(u => u.id === parseInt(id));
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        writeFile(usersFile, users);
        return users[index];
      }
      return null;
    }
  },
  questions: {
    findAll: () => readFile(questionsFile, []),
    findById: (id) => {
      const questions = readFile(questionsFile, []);
      return questions.find(q => q.id === parseInt(id));
    },
    findByTopicAndDifficulty: (topic, difficulty) => {
      const questions = readFile(questionsFile, []);
      return questions.filter(q => q.topic === topic && q.difficulty === difficulty);
    },
    create: (question) => {
      const questions = readFile(questionsFile, []);
      const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
      const newQuestion = { ...question, id: newId, created_at: new Date().toISOString() };
      questions.push(newQuestion);
      writeFile(questionsFile, questions);
      return newQuestion;
    },
    update: (id, updates) => {
      const questions = readFile(questionsFile, []);
      const index = questions.findIndex(q => q.id === parseInt(id));
      if (index !== -1) {
        questions[index] = { ...questions[index], ...updates };
        writeFile(questionsFile, questions);
        return questions[index];
      }
      return null;
    },
    delete: (id) => {
      const questions = readFile(questionsFile, []);
      const filtered = questions.filter(q => q.id !== parseInt(id));
      writeFile(questionsFile, filtered);
      return filtered.length < questions.length;
    }
  },
  quizHistory: {
    findAll: () => readFile(quizHistoryFile, []),
    findByUserId: (userId) => {
      const history = readFile(quizHistoryFile, []);
      return history.filter(h => h.user_id === parseInt(userId));
    },
    create: (record) => {
      const history = readFile(quizHistoryFile, []);
      const newId = history.length > 0 ? Math.max(...history.map(h => h.id)) + 1 : 1;
      const newRecord = { ...record, id: newId, created_at: new Date().toISOString() };
      history.push(newRecord);
      writeFile(quizHistoryFile, history);
      return newRecord;
    }
  },
  violations: {
    findAll: () => readFile(violationsFile, []),
    create: (violation) => {
      const violations = readFile(violationsFile, []);
      const newId = violations.length > 0 ? Math.max(...violations.map(v => v.id)) + 1 : 1;
      const newViolation = { ...violation, id: newId, created_at: new Date().toISOString() };
      violations.push(newViolation);
      writeFile(violationsFile, violations);
      return newViolation;
    }
  }
};

export const initDatabase = async () => {
  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Initialize default users if they don't exist
  const users = db.users.findAll();
  const bcryptModule = await import('bcryptjs');
  const bcrypt = bcryptModule.default;
  
  if (!users.find(u => u.username === 'teacher' && u.role === 'teacher')) {
    const hashedPassword = await bcrypt.hash('teacher123', 10);
    db.users.create({
      username: 'teacher',
      password: hashedPassword,
      role: 'teacher'
    });
    console.log('Default teacher user created');
  }

  if (!users.find(u => u.username === 'student' && u.role === 'student')) {
    const hashedPassword = await bcrypt.hash('student123', 10);
    db.users.create({
      username: 'student',
      password: hashedPassword,
      role: 'student'
    });
    console.log('Default student user created');
  }

  // Initialize default questions if database is empty
  const questions = db.questions.findAll();
  if (questions.length === 0) {
    const questionsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'data', 'default-questions.json'), 'utf8')
    );

    for (const [topic, difficulties] of Object.entries(questionsData)) {
      for (const [difficulty, questionList] of Object.entries(difficulties)) {
        for (const q of questionList) {
          db.questions.create({
            topic,
            difficulty,
            question: q.question,
            option1: q.options[0],
            option2: q.options[1],
            option3: q.options[2],
            option4: q.options[3],
            correct: q.correct
          });
        }
      }
    }
    console.log('Default questions inserted');
  }

  console.log('Database initialized successfully');
};

export const getDb = () => db;
export default db;

