import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { 
  FaChartLine, 
  FaHistory, 
  FaBookOpen, 
  FaTrophy, 
  FaClock, 
  FaCheckCircle,
  FaTimesCircle,
  FaPlayCircle,
  FaGraduationCap
} from 'react-icons/fa';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { 
    user, 
    quizHistory, 
    questionsData,
    setSelectedTopic,
    setSelectedDifficulty,
    setPracticeMode
  } = useQuiz();

  const [activeTab, setActiveTab] = useState('overview');

  // Calculate statistics
  const totalQuizzes = quizHistory.length;
  const totalQuestions = quizHistory.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
  const totalCorrect = quizHistory.reduce((sum, quiz) => sum + quiz.score, 0);
  const averageScore = totalQuizzes > 0 
    ? (quizHistory.reduce((sum, quiz) => sum + parseFloat(quiz.percentage), 0) / totalQuizzes).toFixed(1)
    : 0;

  // Get topic-wise performance
  const topicPerformance = {};
  quizHistory.forEach(quiz => {
    if (!topicPerformance[quiz.topic]) {
      topicPerformance[quiz.topic] = { total: 0, correct: 0, quizzes: 0 };
    }
    topicPerformance[quiz.topic].total += quiz.totalQuestions;
    topicPerformance[quiz.topic].correct += quiz.score;
    topicPerformance[quiz.topic].quizzes += 1;
  });

  // Get recent incorrect answers
  const incorrectAnswers = quizHistory
    .flatMap(quiz => quiz.wrongAnswers || [])
    .slice(0, 5);

  const startPracticeQuiz = (topic, difficulty) => {
    setSelectedTopic(topic);
    setSelectedDifficulty(difficulty);
    setPracticeMode(true);
    navigate('/topics');
  };

  const startRegularQuiz = (topic, difficulty) => {
    setSelectedTopic(topic);
    setSelectedDifficulty(difficulty);
    setPracticeMode(false);
    navigate('/topics');
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome, {user?.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and improve your skills
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'overview', label: 'Overview', icon: FaChartLine },
            { id: 'history', label: 'Quiz History', icon: FaHistory },
            { id: 'practice', label: 'Practice Mode', icon: FaBookOpen }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <tab.icon className="inline-block mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="card text-center">
                <FaGraduationCap className="text-4xl text-blue-500 mx-auto mb-2" />
                <div className="text-3xl font-bold dark:text-white">{totalQuizzes}</div>
                <div className="text-gray-600 dark:text-gray-400">Total Quizzes</div>
              </div>
              <div className="card text-center">
                <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-2" />
                <div className="text-3xl font-bold dark:text-white">{totalCorrect}</div>
                <div className="text-gray-600 dark:text-gray-400">Correct Answers</div>
              </div>
              <div className="card text-center">
                <FaChartLine className="text-4xl text-purple-500 mx-auto mb-2" />
                <div className="text-3xl font-bold dark:text-white">{averageScore}%</div>
                <div className="text-gray-600 dark:text-gray-400">Average Score</div>
              </div>
              <div className="card text-center">
                <FaBookOpen className="text-4xl text-pink-500 mx-auto mb-2" />
                <div className="text-3xl font-bold dark:text-white">{totalQuestions}</div>
                <div className="text-gray-600 dark:text-gray-400">Questions Attempted</div>
              </div>
            </div>

            {/* Topic Performance */}
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 dark:text-white flex items-center">
                <FaTrophy className="mr-2 text-yellow-500" />
                Topic Performance
              </h3>
              {Object.keys(topicPerformance).length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                  No quiz history yet. Start taking quizzes to see your performance!
                </p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(topicPerformance).map(([topic, stats]) => {
                    const percentage = stats.total > 0 
                      ? ((stats.correct / stats.total) * 100).toFixed(1)
                      : 0;
                    return (
                      <div key={topic}>
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold dark:text-white">{topic}</span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {stats.correct}/{stats.total} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {stats.quizzes} quiz{stats.quizzes !== 1 ? 'zes' : ''} taken
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Incorrect Answers */}
            {incorrectAnswers.length > 0 && (
              <div className="card">
                <h3 className="text-2xl font-bold mb-4 dark:text-white flex items-center">
                  <FaTimesCircle className="mr-2 text-red-500" />
                  Areas to Improve
                </h3>
                <div className="space-y-2">
                  {incorrectAnswers.map((item, index) => (
                    <div key={index} className="p-3 bg-red-50 dark:bg-red-900 rounded-lg">
                      <p className="text-sm font-semibold dark:text-white">{item.question}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Topic: {item.topic} | Difficulty: {item.difficulty}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="card">
            <h3 className="text-2xl font-bold mb-4 dark:text-white">Quiz History</h3>
            {quizHistory.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No quiz history yet. Start taking quizzes!
              </p>
            ) : (
              <div className="space-y-4">
                {quizHistory.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-lg font-semibold dark:text-white">
                          {quiz.topic} - {quiz.difficulty.toUpperCase()}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {quiz.date} • {quiz.totalQuestions} questions
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {quiz.percentage}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {quiz.score}/{quiz.totalQuestions} correct
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${quiz.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Practice Mode Tab */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900">
              <h3 className="text-2xl font-bold mb-2 dark:text-white flex items-center">
                <FaBookOpen className="mr-2 text-blue-500" />
                Practice Mode
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Practice mode allows you to take quizzes without time limits. Learn at your own pace!
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold mb-4 dark:text-white">Available Topics</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(questionsData).map((topic) => (
                  <div key={topic} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-3 dark:text-white">{topic}</h4>
                    <div className="space-y-2">
                      {['easy', 'medium', 'hard'].map((difficulty) => {
                        const questionCount = questionsData[topic]?.[difficulty]?.length || 0;
                        return (
                          <div key={difficulty} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {difficulty}
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => startPracticeQuiz(topic, difficulty)}
                                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                title="Practice Mode"
                              >
                                <FaBookOpen className="inline mr-1" />
                                Practice
                              </button>
                              <button
                                onClick={() => startRegularQuiz(topic, difficulty)}
                                className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                                title="Timed Quiz"
                              >
                                <FaClock className="inline mr-1" />
                                Timed
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;

