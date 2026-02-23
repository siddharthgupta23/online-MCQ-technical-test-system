import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/faculty/overall');
  };

  return (
    <Row className="vh-100 g-0">
      <Col md={6} className="left-panel">QuizMaster</Col>
      <Col md={6} className="right-panel">
        <div className="text-center">
          <h2>🎉 Congratulations!</h2>
          <p>Welcome, Faculty You have successfully registered.</p>
          <Button variant="primary" onClick={handleContinue}>Continue</Button>
        </div>
      </Col>
    </Row>
  );
};

export default Success;