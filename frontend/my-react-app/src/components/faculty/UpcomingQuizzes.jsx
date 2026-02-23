import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/faculty-dashboard.css';

const UpcomingQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3023/api/faculty/quizzes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(res.data.upcoming || []);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    const quizDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (quizDate.getTime() === tomorrowDate.getTime()) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div>
      <div className="faculty-page-header">
        <h1 className="faculty-page-title">Upcoming Quizzes</h1>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center p-5">
          <p>No upcoming quizzes.</p>
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
                <p className="quiz-status">Status: Upcoming</p>
                <p className="quiz-due">Due: {formatDate(quiz.endTime || quiz.startTime)}</p>
              </div>
              <button className="quiz-button secondary" disabled>
                Not Started Yet
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingQuizzes;




