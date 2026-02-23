import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/faculty-dashboard.css';

const QuizActivity = () => {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3023/api/faculty/quizzes/activity', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivity(res.data);
    } catch (err) {
      console.error('Error fetching activity:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div>
      <div className="faculty-page-header">
        <h1 className="faculty-page-title">Monitor Quiz Activity</h1>
      </div>

      <div className="faculty-table-container">
        <table className="faculty-table">
          <thead>
            <tr>
              <th>Quiz Title</th>
              <th>Total Students</th>
            {/* <th>Attempted</th> */}
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((item) => (
              <tr key={item.quizId}>
                <td>{item.title}</td>
                <td>{item.totalStudents}</td>
                {/* <td>{item.attempted}</td> */}
                <td>
                  <span className={`status-badge ${
                    item.status === 'Ongoing' ? 'ongoing' : 
                    item.status === 'Completed' ? 'completed' : 'not-attempted'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="action-btn edit"
                    onClick={() => navigate(`/faculty/quiz/${item.quizId}/details`)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizActivity;





