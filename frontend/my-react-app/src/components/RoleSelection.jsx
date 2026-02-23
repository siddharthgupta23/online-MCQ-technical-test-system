

import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import frame3 from "../assets/Frame 3.png";
import frame4 from "../assets/Frame 3 (1).png";

const RoleSelection = () => {
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === 'student') navigate('/student/login');
    else navigate('/faculty/login');
  };

  return (
    <Row className="vh-100 g-0">
      <Col md={6} className="left-panel">QuizMaster</Col>
      <Col md={6} className="right-panel col-lg" >
        <div className="form-container">
          <h3 className="text-center mb-4">Login</h3>
          <div className="d-flex justify-content-between mb-4 gap-5">
            <div
              className={`role-btn ${role === 'student' ? 'active' : ''}`}
              onClick={() => setRole('student')}
            >
              <div><img src={frame3}/></div>
               <div className=""><h5>Student</h5></div>
            </div>
            <div
              className={`role-btn ${role === 'faculty' ? 'active' : ''}`}
              onClick={() => setRole('faculty')} 
            >
              <img src={frame4}/>
              Faculty
            </div>
          </div>
          <Form onSubmit={handleSubmit}>
            <Button type="submit" className="w-100 justify-content-center" variant="primary">
              Get Started
            </Button>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default RoleSelection