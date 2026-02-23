import React, { useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/auth.css';

const FacultyLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3023/api/faculty/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/success');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="auth-container g-0">
      <Col md={6} className="auth-left-panel d-none d-md-flex">
        <div className="auth-brand-content">
          <h1 className="auth-brand-title">QuizMaster</h1>
          <p className="auth-brand-subtitle">Manage quizzes, students, and track performance</p>
        </div>
      </Col>
      <Col md={6} className="auth-right-panel">
        <div className="auth-form-wrapper">
          <div className="auth-form-container">
            <h2 className="auth-form-title mb-3">Faculty Login</h2>
            <p className="auth-form-subtitle mb-4">Enter your credentials to access your dashboard</p>
            
            {error && (
              <Alert variant="danger" className="auth-alert">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label className="auth-label">Work Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              
              <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to="/authenticate" className="auth-link">
                  Don't have an account? Sign Up
                </Link>
              </div>
              
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

export default FacultyLogin;







