import React, { createContext, useContext, useState, useEffect } from 'react';
import { questionsData as initialQuestionsData } from '../data/questions';

const QuizContext = createContext();

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });

  // Authentication state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Questions data - load from localStorage or use initial data
  const [questionsData, setQuestionsData] = useState(() => {
    const saved = localStorage.getItem('questionsData');
    return saved ? JSON.parse(saved) : initialQuestionsData;
  });

  // Student quiz history
  const [quizHistory, setQuizHistory] = useState(() => {
    const saved = localStorage.getItem('quizHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [leaderboard, setLeaderboard] = useState(() => {
    const saved = localStorage.getItem('leaderboard');
    return saved ? JSON.parse(saved) : [];
  });

  // Load dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [darkMode]);

  // Save user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Save questions data to localStorage
  useEffect(() => {
    localStorage.setItem('questionsData', JSON.stringify(questionsData));
  }, [questionsData]);

  // Save quiz history to localStorage
  useEffect(() => {
    localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
  }, [quizHistory]);

  // Save leaderboard to localStorage
  useEffect(() => {
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Authentication functions
  const login = (username, role) => {
    setUser({ username, role });
  };

  const logout = () => {
    setUser(null);
    resetQuiz();
  };

  // Question management functions
  const updateQuestionsData = (newData) => {
    setQuestionsData(newData);
  };

  // Quiz history functions
  const addToQuizHistory = (quizResult) => {
    const newEntry = {
      id: Date.now(),
      ...quizResult,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString()
    };
    setQuizHistory([newEntry, ...quizHistory]);
  };

  const resetQuiz = () => {
    setSelectedTopic(null);
    setSelectedDifficulty(null);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTimeLeft(30);
    setScore(0);
    setQuizStarted(false);
    setPracticeMode(false);
  };

  const addToLeaderboard = (name, finalScore, totalQuestions, topic, difficulty) => {
    const percentage = (finalScore / totalQuestions) * 100;
    const newEntry = {
      id: Date.now(),
      name,
      score: finalScore,
      totalQuestions,
      percentage: percentage.toFixed(1),
      topic,
      difficulty,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now()
    };
    
    const updated = [...leaderboard, newEntry].sort((a, b) => b.percentage - a.percentage);
    setLeaderboard(updated.slice(0, 10)); // Keep top 10
  };

  const value = {
    darkMode,
    toggleDarkMode,
    user,
    login,
    logout,
    questionsData,
    updateQuestionsData,
    quizHistory,
    addToQuizHistory,
    selectedTopic,
    setSelectedTopic,
    selectedDifficulty,
    setSelectedDifficulty,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    userAnswers,
    setUserAnswers,
    timeLeft,
    setTimeLeft,
    score,
    setScore,
    quizStarted,
    setQuizStarted,
    practiceMode,
    setPracticeMode,
    leaderboard,
    addToLeaderboard,
    resetQuiz
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

