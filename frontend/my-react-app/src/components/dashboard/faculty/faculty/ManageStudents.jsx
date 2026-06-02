import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../../styles/faculty-dashboard.css';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', userId: '', email: '', course: '', subject: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://online-mcq-technical-test-system.vercel.app/api/faculty/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setEditForm({
      name: student.name,
      userId: student.userId,
      email: student.email || '',
      course: student.course,
      subject: student.subject
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://online-mcq-technical-test-system.vercel.app/api/faculty/students/${editingId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating student');
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to remove this student?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://online-mcq-technical-test-system.vercel.app/api/faculty/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Error removing student');
    }
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div>
      <div className="faculty-page-header">
        <h1 className="faculty-page-title">Manage Students</h1>
      </div>

      <div className="faculty-table-container">
        <table className="faculty-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                {editingId === student._id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.userId}
                        onChange={(e) => setEditForm({ ...editForm, userId: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        className="form-control"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn edit" onClick={handleSave}>Save</button>
                        <button className="action-btn" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{student.userId}</td>
                    <td>{student.name}</td>
                    <td>{student.email || `${student.userId}@student.com`}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn edit" onClick={() => handleEdit(student)}>✏️ Edit</button>
                        <button className="action-btn remove" onClick={() => handleRemove(student._id)}>🗑️ Remove</button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStudents;




