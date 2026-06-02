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
import '../../../styles/faculty-dashboard.css';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [facultyName, setFacultyName] = useState('Faculty');

  // Auto-detect screen size and set sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    // Set initial state
    handleResize();
    
    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/faculty/login');
      return;
    }

    axios.get('https://online-mcq-technical-test-system.vercel.app/api/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.student) {
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

  const handleNavClick = () => {
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <Container fluid className="faculty-dashboard-container">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="faculty-sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <Row className="g-0">
        <Col md={3} lg={2} className={`faculty-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <h4>Faculty Dashboard</h4>
            <button 
              className="close-btn" 
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              ×
            </button>
          </div>
          
          <nav className="sidebar-nav">
            <div className="nav-section">
              <button 
                className={`nav-item ${isActive('/faculty') || isActive('/faculty/overall') ? 'active' : ''}`}
                onClick={() => {
                  navigate('/faculty/overall');
                  handleNavClick();
                }}
              >
                <span className="nav-icon">⊞</span>
                <span>Overall</span>
              </button>
              <button 
                className={`nav-item ${isActive('/faculty/active-quizzes') ? 'active' : ''}`}
                onClick={() => {
                  navigate('/faculty/active-quizzes');
                  handleNavClick();
                }}
              >
                <span className="nav-icon">🕐</span>
                <span>Active Quizzes</span>
              </button>
              <button 
                className={`nav-item ${isActive('/faculty/upcoming-quizzes') ? 'active' : ''}`}
                onClick={() => {
                  navigate('/faculty/upcoming-quizzes');
                  handleNavClick();
                }}
              >
                <span className="nav-icon">📅</span>
                <span>Upcoming Quizzes</span>
              </button>
              <button 
                className={`nav-item ${isActive('/faculty/completed-quizzes') ? 'active' : ''}`}
                onClick={() => {
                  navigate('/faculty/completed-quizzes');
                  handleNavClick();
                }}
              >
                <span className="nav-icon">✓</span>
                <span>Completed Quizzes</span>
              </button>
            </div>

            <div className="nav-divider"></div>

            <div className="nav-section">
              <button 
                className={`nav-item ${isActive('/faculty/manage-students') ? 'active' : ''}`}
                onClick={() => {
                  navigate('/faculty/manage-students');
                  handleNavClick();
                }}
              >
                <span className="nav-icon">👥</span>
                <span>Manage Students</span>
              </button>
              <button 
                className={`nav-item ${isActive('/faculty/add-student') ? 'active' : ''}`}
                onClick={() => {
                  navigate('/faculty/add-student');
                  handleNavClick();
                }}
              >
                <span className="nav-icon">👤</span>
                <span>Add Student</span>
              </button>
              <button 
                className={`nav-item ${isActive('/faculty/upload-students') ? 'active' : ''}`}
                onClick={() => {
                  navigate('/faculty/upload-students');
                  handleNavClick();
                }}
              >
                <span className="nav-icon">📤</span>
                <span>Upload Students (Excel)</span>
              </button>
            </div>

            <div className="nav-section">
              <button 
                className={`nav-item ${isActive('/faculty/create-quiz') ? 'active' : ''}`}
                onClick={() => {
                  navigate('/faculty/create-quiz');
                  handleNavClick();
                }}
              >
                <span className="nav-icon">⊕</span>
                <span>Create Quiz</span>
              </button>
              <button 
                className={`nav-item ${isActive('/faculty/quiz-activity') ? 'active' : ''}`}
                onClick={() => {
                  navigate('/faculty/quiz-activity');
                  handleNavClick();
                }}
              >
                <span className="nav-icon">📊</span>
                <span>Quiz Activity</span>
              </button>
              <button 
                className={`nav-item ${isActive('/faculty/send-notification') ? 'active' : ''}`}
                onClick={() => {
                  navigate('/faculty/send-notification');
                  handleNavClick();
                }}
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
                onClick={() => {
                  navigate('/faculty/logout');
                  handleNavClick();
                }}
              >
                <span className="nav-icon">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </Col>

        <Col md={9} lg={10} className="faculty-main-content">
          {/* Mobile menu toggle button */}
          <button 
            className="faculty-sidebar-toggle-btn" 
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            ☰
          </button>
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
