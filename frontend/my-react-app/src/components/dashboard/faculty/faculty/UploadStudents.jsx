import React, { useState } from 'react';
import axios from 'axios';
import '../../../../styles/faculty-dashboard.css';

const UploadStudents = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post('http://localhost:3023/api/faculty/students/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage(`Successfully uploaded ${res.data.added} students`);
      if (res.data.errors && res.data.errors.length > 0) {
        setError(`Some errors occurred: ${res.data.errors.join(', ')}`);
      }
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="faculty-page-header">
        <h1 className="faculty-page-title">Upload Students (Excel)</h1>
      </div>

      <div className="faculty-form-container">
        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label className="form-label">Upload Excel File</label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="form-control"
              required
            />
            <small className="text-muted">
              Excel file should have columns: name, userId, password, course, subject
            </small>
          </div>

          <button 
            type="submit" 
            className="btn-primary w-100"
            disabled={uploading || !file}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadStudents;




