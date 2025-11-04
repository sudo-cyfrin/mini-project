# Quiz Platform Backend

Backend API server for the Quiz Platform application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT tokens (change in production!)
- `NODE_ENV`: Environment (development/production)

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Database

The backend uses JSON file storage for simplicity (no database setup required). Data is stored in the `database/` folder:
- `users.json`: Stores teacher and student credentials
- `questions.json`: Stores quiz questions
- `quiz_history.json`: Stores student quiz results
- `fullscreen_violations.json`: Tracks when students exit fullscreen during quiz

All files are automatically created on first run.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user
- `GET /api/auth/verify` - Verify JWT token

### Questions
- `GET /api/questions` - Get all questions (with optional filters: ?topic=, ?difficulty=)
- `GET /api/questions/grouped` - Get questions grouped by topic and difficulty
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create question (Teacher only)
- `PUT /api/questions/:id` - Update question (Teacher only)
- `DELETE /api/questions/:id` - Delete question (Teacher only)

### Users
- `GET /api/users/quiz-history` - Get user's quiz history
- `POST /api/users/quiz-history` - Save quiz result
- `GET /api/users/violations` - Get fullscreen violations (Teacher only)

## Default Credentials

- **Teacher**: username: `teacher`, password: `teacher123`
- **Student**: username: `student`, password: `student123`

## Notes

- All routes except `/api/auth/login` and `/api/auth/register` require authentication
- Teacher routes require JWT token with `role: 'teacher'`
- Database is initialized automatically on first run with default questions

