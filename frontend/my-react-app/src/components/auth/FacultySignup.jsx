import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

const FacultySignup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('workEmail');
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3023/api/faculty/signup', { name, email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/success');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="auth-container g-0">
      <Col md={6} className="auth-left-panel d-none d-md-flex">
        <div className="auth-brand-content">
          <h1 className="auth-brand-title">QuizMaster</h1>
          <p className="auth-brand-subtitle">Create your faculty account and start managing quizzes</p>
        </div>
      </Col>
      <Col md={6} className="auth-right-panel">
        <div className="auth-form-wrapper">
          <div className="auth-form-container">
            <h2 className="auth-form-title mb-3">Faculty Signup</h2>
            <p className="auth-form-subtitle mb-4">Complete your registration</p>
            
            {error && (
              <Alert variant="danger" className="auth-alert">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="auth-label">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-input"
                  required
                  disabled={loading}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="auth-label">Work Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  readOnly
                  className="auth-input"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="auth-label">Create Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter a strong password"
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
                {loading ? 'Creating account...' : 'Continue'}
              </Button>
            </Form>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default FacultySignup;







