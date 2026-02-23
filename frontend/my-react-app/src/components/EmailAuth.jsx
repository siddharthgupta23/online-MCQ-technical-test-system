// import React, { useState } from 'react';
// import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const EmailAuth = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name,setName]= useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:3023/api/faculty/signup', {name,email, password });
//       localStorage.setItem('token', res.data.token);
//       navigate('/success');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Signup failed');
//     }
//   };

//   return (
//     <Row className="vh-100 g-0">
//       <Col md={6} className="left-panel">QuizMaster</Col>
//       <Col md={6} className="right-panel">
//         <div className="form-container">
//           <h3 className="text-center mb-4">Authenticate Email</h3>
//           {error && <Alert variant="danger">{error}</Alert>}
//           <Form onSubmit={handleSignup}>
//           <Form.Group className="mb-3">
//               <Form.Label>Name</Form.Label>
//               <Form.Control
//                 type="name"
//                 placeholder="Enter your Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Work Email</Form.Label>
//               <Form.Control
//                 type="email"
//                 placeholder="Enter your Email ID"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Create Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 placeholder="Enter password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </Form.Group>
//             <Form.Check
//               type="checkbox"
//               label={<span>Accept <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>}
//               className="mb-3"
//               required
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

// export default EmailAuth;


import React, { useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const EmailAuth = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleContinue = (e) => {
    e.preventDefault();

    // ✅ Check that the email contains ".work@gmail.com"
    if (!email.endsWith('.work@gmail.com')) {
      setError('Please enter a valid work email');
      return;
    }

    // ✅ Store the email temporarily for signup page
    localStorage.setItem('workEmail', email);
    navigate('/faculty/signup');
  };

  return (
    <Row className="vh-100 g-0">
      <Col md={6} className="left-panel">QuizMaster</Col>
      <Col md={6} className="right-panel">
        <div className="form-container ms-5">
          <h3 className="text-center mb-4">Authenticate Work Email</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleContinue}>
            <Form.Group className="mb-3">
              <Form.Label>Work Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" className="w-100" variant="primary">
              Continue
            </Button>
          </Form>
        </div>
      </Col>

         {/* <Button
      variant="outline-secondary"
      onClick={handleBack}
      className="mb-3 d-flex align-items-center gap-2"
    >
      <ArrowLeft /> Back
    </Button> */}
    </Row>
    
  );
};

export default EmailAuth;
