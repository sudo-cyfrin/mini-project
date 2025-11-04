import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { FaTrophy, FaMedal, FaAward, FaHome, FaPlay } from 'react-icons/fa';
import { RiVipCrownLine } from 'react-icons/ri';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { leaderboard, resetQuiz } = useQuiz();

  const getMedalIcon = (index) => {
    if (index === 0) return <RiVipCrownLine className="text-yellow-400" />;
    if (index === 1) return <FaMedal className="text-gray-400" />;
    if (index === 2) return <FaAward className="text-orange-400" />;
    return null;
  };

  const handleStartQuiz = () => {
    resetQuiz();
    navigate('/topics');
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <FaTrophy className="text-6xl text-yellow-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Top performers of all time
          </p>
        </div>

        {leaderboard.length === 0 ? (
          <div className="card text-center py-16">
            <FaTrophy className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              No records yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Be the first to appear on the leaderboard!
            </p>
            <button
              onClick={handleStartQuiz}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <FaPlay />
              <span>Start Quiz</span>
            </button>
          </div>
        ) : (
          <>
            {/* Top 3 Winners */}
            {leaderboard.length >= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* 2nd Place */}
                <div className="card text-center hover:scale-105 transform transition-transform">
                  <div className="text-4xl mb-2 text-gray-400">🥈</div>
                  <div className="text-2xl font-bold dark:text-white">
                    {leaderboard[1].name}
                  </div>
                  <div className="text-3xl font-bold text-gray-400 mt-2">
                    {leaderboard[1].percentage}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {leaderboard[1].topic} - {leaderboard[1].difficulty}
                  </div>
                </div>

                {/* 1st Place */}
                <div className="card text-center hover:scale-110 transform transition-transform bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 border-2 border-yellow-400">
                  <div className="text-6xl mb-2">🏆</div>
                  <div className="text-2xl font-bold dark:text-white">
                    {leaderboard[0].name}
                  </div>
                  <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
                    {leaderboard[0].percentage}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {leaderboard[0].topic} - {leaderboard[0].difficulty}
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="card text-center hover:scale-105 transform transition-transform">
                  <div className="text-4xl mb-2 text-orange-400">🥉</div>
                  <div className="text-2xl font-bold dark:text-white">
                    {leaderboard[2].name}
                  </div>
                  <div className="text-3xl font-bold text-orange-400 mt-2">
                    {leaderboard[2].percentage}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {leaderboard[2].topic} - {leaderboard[2].difficulty}
                  </div>
                </div>
              </div>
            )}

            {/* Full Leaderboard List */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6 dark:text-white">
                All Time Rankings
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 dark:text-white">Rank</th>
                      <th className="text-left py-3 px-4 dark:text-white">Name</th>
                      <th className="text-left py-3 px-4 dark:text-white">Topic</th>
                      <th className="text-left py-3 px-4 dark:text-white">Difficulty</th>
                      <th className="text-left py-3 px-4 dark:text-white">Score</th>
                      <th className="text-left py-3 px-4 dark:text-white">Percentage</th>
                      <th className="text-left py-3 px-4 dark:text-white">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr
                        key={entry.id}
                        className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          index < 3 ? 'bg-yellow-50 dark:bg-yellow-900 bg-opacity-30' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {index < 3 ? (
                              <span className="text-2xl">{getMedalIcon(index)}</span>
                            ) : null}
                            <span className="font-semibold dark:text-white">
                              {index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold dark:text-white">
                          {entry.name}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {entry.topic}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {entry.difficulty.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold dark:text-white">
                          {entry.score}/{entry.totalQuestions}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-green-600 dark:text-green-400">
                            {entry.percentage}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {entry.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => navigate('/')}
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <FaHome />
            <span>Home</span>
          </button>
          {leaderboard.length > 0 && (
            <button
              onClick={handleStartQuiz}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <FaPlay />
              <span>Play Quiz</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

