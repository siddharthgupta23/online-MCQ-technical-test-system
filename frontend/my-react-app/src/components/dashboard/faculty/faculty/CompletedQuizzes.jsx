import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../../styles/faculty-dashboard.css';

const CompletedQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://online-mcq-technical-test-system.vercel.app/api/faculty/quizzes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(res.data.completed || []);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div>
      <div className="faculty-page-header">
        <h1 className="faculty-page-title">Completed Quizzes</h1>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center p-5">
          <p>No completed quizzes.</p>
        </div>
      ) : (
        <div className="quizzes-grid">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card">
              <div className="quiz-card-header">
                <span className="quiz-icon">📖</span>
                <h3 className="quiz-title">{quiz.title || quiz.subject || 'Untitled Quiz'}</h3>
              </div>
              <div className="quiz-info">
                <p className="quiz-status">Status: Completed</p>
                <p className="quiz-due">Due: {formatDate(quiz.endTime)}</p>
              </div>
              <button 
                className="quiz-button primary"
                onClick={() => navigate(`/faculty/quiz/${quiz._id}/details`)}
              >
                View Result
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedQuizzes;




