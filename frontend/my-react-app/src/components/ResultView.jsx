/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Button, Card } from 'react-bootstrap';

export default function ResultView() {
  const { quizId, resultId } = useParams();
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    async function load() {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3023/api/results/${resultId}`, { headers: { Authorization: `Bearer ${token}` }});
      setResult(res.data);
    }
    load();
  }, [resultId]);

  if (!result) return <div>Loading...</div>;

  // const correct = result.answers.filter(a => a.chosenIndex === a.correctIndex).length;
  // const wrong = result.total - correct;
const answers = result.answers || [];
const correct = answers.filter(a => a.chosenIndex === a.correctIndex).length;
const wrong = (result.total || 0) - correct;

  const data = {
    labels: ['Correct','Wrong'],
    datasets: [{ label: 'Your Performance', data: [correct, wrong] }]
  };
    if (!result.quiz) {
  return (
    <div className="text-center mt-5">
      <h4>Quiz result for subject: {result.subject}</h4>
      <p>Your score has been recorded.</p>
      <Button onClick={() => navigate('/student')} variant="primary">
        Go to Dashboard
      </Button>
    </div>
  );
}

  return (
  
     <div className="d-flex justify-content-center mt-4">
       <Card style={{ width: 900 }} className="p-4">
         <h3>Your Quiz Results</h3>
         <div className="mb-3">Score: {result.score} / {result.total} — {result.percentage}%</div>

        <div style={{ maxWidth: 400 }}>
          <Bar data={data} />
        </div>
{/* 
         <div className="mt-4">
         {result.quiz.questions.map(q => { }
            const ans = result.answers.find(a => a.questionId.toString() === q._id.toString());
            const chosenIdx = ans?.chosenIndex;
             const correctIdx = ans?.correctIndex ?? q.correctIndex;
             const isCorrect = chosenIdx === correctIdx;
             return (
               <div key={q._id} className="card my-2 p-2">
                 <strong>{q.text}</strong>
                 <div className="mt-2">
                   <div><em>Your Answer:</em> {chosenIdx === null || chosenIdx === undefined ? <span className="text-muted">No attempt</span> : q.options[chosenIdx]}</div>
                  <div className="text-success"><em>Correct Answer:</em> {q.options[correctIdx]}</div>
                   <div className="mt-2 text-muted">{q.explanation}</div>
                 </div>
               </div>
             );
          })}
        </div> }
    <div className="mt-4">
  {(result.quiz?.questions || []).map((q, i) => {
    const ans = result.answers[i];
    const chosenIdx = ans?.chosenIndex;
    const correctIdx = ans?.correctIndex ?? q.correctIndex;
    const isCorrect = chosenIdx === correctIdx;
    return (
      <div key={q._id || i} className="card my-2 p-2">
        <strong>{q.text}</strong>
        <div className="mt-2">
          <div>
            <em>Your Answer:</em>{' '}
            {chosenIdx === null || chosenIdx === undefined
              ? <span className="text-muted">No attempt</span>
              : q.options[chosenIdx]}
          </div>
          <div className="text-success">
            <em>Correct Answer:</em> {q.options[correctIdx]}
          </div>
          {q.explanation && (
            <div className="mt-2 text-muted">{q.explanation}</div>
          )}
        </div>
      </div>
    );
  })}
</div>

        <div className="mt-3">
          <Button onClick={() => navigate('/student')} variant="primary">Go to Dashboard</Button>
        </div>
      </Card>
    </div>
  );
}*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Button, Card } from 'react-bootstrap';

export default function ResultView() {
  const { quizId, resultId } = useParams();
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:3023/api/results/${resultId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    }
    load();
  }, [resultId]);

  if (!result) return <div>Loading...</div>;

  const answers = result.answers || [];
  const correct = answers.filter(a => a.chosenIndex === a.correctIndex).length;
  const wrong = (result.total || 0) - correct;

  const data = {
    labels: ['Correct', 'Wrong'],
    datasets: [{ label: 'Your Performance', data: [correct, wrong] }]
  };

  // For quiz without quiz object (older results)
  if (!result.quiz) {
    return (
      <div className="text-center mt-5">
        <h4>Quiz result for subject: {result.subject}</h4>
        <p>Your score has been recorded.</p>

        {/* 🔴 Tab lock and infractions info */}
        <div className="mb-2">
          {result.locked && (
            <div className="alert alert-danger">
              This quiz was locked due to repeated tab switching — instructor has been notified.
            </div>
          )}
          <div className="small text-muted">
            Infractions: {result.infractions || 0}
          </div>
        </div>

        <Button onClick={() => navigate('/student')} variant="primary">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center mt-4">
      <Card style={{ width: 900 }} className="p-4">
        <h3>Your Quiz Results</h3>
        <div className="mb-3">
          Score: {result.score} / {result.total} — {result.percentage}%
        </div>

        {/* 🔴 Tab lock and infractions info */}
        <div className="mb-2">
          {result.locked && (
            <div className="alert alert-danger">
              This quiz was locked due to repeated tab switching — instructor has been notified.
            </div>
          )}
          <div className="small text-muted">
            Infractions: {result.infractions || 0}
          </div>
        </div>

        <div style={{ maxWidth: 400 }}>
          <Bar data={data} />
        </div>

        <div className="mt-4">
          {(result.quiz?.questions || []).map((q, i) => {
            const ans = result.answers[i];
            const chosenIdx = ans?.chosenIndex;
            const correctIdx = ans?.correctIndex ?? q.correctIndex;
            const isCorrect = chosenIdx === correctIdx;
            return (
              <div key={q._id || i} className="card my-2 p-2">
                <strong>{q.text}</strong>
                <div className="mt-2">
                  <div>
                    <em>Your Answer:</em>{' '}
                    {chosenIdx === null || chosenIdx === undefined ? (
                      <span className="text-muted">No attempt</span>
                    ) : (
                      q.options[chosenIdx]
                    )}
                  </div>
                  <div className="text-success">
                    <em>Correct Answer:</em> {q.options[correctIdx]}
                  </div>
                  {q.explanation && (
                    <div className="mt-2 text-muted">{q.explanation}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3">
          <Button onClick={() => navigate('/student')} variant="primary">
            Go to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}

