import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Card } from 'react-bootstrap';

export default function StartQuiz() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = React.useState(null);

  React.useEffect(() => {
    async function load() {
      const token = localStorage.getItem('token');
      const res = await axios.get(`https://online-mcq-technical-test-system.vercel.app/api/quizzes/subject/${subject}`, { headers: { Authorization: `Bearer ${token}` }});
      setQuiz(res.data);
    }
    load();
  }, [subject]);

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ width: 800 }} className="p-4">
        <h4>{quiz.title}</h4>
        <p>{quiz.description}</p>
        <div className="d-flex justify-content-between">
          <div>
            <div><strong>Subject:</strong> {quiz.subject}</div>
            <div><strong>Questions:</strong> {quiz.questions.length}</div>
            <div><strong>Duration:</strong> {quiz.durationMinutes ? `${quiz.durationMinutes} min` : (quiz.perQuestionSeconds ? `${quiz.perQuestionSeconds} sec per question` : '—')}</div>
          </div>
          <div className="align-self-end">
            <Button onClick={() => navigate(`/quiz/subject/${subject}/take`)} variant="primary">Start Quiz</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
