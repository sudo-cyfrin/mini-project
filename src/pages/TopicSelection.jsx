import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { 
  FaCode, 
  FaDatabase, 
  FaCog, 
  FaNetworkWired, 
  FaChartLine,
  FaArrowRight
} from 'react-icons/fa';

const TopicSelection = () => {
  const navigate = useNavigate();
  const { setSelectedTopic } = useQuiz();

  const topics = [
    { name: 'DSA', icon: <FaCode className="text-5xl" />, color: 'from-blue-500 to-cyan-500', desc: 'Data Structures & Algorithms' },
    { name: 'DBMS', icon: <FaDatabase className="text-5xl" />, color: 'from-purple-500 to-pink-500', desc: 'Database Management System' },
    { name: 'OS', icon: <FaCog className="text-5xl" />, color: 'from-green-500 to-teal-500', desc: 'Operating System' },
    { name: 'CN', icon: <FaNetworkWired className="text-5xl" />, color: 'from-orange-500 to-red-500', desc: 'Computer Networks' },
    { name: 'Aptitude', icon: <FaChartLine className="text-5xl" />, color: 'from-indigo-500 to-purple-500', desc: 'Quantitative Aptitude' },
  ];

  const handleTopicSelect = (topicName) => {
    setSelectedTopic(topicName);
    navigate('/difficulty');
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Select a Topic
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose a topic to test your knowledge
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => (
            <div
              key={index}
              onClick={() => handleTopicSelect(topic.name)}
              className="group cursor-pointer card hover:scale-105 transform transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className="flex justify-center mb-6 text-gray-700 dark:text-gray-300">
                  {topic.icon}
                </div>
                <h2 className="text-3xl font-bold text-center mb-3 dark:text-white">
                  {topic.name}
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                  {topic.desc}
                </p>
                <div className="flex justify-center">
                  <button className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
                    <span>Start Quiz</span>
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicSelection;

