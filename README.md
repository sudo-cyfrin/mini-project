# Quiz Platform 🎯

A modern, full-featured quiz application built with React, featuring multiple topics, difficulty levels, timed questions, and a leaderboard system.

## ✨ Features

- **Multiple Topics**: DSA, DBMS, OS, CN, and Aptitude
- **Difficulty Levels**: Easy, Medium, and Hard
- **Timed Questions**: Difficulty-based time limits (30s, 45s, 60s)
- **Real-time Progress**: Visual progress bar and question counter
- **Results Page**: Detailed breakdown of correct/incorrect answers
- **Leaderboard**: Track top performers across all topics
- **Dark/Light Mode**: Smooth theme switching with localStorage persistence
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern UI**: Beautiful gradients, animations, and transitions

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Running the Application

```bash
npm run dev
```

The application will start on `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 📁 Project Structure

```
quiz-platform/
├── src/
│   ├── components/
│   │   └── Navbar.jsx          # Navigation bar with dark mode toggle
│   ├── context/
│   │   └── QuizContext.jsx     # Global state management
│   ├── data/
│   │   └── questions.js        # Question data by topic and difficulty
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── TopicSelection.jsx  # Topic selection
│   │   ├── DifficultySelection.jsx # Difficulty selection
│   │   ├── Quiz.jsx           # Quiz page with timer
│   │   ├── Result.jsx         # Results with score breakdown
│   │   └── Leaderboard.jsx    # Top performers
│   ├── App.jsx                # Main app with routing
│   ├── main.jsx               # Entry point
│   └── index.css              # Tailwind CSS styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎮 How to Use

1. **Start**: Click "Get Started" on the home page
2. **Choose Topic**: Select from DSA, DBMS, OS, CN, or Aptitude
3. **Select Difficulty**: Pick Easy (30s), Medium (45s), or Hard (60s)
4. **Take Quiz**: Answer questions within the time limit
5. **View Results**: See your score, percentage, and detailed breakdown
6. **Check Leaderboard**: See how you rank against others
7. **Play Again**: Challenge yourself with different topics and difficulties!

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **React Context API** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **localStorage** - Persistent storage for dark mode and leaderboard

## 🎨 Key Features Explained

### Dark Mode
- Toggle between light and dark themes
- Preference saved in localStorage
- Smooth transitions between modes

### Timer System
- Each difficulty level has different time limits
- Visual countdown timer
- Auto-submits when time runs out

### Leaderboard
- Stores top 10 scores
- Persists in localStorage
- Shows rank, name, topic, difficulty, score, percentage, and date

### State Management
- Global state via Context API
- Manages quiz progress, user answers, and scores
- Resets between quiz sessions

## 📊 Question Categories

### DSA (Data Structures & Algorithms)
- Arrays, Stacks, Queues
- Trees, Graphs
- Sorting, Searching

### DBMS (Database Management Systems)
- SQL queries
- Normalization
- Indexing, Transactions

### OS (Operating Systems)
- Process Management
- Memory Management
- Scheduling Algorithms

### CN (Computer Networks)
- Protocols (TCP/IP, HTTP)
- Network Topologies
- Routing, Switching

### Aptitude
- Arithmetic and Algebra
- Logical Reasoning
- Problem Solving

## 🎯 Future Enhancements

- Real-time multiplayer quizzes
- Categories for specific industries
- Practice mode without timer
- Statistics and analytics
- User accounts and profiles
- Share results on social media
- Custom quiz creation

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For questions or support, please open an issue in the repository.

---

**Happy Quizzing! 🎉**

