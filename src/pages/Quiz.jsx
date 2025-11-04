import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { FaCheck, FaTimes, FaArrowRight, FaArrowLeft, FaClock, FaExpand } from 'react-icons/fa';

const Quiz = () => {
  const navigate = useNavigate();
  const {
    user,
    questionsData,
    selectedTopic,
    selectedDifficulty,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    userAnswers,
    setUserAnswers,
    timeLeft,
    setTimeLeft,
    setScore,
    setQuizStarted,
    practiceMode
  } = useQuiz();

  const questions = questionsData[selectedTopic]?.[selectedDifficulty] || [];
  const currentQuestion = questions[currentQuestionIndex];
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeOutsideFullscreen, setTimeOutsideFullscreen] = useState(0);
  const fullscreenTimerRef = useRef(null);
  const quizStartedRef = useRef(false);
  const totalQuestions = questions.length;

  // Fullscreen detection and tracking for students
  useEffect(() => {
    if (user?.role !== 'student' || practiceMode) return;

    const checkFullscreen = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      
      setIsFullscreen(isCurrentlyFullscreen);

      if (isCurrentlyFullscreen) {
        // Stop tracking time outside fullscreen
        if (fullscreenTimerRef.current) {
          clearInterval(fullscreenTimerRef.current);
          fullscreenTimerRef.current = null;
        }
      } else if (quizStartedRef.current) {
        // Start tracking time outside fullscreen
        if (!fullscreenTimerRef.current) {
          fullscreenTimerRef.current = setInterval(() => {
            setTimeOutsideFullscreen(prev => prev + 1);
          }, 1000);
        }
      }
    };

    // Request fullscreen when quiz starts
    const requestFullscreen = async () => {
      try {
        const element = document.documentElement;
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          await element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          await element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          await element.msRequestFullscreen();
        }
        quizStartedRef.current = true;
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
        quizStartedRef.current = true;
      }
    };

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', checkFullscreen);
    document.addEventListener('webkitfullscreenchange', checkFullscreen);
    document.addEventListener('mozfullscreenchange', checkFullscreen);
    document.addEventListener('MSFullscreenChange', checkFullscreen);

    // Request fullscreen on mount
    requestFullscreen();

    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
      document.removeEventListener('webkitfullscreenchange', checkFullscreen);
      document.removeEventListener('mozfullscreenchange', checkFullscreen);
      document.removeEventListener('MSFullscreenChange', checkFullscreen);
      if (fullscreenTimerRef.current) {
        clearInterval(fullscreenTimerRef.current);
      }
      // Exit fullscreen on unmount
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        document.exitFullscreen?.();
        document.webkitExitFullscreen?.();
      }
    };
  }, [user?.role, practiceMode]);

  // Timer effect
  useEffect(() => {
    if (questions.length === 0) {
      navigate('/topics');
      return;
    }
    
    setQuizStarted(true);
    quizStartedRef.current = true;
    // In practice mode, set a very high time limit (effectively no limit)
    if (practiceMode) {
      setTimeLeft(9999);
    } else {
      setTimeLeft(selectedDifficulty === 'easy' ? 30 : selectedDifficulty === 'medium' ? 45 : 60);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAnswer(null); // Auto-submit if time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex]);

  // Load previous answer if exists
  useEffect(() => {
    if (userAnswers[currentQuestionIndex] !== undefined) {
      setSelectedAnswer(userAnswers[currentQuestionIndex]);
    } else {
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  }, [currentQuestionIndex, userAnswers]);

  const handleAnswer = (answerIndex) => {
    if (answerIndex === null || answerIndex === undefined) {
      answerIndex = selectedAnswer;
    }

    if (answerIndex === null || answerIndex === undefined) return;

    setUserAnswers({ ...userAnswers, [currentQuestionIndex]: answerIndex });
    setShowAnswer(true);
    setTimeLeft(0);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      calculateScore();
      navigate('/result');
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correct) {
        correct++;
      }
    });
    setScore(correct);
    
    // Save fullscreen violation time for students
    if (user?.role === 'student' && timeOutsideFullscreen > 0) {
      const violationData = {
        timeOutsideFullscreen,
        quizTopic: selectedTopic,
        quizDifficulty: selectedDifficulty,
        timestamp: Date.now()
      };
      const existing = JSON.parse(localStorage.getItem('fullscreenViolations') || '[]');
      existing.push(violationData);
      localStorage.setItem('fullscreenViolations', JSON.stringify(existing));
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Fullscreen Warning for Students */}
        {user?.role === 'student' && !practiceMode && !isFullscreen && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border-2 border-red-500 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaExpand className="text-red-600 dark:text-red-400" />
                <span className="font-semibold text-red-800 dark:text-red-200">
                  Warning: You are not in fullscreen mode!
                </span>
              </div>
              <div className="text-red-700 dark:text-red-300 font-semibold">
                Time outside: {timeOutsideFullscreen}s
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold dark:text-white">
              {selectedTopic} - {selectedDifficulty.toUpperCase()} {practiceMode ? '(Practice Mode)' : 'Mode'}
            </h1>
            <div className="flex items-center space-x-4">
              {!practiceMode && (
                <div className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg">
                  <FaClock />
                  <span className="font-semibold">{timeLeft}s</span>
                </div>
              )}
              {user?.role === 'student' && !practiceMode && (
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  isFullscreen ? 'bg-green-500' : 'bg-yellow-500'
                } text-white`}>
                  <FaExpand />
                  <span className="font-semibold text-sm">
                    {isFullscreen ? 'Fullscreen' : 'Not Fullscreen'}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
        </div>

        {/* Question Card */}
        <div className="card mb-6">
          <h2 className="text-2xl font-bold mb-8 dark:text-white min-h-[80px]">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correct;
              const isWrong = isSelected && !isCorrect;
              
              let optionClass = 'option-card';
              if (showAnswer && isCorrect) optionClass += ' correct';
              if (showAnswer && isWrong) optionClass += ' incorrect';
              if (isSelected && !showAnswer) optionClass += ' selected';

              return (
                <div
                  key={index}
                  onClick={() => !showAnswer && timeLeft > 0 && setSelectedAnswer(index)}
                  className={`${optionClass} flex items-center justify-between`}
                >
                  <span className="font-medium dark:text-white">{option}</span>
                  {showAnswer && isCorrect && (
                    <FaCheck className="text-green-500 text-xl" />
                  )}
                  {showAnswer && isWrong && (
                    <FaTimes className="text-red-500 text-xl" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
          >
            <FaArrowLeft />
            <span>Previous</span>
          </button>

          {showAnswer ? (
            <button
              onClick={handleNext}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>{currentQuestionIndex === totalQuestions - 1 ? 'Submit' : 'Next'}</span>
              <FaArrowRight />
            </button>
          ) : (
            <button
              onClick={() => handleAnswer()}
              disabled={selectedAnswer === null}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Answer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;

