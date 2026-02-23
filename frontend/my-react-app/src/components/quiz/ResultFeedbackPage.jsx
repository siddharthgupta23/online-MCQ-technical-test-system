// src/components/ResultFeedbackPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner } from 'react-bootstrap';

export default function ResultFeedbackPage() {
  const { resultId } = useParams(); // route: /result/:resultId/feedback
  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState(null); // { result, quiz }
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:3023/api/results/results/${resultId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResultData(res.data); // { result, quiz }
      } catch (err) {
        console.error('Failed to load result:', err);
        setError(err.response?.data?.message || 'Failed to load result');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [resultId]);

  if (loading) {
    return (
      <div className="d-flex vh-100 align-items-center justify-content-center">
        <Spinner animation="border" /><span className="ms-2">Loading feedback...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
        <Button onClick={() => navigate('/student')}>Back to Dashboard</Button>
      </div>
    );
  }

  const { result, quiz } = resultData;
  // fallback: if quiz is not attached, we can't show questions; but we still show result summary
  if (!result) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">Result not found.</div>
        <Button onClick={() => navigate('/student')}>Back to Dashboard</Button>
      </div>
    );
  }

  // Determine question source: prefer quiz.questions; if missing, try read questions from result (if you stored) — otherwise we can't render each question
  const questions = (quiz && Array.isArray(quiz.questions)) ? quiz.questions : (result.questions || []);

  return (
    <div className="container my-3 my-md-4 px-3">
      <Button variant="secondary" onClick={() => navigate('/student')} className="mb-3">
        ← Back to Dashboard
      </Button>

      <Card className="p-3 p-md-4 result-feedback-card">
        <h3>Feedback — {result.subject || quiz?.subject || 'Quiz'}</h3>
        <div className="mb-2 text-muted">Score: {result.score} / {result.total} — {result.percentage}%</div>
        <div className="mb-4 text-muted">Attempted: {new Date(result.attemptedAt || result.createdAt).toLocaleString()}</div>

        {!questions || questions.length === 0 ? (
          <div className="alert alert-info">No question details available for this quiz.</div>
        ) : (
          <div>
            {questions.map((q, i) => {
              // result.answers is stored by index in your setup; try index match first
              const ans = Array.isArray(result.answers) ? result.answers[i] : null;
              const chosen = ans?.chosenIndex;
              const correct = ans?.correctIndex ?? q.correctIndex;
              const isCorrect = chosen !== null && chosen !== undefined && chosen === correct;

              return (
                <div key={q._id ? q._id : i} className="mb-3">
                  <Card className={`p-3 ${isCorrect ? 'border-success' : 'border-danger'}`}>
                    <div className="fw-bold mb-2">Q{i+1}. {q.text}</div>

                    <div>
                      {q.options && q.options.map((opt, idx) => {
                        const optClass = idx === correct
                          ? 'badge bg-success text-light me-2'
                          : (idx === chosen ? 'badge bg-warning text-dark me-2' : 'me-2');
                        return (
                          <div key={idx} className="d-flex align-items-center mb-1">
                            <div className={optClass} style={{ padding: '6px 10px', borderRadius: 6 }}>
                              {String.fromCharCode(65 + idx)}.
                            </div>
                            <div>{opt}</div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-2">
                      <strong>Your answer: </strong>
                      {chosen === null || chosen === undefined ? <span className="text-muted">No attempt</span> : <span>{q.options[chosen]}</span>}
                    </div>

                    <div className="mt-1">
                      <strong>Correct answer: </strong>
                      <span className="text-success">{q.options[correct]}</span>
                    </div>

                    {q.explanation && (
                      <div className="mt-2 text-muted">
                        <em>Explanation:</em> {q.explanation}
                      </div>
                    )}

                    <div className="mt-2">
                      {isCorrect ? (
                        <span className="badge bg-success">Correct ✓</span>
                      ) : (
                        <span className="badge bg-danger">Wrong ✗</span>
                      )}
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
