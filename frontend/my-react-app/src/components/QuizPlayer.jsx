/*import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Button, ProgressBar } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

export default function QuizPlayer() {
  const { subject } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // {questionId, chosenIndex}
  const [timeLeft, setTimeLeft] = useState(null); // seconds left for question or total
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const startTimeRef = useRef(null);/*

//   useEffect(() => {
//     async function load() {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`http://localhost:3023/api/quizzes/subject/${subject}/start`, { headers: { Authorization: `Bearer ${token}` }});
//       setQuiz(res.data.quiz);
//       // decide initial timeLeft: prefer total duration, else per-question
//       const totalSeconds = res.data.quiz.durationMinutes ? res.data.quiz.durationMinutes * 60 : null;
//       const perQ = res.data.perQuestionSeconds || res.data.quiz.perQuestionSeconds || null;
//       if (totalSeconds) setTimeLeft(totalSeconds);
//       else setTimeLeft(perQ || 60);
//       // go fullscreen
//       openFullscreen();
//       startTimeRef.current = Date.now();
//     }
//     load();
//     return () => { exitFullscreen(); };
//     // eslint-disable-next-line
//   }, [subject]);

useEffect(() => {
  async function load() {
    const token = localStorage.getItem('token');
    const res = await axios.get(`http://localhost:3023/api/quizzes/subject/${subject}/start`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setQuiz(res.data.quiz);

    const totalSeconds = res.data.quiz.durationMinutes ? res.data.quiz.durationMinutes * 60 : null;
    const perQ = res.data.perQuestionSeconds || res.data.quiz.perQuestionSeconds || null;
    setTimeLeft(totalSeconds || perQ || 60);

    // go fullscreen
    openFullscreen();
    startTimeRef.current = Date.now();
  }

  load();

  // cleanup safely on unmount
  return () => {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      exitFullscreen();
    }
  };
}, [subject]);

  useEffect(() => {
    if (timeLeft === null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          // auto next or submit
          handleNextOrSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [timeLeft, index]);

  function openFullscreen() {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  }
  function exitFullscreen() {
    // if (document.exitFullscreen) document.exitFullscreen();
    // else if (document.webkitExitFullscreen) document.webkitExitFullscreen();

     if (document.fullscreenElement || document.webkitFullscreenElement) {
    try {
      if (document.exitFullscreen) return document.exitFullscreen();
      if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
    } catch (err) {
      console.warn('Exit fullscreen failed:', err);
    }
  }
  }

//    function chooseOption(qId, optIdx) {
//      setAnswers(prev => {
//        const copy = [...prev];
//        const found = copy.find(a => a.questionId === qId);
//        if (found) found.chosenIndex = optIdx;
//        else copy.push({ questionId: qId, chosenIndex: optIdx });
//        return copy;
//      });
//    }

   function chooseOption(qId, optIdx, index) {
   setAnswers(prev => {
     const copy = [...prev];
     const found = copy.find(a => a.index === index);
     if (found) found.chosenIndex = optIdx;
     else copy.push({ questionId: qId || null, index, chosenIndex: optIdx });     return copy;
   });
 }

  function handleNextOrSubmit() {
    // if using per-question timer, move to next and reset timer to perQ
    if (!quiz) return;
    const perQ = quiz.perQuestionSeconds || 60;
    if (index < quiz.questions.length - 1) {
      setIndex(i => i + 1);
      setTimeLeft(perQ);
    } else {
      // submit
      submitQuiz();
    }
  }

  async function submitQuiz() {
    const durationSeconds = Math.floor((Date.now() - startTimeRef.current)/1000);
    const payload = {
      subject: quiz.subject,
      answers,
      durationSeconds
    };
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:3023/api/results', payload, { headers: { Authorization: `Bearer ${token}` }});
    console.log(token);
    exitFullscreen();
    navigate(`/quiz/${quiz.subject}/result/${res.data.result._id}`); // show result page
  }

  if (!quiz) return <div>Loading...</div>;
  const q = quiz.questions[index];
  const total = quiz.questions.length;
  const progress = Math.round(((index)/total)*100);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-2">
        <div>Question {index+1}/{total}</div>
        <div>{Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</div>
      </div>
      <ProgressBar now={progress} className="mb-3" />
      <div className="card p-4">
        <h5>{q.text}</h5>
        <div className="mt-3">
          {/* {q.options.map((opt, i) => (
            <div key={i} className={`option p-2 mb-2 border ${answers.find(a=>a.questionId===q._id && a.chosenIndex===i) ? 'border-primary' : 'border-light'}`} onClick={()=>chooseOption(q._id, i,index)}>
              {opt}
            </div>
          ))} }

          {q.options.map((opt, i) => {
  const isSelected = answers.find(a => a.index === index && a.chosenIndex === i);
  return (
    <div
      key={i}
      className={`option p-2 mb-2 border rounded ${isSelected ? 'border-primary bg-light' : 'border-light'}`}
      onClick={() => chooseOption(null, i, index)}
      style={{ cursor: 'pointer' }}
    >
      {opt}
    </div>
  );
})}
        </div>

        <div className="d-flex justify-content-between mt-4">
          <Button variant="secondary" disabled={index===0} onClick={()=>{ setIndex(i=>i-1); setTimeLeft(quiz.perQuestionSeconds || 60); }}>Previous</Button>
          <div>
            <Button variant="danger" className="me-2" onClick={() => { exitFullscreen(); navigate('/student'); }}>Quit</Button>
            <Button variant="primary" onClick={handleNextOrSubmit}>{index < total-1 ? 'Next' : 'Submit'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}*/



// src/components/QuizPlayer.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Button, ProgressBar, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

export default function QuizPlayer() {
  const { subject } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // {index, chosenIndex, questionId}
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const startTimeRef = useRef(null);
  const infractionsRef = useRef(0);
  const [locked, setLocked] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const INFRACTION_THRESHOLD = 1;

  // useEffect(() => {
  //   async function load() {
  //     const token = localStorage.getItem('token');
  //     const res = await axios.get(`http://localhost:3023/api/quizzes/subject/${encodeURIComponent(subject)}/start`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setQuiz(res.data.quiz);
  //     const totalSeconds = res.data.quiz.durationMinutes ? res.data.quiz.durationMinutes * 60 : null;
  //     const perQ = res.data.perQuestionSeconds || res.data.quiz.perQuestionSeconds || null;
  //     setTimeLeft(totalSeconds || perQ || 60);
  //     openFullscreen();
  //     startTimeRef.current = Date.now();
  //   }
  //   load();

  //   // register visibility / blur / unload handlers
  //   const handleVisibility = () => {
  //     if (document.hidden) {
  //       reportInfraction('visibility', 'document.hidden became true');
  //     } else {
  //       // regained focus
  //     }
  //   };
  //   const handleBlur = () => reportInfraction('blur', 'window blur event');
  //   const handleFocus = () => {
  //     // optional: track regained focus
  //   };
  //   const handleBeforeUnload = (e) => {
  //     // Try to record an infraction and optionally show confirm
  //     reportInfraction('beforeunload', 'page unload or refresh');
  //     // standard confirm (some browsers ignore custom message)
  //     e.preventDefault();
  //     e.returnValue = '';
  //   };

  //   document.addEventListener('visibilitychange', handleVisibility);
  //   window.addEventListener('blur', handleBlur);
  //   window.addEventListener('focus', handleFocus);
  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     clearInterval(timerRef.current);
  //     document.removeEventListener('visibilitychange', handleVisibility);
  //     window.removeEventListener('blur', handleBlur);
  //     window.removeEventListener('focus', handleFocus);
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //     try { exitFullscreen(); } catch (e) {}
  //   };
  //   // eslint-disable-next-line
  // }, [subject]);

  // useEffect(() => {
  //   if (timeLeft === null || locked) return;
  //   timerRef.current = setInterval(() => {
  //     setTimeLeft(t => {
  //       if (t <= 1) {
  //         clearInterval(timerRef.current);
  //         handleNextOrSubmit();
  //         return 0;
  //       }
  //       return t - 1;
  //     });
  //   }, 1000);
  //   return () => clearInterval(timerRef.current);
  //   // eslint-disable-next-line
  // }, [timeLeft, index, locked]);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3023/api/quizzes/subject/${encodeURIComponent(subject)}/start`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuiz(res.data.quiz);
      const totalSeconds = res.data.quiz.durationMinutes ? res.data.quiz.durationMinutes * 60 : null;
      const perQ = res.data.perQuestionSeconds || res.data.quiz.perQuestionSeconds || null;
      setTimeLeft(totalSeconds || perQ || 60);
      openFullscreen();
      startTimeRef.current = Date.now();
    }
    load();

    const handleVisibility = () => {
      if (document.hidden) reportInfraction('visibility', 'document.hidden true');
    };
    const handleBlur = () => reportInfraction('blur', 'window blur');
    const handleBeforeUnload = (e) => {
      reportInfraction('beforeunload', 'page unload or refresh');
      e.preventDefault();
      e.returnValue = '';
    };

    // ✅ Detect exiting fullscreen (ESC or minimize)
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        reportInfraction('fullscreen-exit', 'Exited fullscreen (ESC/minimize)');
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      try { exitFullscreen(); } catch (e) { }
    };
    // eslint-disable-next-line
  }, [subject]);

  useEffect(() => {
    if (timeLeft === null || locked) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleNextOrSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    //   // eslint-disable-next-line
  }, [timeLeft, index, locked]);


  function openFullscreen() {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  }
  function exitFullscreen() {
    if (document.exitFullscreen) return document.exitFullscreen();
    if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
  }

  // async function reportInfraction(type = 'visibility', details = '') {
  //   try {
  //     // Do optimistic local lock and count
  //     infractionsRef.current = (infractionsRef.current || 0) + 1;

  //     // show overlay briefly if infractions > 0 (optional)
  //     if (infractionsRef.current > 0) {
  //       setShowOverlay(true);
  //       setTimeout(() => {
  //         // only hide overlay if not locked
  //         if (!locked) setShowOverlay(false);
  //       }, 2500);
  //     }

  //     const token = localStorage.getItem('token');
  //     await axios.post('http://localhost:3023/api/results/infraction', {
  //       quizIdOrSubject: quiz?.subject || subject,
  //       type,
  //       details
  //     }, { headers: { Authorization: `Bearer ${token}` }});

  //     // check server-side state (you could return infractions/locked from server)
  //     // We'll get infractions/locked by fetching result or based on threshold here
  //     if (infractionsRef.current >= INFRACTION_THRESHOLD) {
  //       // lock locally and force submit
  //       setLocked(true);
  //       setShowOverlay(true);
  //       // auto-submit
  //       await submitQuiz(true); // pass flag that we're auto-submitting due to lock
  //     }
  //   } catch (err) {
  //     console.error('Failed to report infraction', err);
  //   }
  // }

  async function reportInfraction(type = 'visibility', details = '') {
    try {
      // Increment infraction count immediately
      infractionsRef.current = (infractionsRef.current || 0) + 1;

      // Show overlay immediately
      setShowOverlay(true);

      // 🚨 IMMEDIATE LOCK before async request
      if (infractionsRef.current >= INFRACTION_THRESHOLD) {
        setLocked(true);
        await submitQuiz(true);
        return; // Stop here so quiz halts immediately
      }

      // Make async request (non-blocking)
      const token = localStorage.getItem('token');
      axios.post(
        'http://localhost:3023/api/results/infraction',
        {
          quizIdOrSubject: quiz?.subject || subject,
          type,
          details,
          timestamp: new Date().toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(err => console.warn('Infraction log failed', err));

      // Hide overlay after short delay (if not locked)
      setTimeout(() => {
        if (!locked) setShowOverlay(false);
      }, 2500);
    } catch (err) {
      console.error('Failed to report infraction', err);
    }
  }


  function chooseOption(qId, optIdx, qIndex) {
    if (locked) return;
    setAnswers(prev => {
      const copy = [...prev];
      const found = copy.find(a => a.index === qIndex);
      if (found) found.chosenIndex = optIdx;
      else copy.push({ questionId: qId || null, index: qIndex, chosenIndex: optIdx });
      return copy;
    });
  }

  function handleNextOrSubmit() {
    if (!quiz || locked) return;
    const perQ = quiz.perQuestionSeconds || 60;
    if (index < quiz.questions.length - 1) {
      setIndex(i => i + 1);
      setTimeLeft(perQ);
    } else {
      submitQuiz();
    }
  }

  async function submitQuiz(isAuto = false) {
    try {
      const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const payload = {
        subject: quiz.subject,
        answers,
        durationSeconds,
        autoSubmitted: !!isAuto,
        infractions: infractionsRef.current || 0
      };
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3023/api/results', payload, { headers: { Authorization: `Bearer ${token}` } });
      exitFullscreen();
      navigate(`/quiz/${quiz.subject}/result/${res.data.result._id}`);
    } catch (err) {
      console.error('Error submitting quiz', err);
      // if locked, still navigate to result page or show message
      if (locked) {
        // attempt to fetch latest result ID if server provided none
        navigate('/student');
      }
    }
  }

  if (!quiz) return <div>Loading...</div>;
  if (locked) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh', padding: 30 }}>
        <div>
          <h4>Quiz locked due to repeated tab switching</h4>
          <p>You exceeded the allowed number of tab switches. Contact your instructor.</p>
          <Button onClick={() => navigate('/student')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const q = quiz.questions[index];
  const total = quiz.questions.length;
  const progress = Math.round(((index) / total) * 100);

  return (
    <div className="container mt-4">

      <Modal show={showOverlay} centered backdrop="static">
        <Modal.Body className="text-center">
          <h5>Warning</h5>
          <p>Do not switch tabs or minimize. Repeated switches will lock the quiz.</p>
          <div>Infractions: {infractionsRef.current}/{INFRACTION_THRESHOLD}</div>
        </Modal.Body>
      </Modal>

      <div className="d-flex justify-content-between mb-2">
        <div>Question {index + 1}/{total}</div>
        <div>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>
      </div>
      <ProgressBar now={progress} className="mb-3" />
      <div className="card p-4">
        <h5>{q.text}</h5>
        <div className="mt-3">
          {q.options.map((opt, i) => {
            const isSelected = answers.find(a => a.index === index && a.chosenIndex === i);
            return (
              <div
                key={i}
                className={`option p-2 mb-2 border rounded ${isSelected ? 'border-primary bg-light' : 'border-light'}`}
                onClick={() => chooseOption(q._id, i, index)}
                style={{ cursor: 'pointer' }}
              >
                {opt}
              </div>
            );
          })}
        </div>

        <div className="d-flex justify-content-between mt-4">
          <Button variant="secondary" disabled={index === 0} onClick={() => { setIndex(i => i - 1); setTimeLeft(quiz.perQuestionSeconds || 60); }}>Previous</Button>
          <div>
            <Button variant="danger" className="me-2" onClick={() => { exitFullscreen(); navigate('/student'); }}>Quit</Button>
            <Button variant="primary" onClick={handleNextOrSubmit}>{index < total - 1 ? 'Next' : 'Submit'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

