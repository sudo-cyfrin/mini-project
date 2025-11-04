import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { FaStar, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const DifficultySelection = () => {
  const navigate = useNavigate();
  const { setSelectedDifficulty, selectedTopic } = useQuiz();

  const difficulties = [
    { 
      level: 'easy', 
      label: 'Easy', 
      stars: 1, 
      color: 'from-green-400 to-emerald-500',
      bgColor: 'to-green-50 dark:to-green-900',
      desc: 'Perfect for beginners',
      time: '30s per question'
    },
    { 
      level: 'medium', 
      label: 'Medium', 
      stars: 2, 
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'to-yellow-50 dark:to-yellow-900',
      desc: 'For intermediate learners',
      time: '45s per question'
    },
    { 
      level: 'hard', 
      label: 'Hard', 
      stars: 3, 
      color: 'from-red-400 to-pink-500',
      bgColor: 'to-red-50 dark:to-red-900',
      desc: 'Challenge for experts',
      time: '60s per question'
    },
  ];

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Difficulty
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            Topic: <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedTopic}</span>
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-500">
            Select your challenge level
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {difficulties.map((difficulty, index) => (
            <div
              key={index}
              className="group cursor-pointer relative"
            >
              <div 
                onClick={() => handleDifficultySelect(difficulty.level)}
                className={`card h-full hover:scale-105 transform transition-all duration-300 bg-gradient-to-br from-white dark:from-gray-800 ${difficulty.bgColor} border-2 border-transparent group-hover:border-gray-300 dark:group-hover:border-gray-600`}
              >
                <div className="text-center">
                  <div className={`inline-block mb-4 text-5xl bg-gradient-to-r ${difficulty.color} bg-clip-text text-transparent`}>
                    {'★'.repeat(difficulty.stars)}
                  </div>
                  <h2 className="text-3xl font-bold mb-4 dark:text-white">
                    {difficulty.label}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {difficulty.desc}
                  </p>
                  <div className="flex items-center justify-center mb-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{difficulty.time}</span>
                  </div>
                  <button className={`btn-primary bg-gradient-to-r ${difficulty.color}`}>
                    <span className="flex items-center justify-center space-x-2">
                      <span>Start</span>
                      <FaArrowRight />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/topics')}
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <FaArrowLeft />
            <span>Back to Topics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DifficultySelection;

