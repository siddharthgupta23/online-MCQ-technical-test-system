import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/faculty-dashboard.css';

const Overall = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalQuizzes: 0,
    activeQuizzes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3023/api/faculty/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
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
        <h1 className="faculty-page-title">Welcome, Faculty</h1>
        <p className="faculty-page-subtitle">Your Personalised Quiz Dashboard</p>
      </div>

      <div className="metrics-container">
        <div className="metric-card">
          <h3 className="metric-title">Total Students</h3>
          <p className="metric-value">{stats.totalStudents}</p>
        </div>
        <div className="metric-card">
          <h3 className="metric-title">Total Quizzes</h3>
          <p className="metric-value">{stats.totalQuizzes}</p>
        </div>
        <div className="metric-card">
          <h3 className="metric-title">Active Quizzes</h3>
          <p className="metric-value">{stats.activeQuizzes}</p>
        </div>
      </div>
    </div>
  );
};

export default Overall;




