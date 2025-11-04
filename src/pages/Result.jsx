import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { FaTrophy, FaCheckCircle, FaTimesCircle, FaHome, FaRedo } from 'react-icons/fa';

const Result = () => {
  const navigate = useNavigate();
  const {
    user,
    questionsData,
    selectedTopic,
    selectedDifficulty,
    userAnswers,
    score,
    addToLeaderboard,
    addToQuizHistory,
    resetQuiz,
    practiceMode
  } = useQuiz();

  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);

  const questions = questionsData[selectedTopic]?.[selectedDifficulty] || [];
  const totalQuestions = questions.length;
  const percentage = ((score / totalQuestions) * 100).toFixed(1);
  
  // Determine result emoji and message
  const getResultEmoji = () => {
    if (percentage >= 80) return '🏆';
    if (percentage >= 60) return '🎉';
    if (percentage >= 40) return '👍';
    return '💪';
  };

  const getResultMessage = () => {
    if (percentage >= 80) return 'Outstanding! You\'re a Quiz Master!';
    if (percentage >= 60) return 'Great Job! Well Done!';
    if (percentage >= 40) return 'Good Effort! Keep Practicing!';
    return 'Keep Learning! You\'ll Get Better!';
  };

  useEffect(() => {
    // Save quiz history for students
    if (user && user.role === 'student') {
      const wrongAnswers = questions
        .map((question, index) => {
          if (userAnswers[index] !== question.correct) {
            return {
              question: question.question,
              topic: selectedTopic,
              difficulty: selectedDifficulty,
              userAnswer: question.options[userAnswers[index]] || 'Not answered',
              correctAnswer: question.options[question.correct]
            };
          }
          return null;
        })
        .filter(Boolean);

      addToQuizHistory({
        score,
        totalQuestions,
        percentage,
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        wrongAnswers
      });
    }
  }, []);

  const handleSubmitName = () => {
    if (userName.trim()) {
      addToLeaderboard(userName, score, totalQuestions, selectedTopic, selectedDifficulty);
      setShowNameInput(false);
    }
  };

  const handlePlayAgain = () => {
    resetQuiz();
    navigate('/topics');
  };

  const handleGoHome = () => {
    resetQuiz();
    navigate('/');
  };

  useEffect(() => {
    // Auto-submit if no input after 3 seconds
    if (showNameInput && !userName.trim()) {
      const timer = setTimeout(() => {
        setShowNameInput(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Result Summary */}
        <div className="card text-center mb-8">
          <div className="text-8xl mb-4">{getResultEmoji()}</div>
          <h1 className="text-4xl font-bold mb-4 dark:text-white">
            {getResultMessage()}
          </h1>
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                {percentage}%
              </div>
              <div className="text-gray-600 dark:text-gray-400">Score</div>
            </div>
            <div className="text-4xl text-gray-300 dark:text-gray-600">|</div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 dark:text-green-400">
                {score}/{totalQuestions}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Correct</div>
            </div>
          </div>

          {/* Topic and Difficulty Info */}
          <div className="flex justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
              {selectedTopic}
            </span>
            <span className="bg-purple-100 dark:bg-purple-900 px-3 py-1 rounded-full">
              {selectedDifficulty.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-6 dark:text-white text-center">
            Detailed Results
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.correct;
              
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-900 bg-opacity-50'
                      : 'border-red-500 bg-red-50 dark:bg-red-900 bg-opacity-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-semibold text-sm text-gray-600 dark:text-gray-400">
                      Q{index + 1}: {question.question}
                    </span>
                    {isCorrect ? (
                      <FaCheckCircle className="text-green-500 flex-shrink-0 ml-2" />
                    ) : (
                      <FaTimesCircle className="text-red-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="text-sm">
                      <span className="font-semibold">Your Answer:</span>{' '}
                      <span className={`${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {question.options[userAnswer] || 'Not answered'}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="text-sm mt-1">
                        <span className="font-semibold">Correct Answer:</span>{' '}
                        <span className="text-green-600 dark:text-green-400">
                          {question.options[question.correct]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Name Input for Leaderboard - only show if not logged in */}
        {showNameInput && !user && (
          <div className="card mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <FaTrophy className="text-yellow-500 text-2xl" />
              <h3 className="text-xl font-bold dark:text-white">
                Enter Your Name for Leaderboard
              </h3>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name..."
                className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                autoFocus
              />
              <button
                onClick={handleSubmitName}
                disabled={!userName.trim()}
                className="btn-primary disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handlePlayAgain}
            className="btn-primary inline-flex items-center justify-center space-x-2"
          >
            <FaRedo />
            <span>Play Again</span>
          </button>
          {user?.role === 'student' ? (
            <button
              onClick={() => navigate('/student-dashboard')}
              className="btn-secondary inline-flex items-center justify-center space-x-2"
            >
              <FaHome />
              <span>Dashboard</span>
            </button>
          ) : (
            <button
              onClick={handleGoHome}
              className="btn-secondary inline-flex items-center justify-center space-x-2"
            >
              <FaHome />
              <span>Home</span>
            </button>
          )}
          <button
            onClick={() => navigate('/leaderboard')}
            className="btn-secondary inline-flex items-center justify-center space-x-2"
          >
            <FaTrophy />
            <span>Leaderboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;

