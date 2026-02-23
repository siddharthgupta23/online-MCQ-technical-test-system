// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Auth Components
import RoleSelection from './components/auth/RoleSelection';
import FacultyLogin from './components/auth/FacultyLogin';
import StudentLogin from './components/auth/StudentLogin';
import FacultySignup from './components/auth/FacultySignup';
import EmailAuth from './components/auth/EmailAuth';
import Success from './components/auth/Success';

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute';

// Dashboard Components
import StudentDashboard from './components/dashboard/student/StudentDashboard';
import FacultyDashboard from './components/dashboard/faculty/FacultyDashboard';

// Quiz Components
import StartQuiz from './components/quiz/StartQuiz';
import QuizPlayer from './components/quiz/QuizPlayer';
import ResultView from './components/quiz/ResultView';
import ResultFeedbackPage from './components/quiz/ResultFeedbackPage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/faculty/login" element={<FacultyLogin />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/faculty/signup" element={<FacultySignup />} />
        <Route path="/authenticate" element={<EmailAuth />} />
        <Route path="/success" element={<Success />} />
        <Route path="/student" element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/faculty/*" element={
          <ProtectedRoute>
            <FacultyDashboard />
          </ProtectedRoute>
        } />
        <Route path="/quiz/subject/:subject/start" element={<StartQuiz />} />
        <Route path="/quiz/subject/:subject/take" element={<QuizPlayer />} />
        <Route path="/quiz/:subject/result/:resultId" element={<ResultView />} />
        <Route path="/result/:resultId/feedback" element={<ResultFeedbackPage />} />
      </Routes>
    </Router>
  );
}

export default App;