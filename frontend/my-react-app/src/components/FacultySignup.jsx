// import React from 'react';
// import { Row, Col, Form, Button } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';

// const FacultySignup = () => {
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     navigate('/authenticate');
//   };

//   return (
//     <Row className="vh-100 g-0">
//       <Col md={6} className="left-panel">QuizMaster</Col>
//       <Col md={6} className="right-panel">
//         <div className="form-container">
//           <h3 className="text-center mb-4">Authenticate Email</h3>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Work Email</Form.Label>
//               <Form.Control type="email" placeholder="Enter your Email ID" />
//             </Form.Group>
//             <Form.Check
//               type="checkbox"
//               label={<span>Accept <a href='#'>Terms of Service</a> and <a href='#'>Privacy Policy</a></span>}
//               className="mb-3"
//             />
//             <Button type="submit" className="w-100" variant="primary">Continue</Button>
//             <div className="text-center mt-3">
//               <a href="/faculty/login">Already Registered? Login.</a>
//             </div>
//           </Form>
//         </div>
//       </Col>
//     </Row>
//   );
// };

// export default FacultySignup;

import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FacultySignup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // ✅ Pre-fill work email from EmailAuth
  useEffect(() => {
    const savedEmail = localStorage.getItem('workEmail');
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://online-mcq-technical-test-system.vercel.app/api/faculty/signup', { name, email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/success');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Row className="vh-100 g-0">
      <Col md={6} className="left-panel">QuizMaster</Col>
      <Col md={6} className="right-panel">
        <div className="form-container ms-5">
          <h3 className="text-center mb-4">Faculty Signup</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Work Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Create Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label={<span>Accept <a href="#">Terms</a> and <a href="#">Privacy Policy</a></span>}
              className="mb-3"
              required
            />
            <Button type="submit" className="w-100" variant="primary">
              Continue
            </Button>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default FacultySignup;
