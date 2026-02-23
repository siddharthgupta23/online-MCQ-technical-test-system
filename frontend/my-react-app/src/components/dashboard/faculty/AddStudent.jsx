import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/faculty-dashboard.css';

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    userId: '',
    password: '',
    course: '',
    subject: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3023/api/faculty/students', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Student added successfully!');
      setFormData({ name: '', userId: '', password: '', course: '', subject: '' });
      setTimeout(() => {
        navigate('/faculty/manage-students');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding student');
    }
  };

  return (
    <div>
      <div className="faculty-page-header">
        <h1 className="faculty-page-title">Add Student</h1>
        <p className="faculty-page-subtitle">Add Student Individually</p>
      </div>

      <div className="faculty-form-container">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Student Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Student Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">User ID</label>
            <input
              type="text"
              name="userId"
              className="form-control"
              placeholder="User ID"
              value={formData.userId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Course</label>
            <input
              type="text"
              name="course"
              className="form-control"
              placeholder="Course"
              value={formData.course}
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

          <button type="submit" className="btn-primary w-100">Add Student</button>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;





