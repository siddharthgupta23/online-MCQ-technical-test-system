import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import frame3 from "../../assets/Frame 3.png";
import frame4 from "../../assets/Frame 3 (1).png";
import '../../styles/auth.css';

const RoleSelection = () => {
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === 'student') navigate('/student/login');
    else navigate('/faculty/login');
  };

  return (
    <Row className="auth-container g-0">
      <Col md={6} className="auth-left-panel d-none d-md-flex">
        <div className="auth-brand-content">
          <h1 className="auth-brand-title">QuizMaster</h1>
          <p className="auth-brand-subtitle">Your comprehensive online MCQ technical system</p>
        </div>
      </Col>
      <Col md={6} className="auth-right-panel">
        <div className="auth-form-wrapper">
          <div className="auth-form-container">
            <h2 className="auth-form-title mb-4">Welcome Back</h2>
            <p className="auth-form-subtitle mb-4">Select your role to continue</p>
            
            <div className="role-selection-container mb-4">
              <div
                className={`role-card ${role === 'student' ? 'active' : ''}`}
                onClick={() => setRole('student')}
              >
                <div className="role-icon">
                  <img src={frame3} alt="Student" className="role-image" />
                </div>
                <div className="role-label">
                  <h5 className="mb-0">Student</h5>
                </div>
              </div>
              <div
                className={`role-card ${role === 'faculty' ? 'active' : ''}`}
                onClick={() => setRole('faculty')} 
              >
                <div className="role-icon">
                  <img src={frame4} alt="Faculty" className="role-image" />
                </div>
                <div className="role-label">
                  <h5 className="mb-0">Faculty</h5>
                </div>
              </div>
            </div>

            <Form onSubmit={handleSubmit}>
              <Button type="submit" className="auth-primary-btn w-100" variant="primary">
                Get Started
              </Button>
            </Form>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default RoleSelection;







