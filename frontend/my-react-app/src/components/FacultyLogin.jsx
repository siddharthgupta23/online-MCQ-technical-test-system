// import React from 'react';
// import { Row, Col, Form, Button } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

// const FacultyLogin = () => {
//   return (
//     <Row className="vh-100 g-0">
//       <Col md={6} className="left-panel">QuizMaster</Col>
//       <Col md={6} className="right-panel">
//         <div className="form-container">
//           <h3 className="text-center mb-4">Login</h3>
//           <div className="d-flex justify-content-around mb-4">
//             <div className="role-btn">👨‍🎓 Student</div>
//             <div className="role-btn active">👩‍🏫 Faculty</div>
//           </div>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Work Email</Form.Label>
//               <Form.Control type="email" placeholder="Enter your Email ID" />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Password</Form.Label>
//               <Form.Control type="password" placeholder="Enter your Password" />
//             </Form.Group>
//             <div className="d-flex justify-content-between mb-3">
//               <Link to="/faculty/signup">Sign Up</Link>
//               <a href="#">Forgot Password?</a>
//             </div>
//             <Button className="w-100" variant="primary">Get Started</Button>
//           </Form>
//         </div>
//       </Col>
//     </Row>
//   );
// };

// export default FacultyLogin;

import React, { useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FacultyLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://online-mcq-technical-test-system.vercel.app/api/faculty/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/success');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Row className="vh-100 g-0">
      <Col md={6} className="left-panel">QuizMaster</Col>
      <Col md={6} className="right-panel">
        <div className="form-container ms-5">
          <h3 className="text-center mb-4 gap-5">Faculty Login</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Work Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-between mb-3">
              <Link to="/authenticate">Sign Up</Link>
            </div>
            <Button type="submit" className="w-100" variant="primary">Get Started</Button>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default FacultyLogin;
