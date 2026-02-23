import express from 'express';
import Quiz from '../models/Quiz.js';
import authMiddleware from '../middleware/authmiddleware.js';
import Student from '../models/Student.js';
import shuffleArray from '../utils/shuffle.js';

const router = express.Router();

// get quizzes for current student, categorized
// router.get('/my', authMiddleware, async (req, res) => {
//   try {
//     // // find all quizzes assigned to this student
//     // const quizzes = await Quiz.find({ students: req.student._id }).sort({ startTime: 1 }).lean();
//     const quizzes = await Quiz.find().sort({ startTime: 1 }).lean();
//     const now = new Date();
//     const active = [], upcoming = [], completed = [];

//     for (const q of quizzes) {
//       if (q.startTime && q.endTime) {
//         if (now >= new Date(q.startTime) && now <= new Date(q.endTime)) active.push(q);
//         else if (now < new Date(q.startTime)) upcoming.push(q);
//         else completed.push(q);
//       } else {
//         upcoming.push(q);
//       }
//     }
//     res.json({ overall: quizzes, active, upcoming, completed });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });
// import Student from "../models/Student.js";

// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const { title, description, questions, startTime, endTime } = req.body;

//     // find all students
//     const allStudents = await Student.find({}, "_id");

//     const quiz = new Quiz({
//       title,
//       description,
//       questions,
//       startTime,
//       endTime,
//       students: allStudents.map(s => s._id) // assign all students automatically
//     });

//     await quiz.save();
//     res.status(201).json({ message: "Quiz created and assigned to all students", quiz });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, subject, startTime, endTime, questions, durationMinutes, perQuestionSeconds } = req.body;

    // ✅ Find students who study this subject
    const eligibleStudents = await Student.find({subject});

    const quiz = new Quiz({
      title,
      description,
      subject,
      startTime,
      endTime,
      durationMinutes,
      perQuestionSeconds,
      questions,
      createdBy: req.faculty._id, // assuming logged-in faculty
      students: eligibleStudents.map(s => s._id) // assign those students
    });

    await quiz.save();
    res.status(201).json({
      message: `Quiz created for ${eligibleStudents.length} students in subject ${subject}`,
      quiz
    });
  } catch (err) {
    console.error("Error creating quiz:", err);
    res.status(500).json({ message: "Server error while creating quiz" });
  }
});
router.get('/my', authMiddleware, async (req, res) => {
  try {
    // TEMP: show all quizzes
    const quizzes = await Quiz.find().sort({ startTime: 1 }).lean();

    const now = new Date();
    const active = [], upcoming = [], completed = [];

    for (const q of quizzes) {
      if (q.startTime && q.endTime) {
        if (now >= new Date(q.startTime) && now <= new Date(q.endTime)) active.push(q);
        else if (now < new Date(q.startTime)) upcoming.push(q);
        else completed.push(q);
      } else {
        upcoming.push(q);
      }
    }

    res.json({ overall: quizzes, active, upcoming, completed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// get a specific quiz (for starting)
router.get('/subject/:subject', authMiddleware, async (req, res) => {
 // const quiz = await Quiz.findById(req.params.id);

  const quiz = await Quiz.findOne({ subject: req.params.subject });
  if (!quiz) return res.status(404).json({ message: 'Not found' });
  // ensure student is assigned
  if (!quiz.students.map(s => s.toString()).includes(req.student._id.toString())) {
    return res.status(403).json({ message: 'Not assigned' });
  }
  res.json(quiz);
  console.log(quiz);

});
router.get('/subject/:subject/start', authMiddleware, async (req, res) => {
  // const quiz = await Quiz.findById(req.params.id).lean();

 const quiz = await Quiz.findOne({ subject: req.params.subject }).lean();
  if (!quiz) return res.status(404).json({ message: 'Not found' });
  quiz.questions = shuffleArray([...quiz.questions]);

  // You may check assignment and time windows here
  // return questions and timing info
  res.json({ quiz, perQuestionSeconds: quiz.perQuestionSeconds || null, durationMinutes: quiz.durationMinutes || null });
});

export default router;
