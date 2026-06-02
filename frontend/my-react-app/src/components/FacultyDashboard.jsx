import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Overall from './faculty/Overall';
import ActiveQuizzes from './faculty/ActiveQuizzes';
import UpcomingQuizzes from './faculty/UpcomingQuizzes';
import CompletedQuizzes from './faculty/CompletedQuizzes';
import ManageStudents from './faculty/ManageStudents';
import AddStudent from './faculty/AddStudent';
import UploadStudents from './faculty/UploadStudents';
import CreateQuiz from './faculty/CreateQuiz';
import AddQuestions from './faculty/AddQuestions';
import QuizActivity from './faculty/QuizActivity';
import QuizDetails from './faculty/QuizDetails';
import SendNotification from './faculty/SendNotification';
import LogoutConfirmation from './faculty/LogoutConfirmation';
import '../styles/faculty-dashboard.css';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [facultyName, setFacultyName] = useState('Faculty');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/faculty/login');
      return;
    }

    // Get faculty info
    axios.get('https://online-mcq-technical-test-system.vercel.app/api/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.student) {
          // Wrong role, redirect
          navigate('/faculty/login');
        } else if (res.data.faculty) {
          setFacultyName(res.data.faculty.name || 'Faculty');
        }
      })
      .catch(() => {
        navigate('/faculty/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/faculty/login');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <Container fluid className="faculty-dashboard-container">
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={3} lg={2} className={`faculty-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <h4>Faculty Dashboard</h4>
            <button className="close-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>×</button>
          </div>
          
          <nav className="sidebar-nav">
            <div className="nav-section">
              <button 
                className={`nav-item ${isActive('/faculty') || isActive('/faculty/overall') ? 'active' : ''}`}
                onClick={() => navigate('/faculty/overall')}
              >
                <span className="nav-icon">⊞</span>
                <span>Overall</span>
              </button>
              <button 
                className={`nav-item ${isActive('/faculty/active-quizzes') ? 'active' : ''}`}
                onClick={() => navigate('/faculty/active-quizzes')}
              >
                <span className="nav-icon">🕐</span>
                <span>Active Quizzes</span>
              </button>
              <button 
                className={`nav-item ${isActive('/faculty/upcoming-quizzes') ? 'active' : ''}`}
                onClick={() => navigate('/faculty/upcoming-quizzes')}
              >
                <span className="nav-icon">📅</span>
                <span>Upcoming Quizzes</span>
              </button>
              <button 
                className={`nav-item ${isActive('/faculty/completed-quizzes') ? 'active' : ''}`}
                onClick={() => navigate('/faculty/completed-quizzes')}
              >
                <span className="nav-icon">✓</span>
                <span>Completed Quizzes</span>
              </button>
            </div>

            <div className="nav-divider"></div>

            <div className="nav-section">
              <button 
                className={`nav-item ${isActive('/faculty/manage-students') ? 'active' : ''}`}
                onClick={() => navigate('/faculty/manage-students')}
              >
                <span className="nav-icon">👥</span>
                <span>Manage Students</span>
              </button>
              <button 
                className={`nav-item ${isActive('/faculty/add-student') ? 'active' : ''}`}
                onClick={() => navigate('/faculty/add-student')}
              >
                <span className="nav-icon">👤</span>
                <span>Add Student</span>
              </button>
              <button 
                className={`nav-item ${isActive('/faculty/upload-students') ? 'active' : ''}`}
                onClick={() => navigate('/faculty/upload-students')}
              >
                <span className="nav-icon">📤</span>
                <span>Upload Students (Excel)</span>
              </button>
            </div>

            <div className="nav-section">
              <button 
                className={`nav-item ${isActive('/faculty/create-quiz') ? 'active' : ''}`}
                onClick={() => navigate('/faculty/create-quiz')}
              >
                <span className="nav-icon">⊕</span>
                <span>Create Quiz</span>
              </button>
              <button 
                className={`nav-item ${isActive('/faculty/quiz-activity') ? 'active' : ''}`}
                onClick={() => navigate('/faculty/quiz-activity')}
              >
                <span className="nav-icon">📊</span>
                <span>Quiz Activity</span>
              </button>
              <button 
                className={`nav-item ${isActive('/faculty/send-notification') ? 'active' : ''}`}
                onClick={() => navigate('/faculty/send-notification')}
              >
                <span className="nav-icon">🔔</span>
                <span>Send Notification</span>
              </button>
            </div>

            <div className="nav-divider"></div>

            <div className="nav-section">
              <button className="nav-item">
                <span className="nav-icon">🔔</span>
                <span>Notifications</span>
              </button>
              <button 
                className={`nav-item ${isActive('/faculty/logout') ? 'active' : ''}`}
                onClick={() => navigate('/faculty/logout')}
              >
                <span className="nav-icon">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </Col>

        {/* Main Content */}
        <Col md={9} lg={10} className="faculty-main-content">
          <Routes>
            <Route path="overall" element={<Overall />} />
            <Route path="active-quizzes" element={<ActiveQuizzes />} />
            <Route path="upcoming-quizzes" element={<UpcomingQuizzes />} />
            <Route path="completed-quizzes" element={<CompletedQuizzes />} />
            <Route path="manage-students" element={<ManageStudents />} />
            <Route path="add-student" element={<AddStudent />} />
            <Route path="upload-students" element={<UploadStudents />} />
            <Route path="create-quiz" element={<CreateQuiz />} />
            <Route path="quiz/:id/questions" element={<AddQuestions />} />
            <Route path="quiz-activity" element={<QuizActivity />} />
            <Route path="quiz/:id/details" element={<QuizDetails />} />
            <Route path="send-notification" element={<SendNotification />} />
            <Route path="logout" element={<LogoutConfirmation onLogout={handleLogout} />} />
            <Route path="" element={<Overall />} />
            <Route path="*" element={<Overall />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default FacultyDashboard;

