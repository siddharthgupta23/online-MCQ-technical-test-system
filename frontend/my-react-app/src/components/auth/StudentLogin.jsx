import React, { useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

const StudentLogin = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3023/api/student/login', { userId, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('student', JSON.stringify(res.data.student));
      navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="auth-container g-0">
      <Col md={6} className="auth-left-panel d-none d-md-flex">
        <div className="auth-brand-content">
          <h1 className="auth-brand-title">QuizMaster</h1>
          <p className="auth-brand-subtitle">Access your quizzes and track your progress</p>
        </div>
      </Col>
      <Col md={6} className="auth-right-panel">
        <div className="auth-form-wrapper">
          <div className="auth-form-container">
            <h2 className="auth-form-title mb-3">Student Login</h2>
            <p className="auth-form-subtitle mb-4">Enter your credentials to access your dashboard</p>
            
            {error && (
              <Alert variant="danger" className="auth-alert">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label className="auth-label">User ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your user ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="auth-input"
                  required
                  disabled={loading}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="auth-label">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  required
                  disabled={loading}
                />
              </Form.Group>
              
              <Form.Check
                type="checkbox"
                label={
                  <span className="auth-checkbox-label">
                    Accept <a href="#" className="auth-link">Terms of Service</a> and{' '}
                    <a href="#" className="auth-link">Privacy Policy</a>
                  </span>
                }
                className="mb-4"
                required
              />
              
              <Button 
                type="submit" 
                className="auth-primary-btn w-100" 
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Get Started'}
              </Button>
            </Form>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default StudentLogin;







