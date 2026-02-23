// import express from 'express';
// import Result from '../models/Result.js';
// import authMiddleware from '../middleware/authmiddleware.js';
// import Quiz from "../models/Quiz.js";
// const router = express.Router();

// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     const { subject, answers, durationSeconds } = req.body;
//     const quiz = await Quiz.findOne(subject).lean();
//     if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

//     // grade
//     let score = 0;
//     const total = quiz.questions.length;
//     const answerDetails = [];

//     for (const q of quiz.questions) {
//       const ans = answers.find(a => a.questionId === q._id.toString());
//       const chosenIndex = ans ? ans.chosenIndex : null;
//       const correctIndex = q.correctIndex;
//       if (chosenIndex !== null && chosenIndex === correctIndex) score++;
//       answerDetails.push({ questionId: q._id, chosenIndex, correctIndex });
//     }

//     const percentage = Math.round((score / total) * 100);

//     // Save result (if student already has result for this quiz, optionally update)
//     let result = await Result.findOne({ student: req.student._id, quiz: quizId });
//     if (result) {
//       // update existing
//       result.score = score;
//       result.total = total;
//       result.percentage = percentage;
//       result.answers = answerDetails;
//       result.attemptedAt = new Date();
//       result.durationSeconds = durationSeconds;
//       await result.save();
//     } else {
//       result = new Result({
//        student: req.student._id,
//         quiz: subject,
//         score,
//         total,
//         percentage,
//         answers: answerDetails,
//         durationSeconds
//       });
//       await result.save();
//     }

//     res.json({ result, message: 'Submitted', score, total, percentage });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // get student's results
// router.get('/my', authMiddleware, async (req, res) => {
//   const results = await Result.find({ student: req.student._id }).populate('quiz').sort({ attemptedAt: -1 });
//   res.json(results);
// });

// // submit result (for quiz flow) - example (admin/quiz runner might submit)
// // router.post('/', authMiddleware, async (req, res) => {
// //   const { quizId, score, total } = req.body;
// //   const r = new Result({ student: req.student._id, quiz: quizId, score, total, attemptedAt: new Date() });
// //   await r.save();
// //   res.json(r);
// // });
// router.get('/:id', authMiddleware, async (req, res) => {
//   const result = await Result.findById(req.params.id).populate('quiz');
//   if (!result) return res.status(404).json({ message: 'Not found' });
//   if (result.student.toString() !== req.student._id.toString()) return res.status(403).json({ message: 'Forbidden' });
//   res.json(result);
// });


// export default router;

import express from 'express';
import Result from '../models/Result.js';
import authMiddleware from '../middleware/authmiddleware.js';
import Quiz from '../models/Quiz.js';

const router = express.Router();

// 📘 Submit quiz result
// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     const { subject, answers, durationSeconds } = req.body;

//     // ✅ Find quiz by subject
//     const quiz = await Quiz.findOne({ subject }).lean();
//     if (!quiz) {
//       return res.status(404).json({ message: `Quiz not found for subject: ${subject}` });
  
//     }

//     // ✅ Ensure questions array exists
//     if (!quiz.questions || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
//       return res.status(400).json({ message: 'Quiz has no questions defined.' });
//     }

//     // ✅ Grade answers
//     let score = 0;
//     const total = quiz.questions.length;
//     const answerDetails = [];

//     quiz.questions.forEach((q, index) => {
//       // Try matching by questionId or fallback to index
//       const ans =
//         answers.find(a => a.questionId === String(q._id)) ||
//         answers.find(a => a.index === index);

//       const chosenIndex = ans ? ans.chosenIndex : null;
//       const correctIndex = q.correctIndex ?? null;

//       if (chosenIndex !== null && chosenIndex === correctIndex) score++;
//       answerDetails.push({
//         questionId: q._id || null, // still store if available
//         index,
//         chosenIndex,
//         correctIndex
//       });
//     });

//     const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

//     // ✅ Check if result already exists for this student and quiz
//     let result = await Result.findOne({
//       student: req.student._id,
//       subject,
//     });

//     if (result) {
//       result.score = score;
//       result.total = total;
//       result.percentage = percentage;
//       result.answers = answerDetails;
//       result.durationSeconds = durationSeconds;
//       result.attemptedAt = new Date();
//       await result.save();
//     } else {
//       result = new Result({
//         student: req.student._id,
//         subject,
//         score,
//         total,
//         percentage,
//         answers: answerDetails,
//         durationSeconds
//       });
//       await result.save();
//     }

//     res.json({
//       message: 'Quiz submitted successfully',
//       result,
//       score,
//       total,
//       percentage
//     });
//   } catch (err) {
//     console.error('❌ Error submitting quiz:', err);
//     res.status(500).json({
//       message: 'Server error while submitting quiz',
//       error: err.message
//     });
//   }
// });


// In routes/results.js - your submit handler


router.post('/', authMiddleware, async (req, res) => {
  try {
    const { subject, answers, durationSeconds, infractions = 0, autoSubmitted = false } = req.body;
    const quiz = await Quiz.findOne({ subject }).lean();
    if (!quiz) return res.status(404).json({ message: 'Quiz not found for subject: ' + subject });

    // grade...
    let score = 0;
    const total = quiz.questions.length;
    const answerDetails = [];

    quiz.questions.forEach((q, index) => {
      const ans =
        (answers && answers.find(a => String(a.questionId) === String(q._id))) ||
        (answers && answers.find(a => a.index === index)) ||
        null;
      const chosenIndex = ans ? ans.chosenIndex : null;
      const correctIndex = q.correctIndex ?? null;
      if (chosenIndex !== null && chosenIndex === correctIndex) score++;
      answerDetails.push({ questionId: q._id || null, index, chosenIndex, correctIndex });
    });

    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    // find or create result
    let result = await Result.findOne({ student: req.student._id, subject });
    if (result) {
      Object.assign(result, {
        score, total, percentage, answers: answerDetails, durationSeconds,
        attemptedAt: new Date(), infractions: (result.infractions || 0) + infractions
      });
    } else {
      result = new Result({
        student: req.student._id,
        quiz: quiz._id?.toString() || subject,
        subject,
        score,
        total,
        percentage,
        answers: answerDetails,
        durationSeconds,
        infractions
      });
    }

    // lock if infractions exceeded threshold
    const THRESHOLD = parseInt(process.env.INFRACTION_THRESHOLD || 1);
    if ((result.infractions || 0) >= THRESHOLD) {
      result.locked = true;
    }

    await result.save();

    res.json({ message: 'Submitted', result, score, total, percentage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 📘 Get all results for student
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const results = await Result.find({ student: req.student._id })
      .populate('quiz')
      .sort({ attemptedAt: -1 });
    res.json(results);
  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({ message: 'Server error fetching results' });
  }
});

// 📘 Get specific result by ID
router.get('/results/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate('quiz');
    if (!result) return res.status(404).json({ message: 'Result not found' });
    if (result.student.toString() !== req.student._id.toString())
      return res.status(403).json({ message: 'Forbidden' });

    // res.json(result);

    let quiz = null;
    if (result.quiz) {
      // if stored as ObjectId and ref exists
      quiz = await Quiz.findOne(result.quiz).lean();
    }

    // If no quiz reference, attempt to find quiz by subject
    if (!quiz && result.subject) {
      quiz = await Quiz.findOne({ subject: result.subject }).lean();
    }

    // return result plus quiz (quiz may be null if not found)
    res.json({ result, quiz });
  } catch (err) {
    console.error('Error fetching result by ID:', err);
    res.status(500).json({ message: 'Server error fetching result', error: err.message });
  }
  // } catch (err) {
  //   console.error('Error fetching result by ID:', err);
  //   res.status(500).json({ message: 'Server error fetching result' });
  // }
});

router.get('/:id', authMiddleware, async (req, res) =>{
  
    const result = await Result.findById(req.params.id).populate('quiz');
    if (!result) return res.status(404).json({ message: 'Result not found' });
    if (result.student.toString() !== req.student._id.toString())
      return res.status(403).json({ message: 'Forbidden' });

   res.json(result);
});

router.post('/infraction', authMiddleware, async (req, res) => {
  try {
    const { quizIdOrSubject, type, details } = req.body;
    // Find existing result for this student and quiz (if you store quiz as ObjectId use quiz: quizId)
    // We allow both quiz id or subject string depending on your setup:
    let result = null;
    if (!quizIdOrSubject) return res.status(400).json({ message: 'quizIdOrSubject required' });

    // Try find by quiz ObjectId first
    result = await Result.findOne({ student: req.student._id, quiz: quizIdOrSubject })
      .catch(()=>null);

    // If not found, try by subject field (string)
    if (!result) {
      result = await Result.findOne({ student: req.student._id, subject: quizIdOrSubject });
    }

    // If still not found, optionally create a placeholder result to track infractions
    if (!result) {
      result = new Result({
        student: req.student._id,
        quiz: typeof quizIdOrSubject === 'string' ? quizIdOrSubject : undefined,
        subject: typeof quizIdOrSubject === 'string' ? quizIdOrSubject : undefined,
        score: 0,
        total: 0,
        percentage: 0,
        answers: [],
        infractions: 0,
        locked: false,
        infractionsLog: []
      });
    }

    // If already locked, respond accordingly
    if (result.locked) {
      await result.save();
      return res.json({ message: 'already locked', infractions: result.infractions, locked: true });
    }

    // increment
    result.infractions = (result.infractions || 0) + 1;
    result.infractionsLog = result.infractionsLog || [];
    result.infractionsLog.push({ type: type || 'visibility', details: details || '' });

    // Optionally lock when a threshold reached (define threshold here or read from env)
    const THRESHOLD = parseInt(process.env.INFRACTION_THRESHOLD || 1);
    if (result.infractions >= THRESHOLD) {
      result.locked = true;
    }

    await result.save();

    res.json({ message: 'infraction recorded', infractions: result.infractions, locked: result.locked });
  } catch (err) {
    console.error('Error recording infraction', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Export router if new file; if appending, already exported

export default router;

