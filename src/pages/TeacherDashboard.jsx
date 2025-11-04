import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const TeacherDashboard = () => {
  const { questionsData, updateQuestionsData } = useQuiz();
  const [selectedTopic, setSelectedTopic] = useState('DSA');
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correct: 0
  });

  const topics = Object.keys(questionsData);
  const difficulties = ['easy', 'medium', 'hard'];
  const currentQuestions = questionsData[selectedTopic]?.[selectedDifficulty] || [];

  const handleAddQuestion = () => {
    if (!formData.question.trim() || formData.options.some(opt => !opt.trim())) {
      alert('Please fill in all fields');
      return;
    }

    const newQuestion = {
      id: Date.now(),
      question: formData.question,
      options: formData.options,
      correct: formData.correct
    };

    const updated = JSON.parse(JSON.stringify(questionsData));
    if (!updated[selectedTopic][selectedDifficulty]) {
      updated[selectedTopic][selectedDifficulty] = [];
    }
    updated[selectedTopic][selectedDifficulty].push(newQuestion);
    updateQuestionsData(updated);
    
    setFormData({ question: '', options: ['', '', '', ''], correct: 0 });
    setShowAddForm(false);
  };

  const handleEditQuestion = (question) => {
    setEditingId(question.id);
    setFormData({
      question: question.question,
      options: [...question.options],
      correct: question.correct
    });
    setShowAddForm(true);
  };

  const handleUpdateQuestion = () => {
    if (!formData.question.trim() || formData.options.some(opt => !opt.trim())) {
      alert('Please fill in all fields');
      return;
    }

    const updated = JSON.parse(JSON.stringify(questionsData));
    const index = updated[selectedTopic][selectedDifficulty].findIndex(q => q.id === editingId);
    if (index !== -1) {
      updated[selectedTopic][selectedDifficulty][index] = {
        id: editingId,
        question: formData.question,
        options: formData.options,
        correct: formData.correct
      };
      updateQuestionsData(updated);
    }

    setEditingId(null);
    setFormData({ question: '', options: ['', '', '', ''], correct: 0 });
    setShowAddForm(false);
  };

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updated = JSON.parse(JSON.stringify(questionsData));
      updated[selectedTopic][selectedDifficulty] = updated[selectedTopic][selectedDifficulty].filter(
        q => q.id !== questionId
      );
      updateQuestionsData(updated);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({ question: '', options: ['', '', '', ''], correct: 0 });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Teacher Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage quiz questions by topic and difficulty
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => {
                  setSelectedTopic(e.target.value);
                  setShowAddForm(false);
                  setEditingId(null);
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value);
                  setShowAddForm(false);
                  setEditingId(null);
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add Question Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary mb-6 inline-flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add New Question</span>
          </button>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="card mb-6">
            <h3 className="text-xl font-bold mb-4 dark:text-white">
              {editingId ? 'Edit Question' : 'Add New Question'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Question</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  rows="3"
                  placeholder="Enter question text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Options</label>
                {formData.options.map((option, index) => (
                  <div key={index} className="mb-2 flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={formData.correct === index}
                      onChange={() => setFormData({ ...formData, correct: index })}
                      className="mr-2"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...formData.options];
                        newOptions[index] = e.target.value;
                        setFormData({ ...formData, options: newOptions });
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      placeholder={`Option ${index + 1}${formData.correct === index ? ' (Correct)' : ''}`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={editingId ? handleUpdateQuestion : handleAddQuestion}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <FaSave />
                  <span>{editingId ? 'Update' : 'Add'} Question</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="btn-secondary inline-flex items-center space-x-2"
                >
                  <FaTimes />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="card">
          <h3 className="text-2xl font-bold mb-4 dark:text-white">
            Questions ({currentQuestions.length})
          </h3>
          {currentQuestions.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No questions found. Add a new question to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {currentQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                          Q{index + 1}
                        </span>
                        {editingId === question.id && (
                          <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                            Editing
                          </span>
                        )}
                      </div>
                      <p className="text-lg font-semibold dark:text-white mb-3">
                        {question.question}
                      </p>
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-2 rounded ${
                              optIndex === question.correct
                                ? 'bg-green-50 dark:bg-green-900 border border-green-300 dark:border-green-700'
                                : 'bg-gray-50 dark:bg-gray-800'
                            }`}
                          >
                            <span className="text-sm dark:text-gray-300">
                              {optIndex === question.correct && '✓ '}
                              {option}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

