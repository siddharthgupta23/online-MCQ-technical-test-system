import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/faculty-dashboard.css';

const LogoutConfirmation = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/faculty/overall');
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div>
      <div className="faculty-page-header">
        <h1 className="faculty-page-title">Logout</h1>
      </div>

      <div className="logout-modal">
        <h3>Are you sure you want to logout?</h3>
        <p>You will need to login again to access the dashboard.</p>
        <div className="logout-buttons">
          <button className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation;





