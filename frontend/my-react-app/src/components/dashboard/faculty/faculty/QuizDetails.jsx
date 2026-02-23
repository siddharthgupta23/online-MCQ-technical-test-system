import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../../styles/faculty-dashboard.css';

const QuizDetails = () => {
  const { id } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizDetails();
  }, [id]);

  const fetchQuizDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3023/api/faculty/quizzes/${id}/details`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizData(res.data);
    } catch (err) {
      console.error('Error fetching quiz details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!quizData) return;
    
    // Create CSV content
    const headers = ['Student ID', 'Name', 'Status', 'Score', 'Time Taken'];
    const rows = quizData.students.map(s => [
      s.studentId,
      s.name,
      s.status,
      s.score,
      s.timeTaken
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quizData.quiz.title}-report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (!quizData) {
    return <div className="text-center p-5">Quiz not found</div>;
  }

  return (
    <div>
      <div className="faculty-page-header">
        <h1 className="faculty-page-title">{quizData.quiz.title} - Details</h1>
      </div>

      <div className="faculty-table-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <p><strong>Subject:</strong> {quizData.quiz.subject}</p>
            <p><strong>Total Marks:</strong> {quizData.quiz.totalMarks}</p>
            <p><strong>Duration:</strong> {quizData.quiz.duration} minutes</p>
          </div>
          <button className="btn-primary" onClick={handleExport}>
            Export Report
          </button>
        </div>

        <table className="faculty-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Score</th>
              <th>Time Taken</th>
            </tr>
          </thead>
          <tbody>
            {quizData.students.map((student, idx) => (
              <tr key={idx}>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td>
                  <span className={`status-badge ${
                    student.status === 'Attempted' ? 'attempted' : 'not-attempted'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td>{student.score}</td>
                <td>{student.timeTaken}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizDetails;




