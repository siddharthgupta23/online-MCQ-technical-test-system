import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/faculty-dashboard.css';

const CreateQuiz = () => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    totalMarks: '',
    durationMinutes: '',
    startTime: '',
    endTime: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('https://online-mcq-technical-test-system.vercel.app/api/faculty/quizzes', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Navigate to add questions page
      navigate(`/faculty/quiz/${res.data.quiz._id}/questions`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating quiz');
    }
  };

  return (
    <div>
      <div className="faculty-page-header">
        <h1 className="faculty-page-title">Create Quiz</h1>
        <p className="faculty-page-subtitle">Create New Quiz</p>
      </div>

      <div className="faculty-form-container">
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Quiz Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Quiz Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              type="text"
              name="subject"
              className="form-control"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Total Marks</label>
            <input
              type="number"
              name="totalMarks"
              className="form-control"
              placeholder="Total Marks"
              value={formData.totalMarks}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Duration (in minutes)</label>
            <input
              type="number"
              name="durationMinutes"
              className="form-control"
              placeholder="Duration (in minutes)"
              value={formData.durationMinutes}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Start Time (optional)</label>
            <input
              type="datetime-local"
              name="startTime"
              className="form-control"
              value={formData.startTime}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">End Time (optional)</label>
            <input
              type="datetime-local"
              name="endTime"
              className="form-control"
              value={formData.endTime}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-primary w-100">Create Quiz</button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;





