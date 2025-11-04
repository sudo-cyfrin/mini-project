import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBrain, FaRocket, FaTrophy, FaClock, FaGraduationCap } from 'react-icons/fa';
import { MdScience, MdSpeed } from 'react-icons/md';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <MdScience className="text-4xl" />, title: 'Multiple Topics', desc: 'DSA, DBMS, OS, CN & More' },
    { icon: <MdSpeed className="text-4xl" />, title: 'Difficulty Levels', desc: 'Easy, Medium, and Hard' },
    { icon: <FaClock className="text-4xl" />, title: 'Timed Questions', desc: 'Challenge yourself with time limits' },
    { icon: <FaTrophy className="text-4xl" />, title: 'Leaderboard', desc: 'Compete with others' }
  ];

  const topics = ['DSA', 'DBMS', 'OS', 'CN', 'Aptitude'];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-6">
            <FaBrain className="text-6xl text-blue-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to Quiz Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8">
            Test your knowledge across multiple topics and difficulty levels
          </p>
          <button
            onClick={() => navigate('/topics')}
            className="btn-primary text-lg px-8 py-4"
          >
            <span className="flex items-center justify-center space-x-2">
              <FaRocket />
              <span>Get Started</span>
            </span>
          </button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="card text-center hover:scale-105 transform transition-transform">
              <div className="flex justify-center mb-4 text-blue-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Available Topics */}
        <div className="card mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center dark:text-white">
            <FaGraduationCap className="inline-block mr-2 text-blue-500" />
            Available Topics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-4 rounded-lg text-center font-semibold text-gray-800 dark:text-gray-200"
              >
                {topic}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="card">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">5+</div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">Topics</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">15+</div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">Questions per Topic</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-600 dark:text-pink-400">3</div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">Difficulty Levels</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

