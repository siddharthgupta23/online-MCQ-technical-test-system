import React, { useEffect, useState } from 'react';
import '../../../styles/dashboard.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const [student, setStudent] = useState(JSON.parse(localStorage.getItem('student') || 'null'));
  const [quizzes, setQuizzes] = useState({ overall: [], active: [], upcoming: [], completed: [] });
  const [notifs, setNotifs] = useState([]);
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState('Overall');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

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
    if (!student) return;
    fetchAll();
  }, [student]);

  async function fetchAll() {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const q = await axios.get('http://localhost:3023/api/quizzes/my', { headers });
      setQuizzes(q.data);
      const n = await axios.get('http://localhost:3023/api/notifications/my', { headers });
      setNotifs(n.data);
      const r = await axios.get('http://localhost:3023/api/results/my', { headers });
      setResults(r.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function markRead(id) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const res = await fetch(`http://localhost:3023/api/notifications/${id}/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Failed to mark notification read:", errData.message);
      } else {
        console.log("Notification marked as read");
        fetchAll();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    window.location.href = '/student/login';
  }

  function renderCard(q) {
    const now = new Date();
    const start = q.startTime ? new Date(q.startTime) : null;
    const end = q.endTime ? new Date(q.endTime) : null;
    let status = 'Upcoming';
    if (start && end) {
      if (now >= start && now <= end) status = 'Active';
      else if (now > end) status = 'Completed';
      else if (now < start) status = 'Upcoming';
    }
    const dueText = end ? `Due: ${end.toLocaleString()}` : 'Due: TBD';
    /*const hasAttempted = results.some(r => r.quiz?._id === q._id);
    const hasAttemptedd = results.some(r => r.subject === q.subject);*/
    const hasAttempted =
  results.some(r => r.quiz?._id === q._id) ||
  results.some(r => r.subject === q.subject);
  const matchedResult =
  results.find(r => r.quiz?._id === q._id) ||
  results.find(r => r.subject === q.subject);



    return (
      <div className="card quiz-card m-2" key={q._id}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="quiz-icon">📘</div>
            </div>
            <div className="ms-2" style={{ flex: 1 }}>
              <h6 className="card-title mb-1">{q.title}</h6>
              <div className="text-muted small">Status: {status}</div>
              <div className="text-muted small">{dueText}</div>
            </div>
          </div>

          <div className="mt-3">
            {status === 'Active' && (
              hasAttempted ? (
                <button className="btn btn-secondary w-100 disabled">
                  Attempted
                </button>
              ) : (
                <button
                  className="btn btn-primary w-100"
                  onClick={() => navigate(`/quiz/subject/${encodeURIComponent(q.subject)}/start`)}
                >
                  Start Quiz
                </button>
              )
            )}

            {status === 'Upcoming' && <button className="btn btn-light disabled w-100">Not Started Yet</button>}

            {status === 'Completed' && (
              hasAttempted ? (
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() =>
                    navigate(
                   //   `/quiz/${q._id}/result/${results.find((r) => r.quiz._id === q._id)._id}`
                         `/quiz/${q._id}/result/${matchedResult._id}`
                    )
                  }
                >
                  View Result
                </button>
              ) : (
                <button className="btn btn-light disabled w-100">Not Attempted</button>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  function FeedbackCard({ result }) {
    return (
      <div
        className="card m-2 p-3 feedback-card"
        style={{ backgroundColor: '#fdfdfd' }}
      >
        <div className="small text-muted">
          {new Date(result.attemptedAt || result.createdAt).toLocaleString()}
        </div>
        <strong>{result.quiz?.title || 'Quiz'}</strong>
        <div className="text-muted small">
          Subject: {result.quiz?.subject || result.subject || 'N/A'}
        </div>
        <div className="mt-2 fw-bold">
          Score: {result.score} / {result.total} ({result.percentage}%)
        </div>
        <button onClick={() => navigate(`/result/${result._id}/feedback`)} className="btn btn-outline-primary btn-sm mt-2">
          View Feedback
        </button>
      </div>
    );
  }

  const tabs = {
    Overall: quizzes.overall,
    'Active Quizzes': quizzes.active,
    'Upcoming Quizzes': quizzes.upcoming,
    'Completed Quizzes': quizzes.completed
  };

  return (
    <div className="d-flex">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <aside className={`left-panel p-3 ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="h6 text-primary">Student Dashboard</div>
          <button 
            className="btn btn-sm btn-outline-secondary sidebar-close-btn" 
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <ul className="list-unstyled">
          {Object.keys(tabs).map(tab => (
            <li key={tab} className="mb-2">
              <button 
                className={`btn w-100 text-start ${activeTab === tab ? 'btn-primary text-white' : 'btn-light'}`}
                onClick={() => {
                  setActiveTab(tab);
                  // Close sidebar on mobile after selection
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-5 border-top pt-3">
          <div className="small fw-bold">Notifications</div>
          <ul className="list-unstyled mt-2">
            {notifs.slice(0, 3).map(n => (
              <li key={n._id} className="mb-2">
                <div className={`p-2 small ${n.read ? 'bg-light' : 'bg-white border'}`}>
                  <div className="d-flex justify-content-between">
                    <div>{n.title}</div>
                    {!n.read && <button className="btn btn-sm btn-link" onClick={() => markRead(n._id)}>Mark read</button>}
                  </div>
                  <div className="text-muted small">{n.message}</div>
                </div>
              </li>
            ))}
            {notifs.length === 0 && <li className="text-muted small">No notifications</li>}
          </ul>
        </div>

        <div className="mt-auto pt-3 border-top">
          <button className="btn btn-outline-danger w-100" onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <div className="mb-2 mb-md-0">
            <h3>Welcome, {student?.name || 'Student'}</h3>
            <small className="text-muted">Your Personalised Quiz Dashboard</small>
          </div>
          <div className="d-flex align-items-center flex-wrap gap-2">
            <button 
              className="btn btn-light sidebar-toggle-btn" 
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              ☰
            </button>
            <div className="me-2 me-md-3 text-muted small">{notifs.filter(n => !n.read).length} unread</div>
            <button className="btn btn-outline-secondary" onClick={fetchAll}>Refresh</button>
          </div>
        </div>

        <div className="d-flex flex-wrap">
          {(!tabs[activeTab] || tabs[activeTab].length === 0) && <div className="text-muted">No quizzes in this section</div>}
          {(tabs[activeTab] || []).map(renderCard)}
        </div>

        <div className="mt-4">
          <h5>Performance</h5>
          <div className="d-flex flex-wrap">
            {results.length === 0 && <div className="text-muted">No results yet</div>}
            {results.map((r) => (
              <FeedbackCard key={r._id} result={r} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
