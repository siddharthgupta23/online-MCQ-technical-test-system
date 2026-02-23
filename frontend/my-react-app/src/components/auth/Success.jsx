import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

const Success = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/faculty/overall');
  };

  return (
    <Row className="auth-container g-0">
      <Col md={6} className="auth-left-panel d-none d-md-flex">
        <div className="auth-brand-content">
          <h1 className="auth-brand-title">QuizMaster</h1>
          <p className="auth-brand-subtitle">Welcome to your dashboard</p>
        </div>
      </Col>
      <Col md={6} className="auth-right-panel">
        <div className="auth-form-wrapper">
          <div className="auth-form-container text-center">
            <div className="success-icon mb-4">
              <div className="success-checkmark">✓</div>
            </div>
            <h2 className="auth-form-title mb-3">🎉 Congratulations!</h2>
            <p className="auth-form-subtitle mb-4">
              Welcome! You have successfully registered as a faculty member.
            </p>
            <Button 
              variant="primary" 
              className="auth-primary-btn"
              onClick={handleContinue}
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Success;







