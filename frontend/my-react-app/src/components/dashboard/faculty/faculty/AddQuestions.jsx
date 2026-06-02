import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../../styles/faculty-dashboard.css';

const AddQuestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [manualQuestion, setManualQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation:''
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`https://online-mcq-technical-test-system.vercel.app/api/faculty/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuiz(res.data);
      setQuestions(res.data.questions || []);
    } catch (err) {
      console.error('Error fetching quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...manualQuestion.options];
    newOptions[index] = value;
    setManualQuestion({ ...manualQuestion, options: newOptions });
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!manualQuestion.text || manualQuestion.options.some(opt => !opt) || !manualQuestion.correctAnswer|| !manualQuestion.explanation) {
      setError('Please fill all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://online-mcq-technical-test-system.vercel.app/api/faculty/quizzes/${id}/questions`, {
        questions: [{
          text: manualQuestion.text,
          options: manualQuestion.options,
          correctAnswer: manualQuestion.correctAnswer,
          explanation:manualQuestion.explanation

        }]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Question added successfully!');
      setManualQuestion({ text: '', options: ['', '', '', ''], correctAnswer: '',explanation:'' });
      fetchQuiz();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding question');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `https://online-mcq-technical-test-system.vercel.app/api/faculty/quizzes/${id}/questions/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }

      );

      setSuccess('Questions uploaded successfully!');
      fetchQuiz(); // Refresh the question list
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.message || 'Error uploading file');
    }
    // setError('Excel upload feature requires additional setup. Please add questions manually.');
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div>
      <div className="faculty-page-header">
        <h1 className="faculty-page-title">Add Questions</h1>
        {quiz && (
          <div className="quiz-info-header">
            <p>Quiz title: {quiz.title}</p>
            <p>Subject: {quiz.subject}</p>
            <p>Total Marks: {quiz.questions?.length || 0}</p>
            <p>Duration: {quiz.durationMinutes} minutes</p>
          </div>
        )}
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="faculty-form-container">
            <h3>Add Question Manually</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleAddQuestion}>
              <div className="form-group">
                <label className="form-label">Enter question</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={manualQuestion.text}
                  onChange={(e) => setManualQuestion({ ...manualQuestion, text: e.target.value })}
                  required
                />
              </div>

              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="form-group">
                  <label className="form-label">Option {index + 1}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={manualQuestion.options[index]}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                  />
                </div>
              ))}

              <div className="form-group">
                <label className="form-label">Enter Correct answer</label>
                <input
                  type="text"
                  className="form-control"
                  value={manualQuestion.correctAnswer}
                  onChange={(e) => setManualQuestion({ ...manualQuestion, correctAnswer: e.target.value })}
                  placeholder="Enter the exact option text"
                  required
                />
              </div>

                <div className="form-group">
                <label className="form-label">Enter explanation</label>
                <textarea
                  className="form-control"
                  value={manualQuestion.explanation}
                  onChange={(e) => setManualQuestion({ ...manualQuestion, explanation: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-100">⊕ Add Question</button>
            </form>
          </div>
        </div>

        <div className="col-md-6">
          <div className="faculty-form-container">
            <h3>Upload Questions via Excel</h3>
            <div className="form-group">
              <label className="form-label">Choose file</label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="form-control"
              />
            </div>
          </div>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="faculty-table-container mt-4">
          <h3>Added Questions ({questions.length})</h3>
          <table className="faculty-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Options</th>
                <th>Correct Answer</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, idx) => (
                <tr key={idx}>
                  <td>{q.text}</td>
                  <td>{q.options?.join(', ')}</td>
                  <td>{q.options?.[q.correctIndex] || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AddQuestions;

