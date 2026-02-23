import React, { useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

const EmailAuth = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleContinue = (e) => {
    e.preventDefault();
    setError('');

    if (!email.endsWith('.work@gmail.com')) {
      setError('Please enter a valid work email ending with .work@gmail.com');
      return;
    }

    localStorage.setItem('workEmail', email);
    navigate('/faculty/signup');
  };

  return (
    <Row className="auth-container g-0">
      <Col md={6} className="auth-left-panel d-none d-md-flex">
        <div className="auth-brand-content">
          <h1 className="auth-brand-title">QuizMaster</h1>
          <p className="auth-brand-subtitle">Verify your work email to continue registration</p>
        </div>
      </Col>
      <Col md={6} className="auth-right-panel">
        <div className="auth-form-wrapper">
          <div className="auth-form-container">
            <h2 className="auth-form-title mb-3">Authenticate Work Email</h2>
            <p className="auth-form-subtitle mb-4">Enter your work email to verify your identity</p>
            
            {error && (
              <Alert variant="danger" className="auth-alert">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleContinue}>
              <Form.Group className="mb-4">
                <Form.Label className="auth-label">Work Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="yourname.work@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  required
                />
                <Form.Text className="text-muted mt-2">
                  Your email must end with .work@gmail.com
                </Form.Text>
              </Form.Group>
              
              <Button type="submit" className="auth-primary-btn w-100" variant="primary">
                Continue
              </Button>
            </Form>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default EmailAuth;







