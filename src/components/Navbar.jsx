import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { FaMoon, FaSun, FaHome, FaTrophy, FaUser, FaSignOutAlt, FaUserGraduate } from 'react-icons/fa';

const Navbar = () => {
  const { darkMode, toggleDarkMode, user, logout } = useQuiz();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              Quiz Platform
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FaHome className="text-sm" />
                <span>Home</span>
              </Link>
              {!user && (
                <Link 
                  to="/topics" 
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span>Start Quiz</span>
                </Link>
              )}
              {user?.role === 'student' && (
                <Link 
                  to="/student-dashboard" 
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <FaUserGraduate className="text-sm" />
                  <span>Dashboard</span>
                </Link>
              )}
              {user?.role === 'teacher' && (
                <Link 
                  to="/teacher-dashboard" 
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <FaUser className="text-sm" />
                  <span>Dashboard</span>
                </Link>
              )}
              <Link 
                to="/leaderboard" 
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FaTrophy className="text-sm" />
                <span>Leaderboard</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-2 text-sm">
                  <span className="text-gray-700 dark:text-gray-300">
                    {user.username} ({user.role === 'teacher' ? 'Teacher' : 'Student'})
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  title="Logout"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FaUser className="text-sm" />
                <span>Login</span>
              </Link>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FaSun className="text-yellow-500 text-xl" />
              ) : (
                <FaMoon className="text-gray-700 text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
