import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { FaUser, FaUserGraduate, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useQuiz();
  const [role, setRole] = useState('student'); // 'student' or 'teacher'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Simple authentication - in production, this would connect to a backend
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Simple validation - in production, validate against backend
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    // Demo credentials
    const validCredentials = {
      teacher: { username: 'teacher', password: 'teacher123' },
      student: { username: 'student', password: 'student123' }
    };

    const creds = validCredentials[role];
    
    if (username === creds.username && password === creds.password) {
      login(username, role);
      if (role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } else {
      setError(`Invalid ${role} credentials. Demo: username="${creds.username}", password="${creds.password}"`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to continue to Quiz Platform
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3 dark:text-gray-300">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setRole('student');
                  setError('');
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  role === 'student'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <FaUserGraduate className="text-3xl mx-auto mb-2 text-blue-500" />
                <div className="font-semibold dark:text-white">Student</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Take quizzes & track progress
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('teacher');
                  setError('');
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  role === 'teacher'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 dark:border-purple-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <FaUser className="text-3xl mx-auto mb-2 text-purple-500" />
                <div className="font-semibold dark:text-white">Teacher</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Manage questions
                </div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder={`Enter ${role} username`}
                  required
                />
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 pl-11 pr-11 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter password"
                  required
                />
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg text-red-600 dark:text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full btn-primary py-3 text-lg"
            >
              Sign In as {role === 'teacher' ? 'Teacher' : 'Student'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

