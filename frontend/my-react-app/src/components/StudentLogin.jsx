// import React from 'react';
// import { Row, Col, Form, Button } from 'react-bootstrap';

// const StudentLogin = () => {
//   return (
//     <Row className="vh-100 g-0">
//       <Col md={6} className="left-panel">QuizMaster</Col>
//       <Col md={6} className="right-panel">
//         <div className="form-container">
//           <h3 className="text-center mb-4">Student Login</h3>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>User ID</Form.Label>
//               <Form.Control type="text" placeholder="Enter your user ID" />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Password</Form.Label>
//               <Form.Control type="password" placeholder="Enter your password" />
//             </Form.Group>
//             <Form.Check
//               type="checkbox"
//               label={<span>Accept <a href='#'>Terms of Service</a> and <a href='#'>Privacy Policy</a></span>}
//               className="mb-3"
//             />
//             <Button type="submit" className="w-100" variant="primary">Get Started</Button>
//           </Form>
//         </div>
//       </Col>
//     </Row>
//   );
// };

// export default StudentLogin;


import React, { useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentLogin = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://online-mcq-technical-test-system.vercel.app/api/student/login', { userId, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('student', JSON.stringify(res.data.student));
      navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <Row className="vh-100 g-0">
      <Col md={6} className="left-panel">QuizMaster</Col>
      <Col md={6} className="right-panel">
        <div className="form-container">
          <h3 className="text-center mb-4">Student Login</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label={<span>Accept <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>}
              className="mb-3"
              required
            />
            <Button type="submit" className="w-100" variant="primary">Get Started</Button>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default StudentLogin;
