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
      const res = await axios.get(`http://localhost:3023/api/quizzes/subject/${subject}`, { headers: { Authorization: `Bearer ${token}` }});
      setQuiz(res.data);
    }
    load();
  }, [subject]);

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className="d-flex justify-content-center mt-3 mt-md-5 px-3">
      <Card className="start-quiz-card p-3 p-md-4 w-100" style={{ maxWidth: '800px' }}>
        <h4 className="mb-3">{quiz.title}</h4>
        <p className="mb-4">{quiz.description}</p>
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
          <div>
            <div className="mb-2"><strong>Subject:</strong> {quiz.subject}</div>
            <div className="mb-2"><strong>Questions:</strong> {quiz.questions.length}</div>
            <div><strong>Duration:</strong> {quiz.durationMinutes ? `${quiz.durationMinutes} min` : (quiz.perQuestionSeconds ? `${quiz.perQuestionSeconds} sec per question` : '—')}</div>
          </div>
          <div className="align-self-start align-self-md-end">
            <Button 
              onClick={() => navigate(`/quiz/subject/${subject}/take`)} 
              variant="primary"
              className="w-100 w-md-auto"
            >
              Start Quiz
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
