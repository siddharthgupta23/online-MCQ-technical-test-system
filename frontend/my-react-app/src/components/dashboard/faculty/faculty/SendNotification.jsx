import React, { useState } from 'react';
import axios from 'axios';
import '../../../../styles/faculty-dashboard.css';

const SendNotification = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('https://online-mcq-technical-test-system.vercel.app/api/faculty/notifications/send', {
        message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(`Notification sent to ${res.data.count} students!`);
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="faculty-page-header">
        <h1 className="faculty-page-title">Send Notification</h1>
        <p className="faculty-page-subtitle">Send Quiz Notification</p>
      </div>

      <div className="faculty-form-container">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Enter notification message</label>
            <textarea
              className="form-control"
              rows="6"
              placeholder="Enter notification message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendNotification;




