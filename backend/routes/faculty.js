import express from 'express';
import Student from '../models/Student.js';
import Quiz from '../models/Quiz.js';
import Result from '../models/Result.js';
import Notification from '../models/Notification.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

// Get all students
router.get('/students', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const students = await Student.find().select('-password').sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single student
router.get('/students/:id', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add student
router.post('/students', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { name, userId, password, course, subject } = req.body;
    if (!name || !userId || !password || !course || !subject) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const existing = await Student.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: 'User ID already exists' });
    }

    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await Student.create({
      name,
      userId,
      password: hashedPassword,
      course,
      subject
    });

    res.status(201).json({ message: 'Student added successfully', student: { ...student.toObject(), password: undefined } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student
router.put('/students/:id', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { name, userId, password, course, subject } = req.body;
    const updateData = { name, course, subject };

    if (userId) {
      const existing = await Student.findOne({ userId, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ message: 'User ID already exists' });
      }
      updateData.userId = userId;
    }

    if (password) {
      const bcrypt = await import('bcrypt');
      updateData.password = await bcrypt.hash(password, 10);
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student updated successfully', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete student
router.delete('/students/:id', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload students from Excel
router.post('/students/upload', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Dynamically import multer and xlsx
    let multer, xlsx;
    try {
      multer = (await import('multer')).default;
      xlsx = (await import('xlsx')).default;
    } catch (importErr) {
      return res.status(501).json({ message: 'File upload not configured. Please install multer and xlsx packages.' });
    }

    // Handle file upload
    const upload = multer({ dest: 'uploads/' });
    const uploadMiddleware = upload.single('file');

    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'File upload error: ' + err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      try {
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        const bcrypt = await import('bcrypt');
        const students = [];
        const errors = [];

        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          try {
            if (!row.name || !row.userId || !row.password || !row.course || !row.subject) {
              errors.push(`Row ${i + 2}: Missing required fields`);
              continue;
            }

            const existing = await Student.findOne({ userId: row.userId });
            if (existing) {
              errors.push(`Row ${i + 2}: User ID ${row.userId} already exists`);
              continue;
            }

            const hashedPassword = await bcrypt.hash(row.password, 10);
            const student = await Student.create({
              name: row.name,
              userId: row.userId,
              password: hashedPassword,
              course: row.course,
              subject: row.subject
            });
            students.push(student);
          } catch (err) {
            errors.push(`Row ${i + 2}: ${err.message}`);
          }
        }

        // Clean up uploaded file
        const fs = await import('fs');
        fs.unlinkSync(req.file.path);

        res.json({
          message: `Successfully added ${students.length} students`,
          added: students.length,
          errors: errors.length > 0 ? errors : undefined
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error: ' + err.message });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard stats
router.get('/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const totalStudents = await Student.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();

    const now = new Date();
    const activeQuizzes = await Quiz.countDocuments({
      startTime: { $lte: now },
      endTime: { $gte: now }
    });

    res.json({
      totalStudents,
      totalQuizzes,
      activeQuizzes
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/quizzes/activity", authMiddleware, async (req, res) => {
  try {
    const user = req.user; // from middleware
    if (!user || user.role !== "faculty") {
      return res.status(403).json({ message: "Access denied" });
    }

    const quizzes = await Quiz.find().sort({ createdAt: -1 }).lean();
    const now = new Date();

    const activity = await Promise.all(
      quizzes.map(async (quiz) => {
        const totalStudents = quiz.students?.length || 0;

        // ✅ Ensure consistent ObjectId comparison
        const results = await Result.find({ quiz: quiz._id });
        const attempted = results.length;

        let status = "Upcoming";
        if (quiz.startTime && quiz.endTime) {
          const start = new Date(quiz.startTime);
          const end = new Date(quiz.endTime);
          if (now >= start && now <= end) {
            status = "Ongoing";
          } else if (now > end) {
            status = "Completed";
          }
        }

        return {
          quizId: quiz._id,
          title: quiz.title,
          totalStudents,
          attempted,
          status,
        };
      })
    );

    res.json(activity);
  } catch (err) {
    console.error("Error in /quizzes/activity:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});





// router.get("/quizzes/activity", authMiddleware, async (req, res) => {
//   try {
//     // const user = req.user;
//     // if (!user || user.role !== "faculty") {
//     //   return res.status(403).json({ message: "Access denied" });
//     // }
//  if (req.role !== 'faculty') {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const quizzes = await Quiz.find().sort({ createdAt: -1 }).lean();
//     const now = new Date();

//     const activity = await Promise.all(
//       quizzes.map(async (quiz) => {
//         const totalStudents = quiz.students?.length || 0;

//         // ✅ Match Result by subject
//         const results = await Result.find({ subject: quiz.subject });
//         const attempted = results.length;

//         let status = "Upcoming";
//         if (quiz.startTime && quiz.endTime) {
//           const start = new Date(quiz.startTime);
//           const end = new Date(quiz.endTime);
//           if (now >= start && now <= end) {
//             status = "Ongoing";
//           } else if (now > end) {
//             status = "Completed";
//           }
//         }

//         return {
//           quizId: quiz.subject,
//           title: quiz.title,
//           totalStudents,
//           attempted,
//           status,
//         };
//       })
//     );

//     res.json(activity);
//   } catch (err) {
//     console.error("Error in /quizzes/activity:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });


// Get single quiz by ID
router.get('/quizzes/:id', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all quizzes for faculty
router.get('/quizzes', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const quizzes = await Quiz.find().sort({ createdAt: -1 }).lean();
    const now = new Date();

    const categorized = {
      overall: quizzes,
      active: [],
      upcoming: [],
      completed: []
    };

    for (const quiz of quizzes) {
      if (quiz.startTime && quiz.endTime) {
        const start = new Date(quiz.startTime);
        const end = new Date(quiz.endTime);
        if (now >= start && now <= end) {
          categorized.active.push(quiz);
        } else if (now < start) {
          categorized.upcoming.push(quiz);
        } else {
          categorized.completed.push(quiz);
        }
      } else {
        categorized.upcoming.push(quiz);
      }
    }

    res.json(categorized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quiz details with student results
// router.get('/quizzes/:id/details', authMiddleware, async (req, res) => {
//   try {
//    if (req.role !== 'faculty') {
//        return res.status(403).json({ message: 'Access denied' });
//      }

//     const quiz = await Quiz.findById(req.params.id);
//     if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

//     // Get all students assigned to this quiz
//     const studentIds = quiz.students || [];
//     const students = await Student.find({ _id: { $in: studentIds } }).select('name userId');

//     // Get results for this quiz
//     const results = await Result.find({ quiz: quiz._id}).populate('student', 'name userId');

//     // Create a map of student results
//     const resultMap = {};
//     results.forEach(result => {
//       resultMap[result.student._id.toString()] = {
//         score: result.score,
//         total: result.total,
//         percentage: result.percentage,
//         timeTaken: result.durationSeconds ? Math.floor(result.durationSeconds / 60) : null,
//         attemptedAt: result.attemptedAt
//       };
//     });

//     // Combine students with their results
//     const studentDetails = students.map(student => {
//       const result = resultMap[student._id.toString()];
//       return {
//         studentId: student.userId,
//         name: student.name,
//         status: result ? 'Attempted' : 'Not Attempted',
//         score: result ? `${result.percentage}%` : '-',
//         timeTaken: result && result.timeTaken ? `${result.timeTaken} min` : '-'
//       };
//     });

//     res.json({
//       quiz: {
//         title: quiz.title,
//         subject: quiz.subject,
//         totalMarks: quiz.questions ? quiz.questions.length : 0,
//         duration: quiz.durationMinutes || 0
//       },
//       students: studentDetails
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

router.get('/quizzes/:id/details', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const studentIds = quiz.students || [];
    const students = await Student.find({ _id: { $in: studentIds } }).select('name userId');

    // ✅ Fetch all results for this quiz by Quiz ID
    // const results = await Result.find({ quiz: quiz._id })
    //   .populate('student', 'name userId');
    const results = await Result.find({ subject: quiz.subject }).populate('student', 'name userId');


    // ✅ Map studentId to result
    const resultMap = {};
    results.forEach(r => {
      if (r.student) {
        resultMap[r.student._id.toString()] = {
          score: r.score,
          total: r.total,
          percentage: r.percentage,
          timeTaken: r.durationSeconds ? Math.floor(r.durationSeconds / 60) : null
        };
      }
    });

    // ✅ Merge
    const studentDetails = students.map(student => {
      const result = resultMap[student._id.toString()];
      return {
        studentId: student.userId,
        name: student.name,
        status: result ? 'Attempted' : 'Not Attempted',
        score: result ? `${result.percentage}%` : '-',
        timeTaken: result?.timeTaken ? `${result.timeTaken} min` : '-'
      };
    });

    res.json({
      quiz: {
        title: quiz.title,
        subject: quiz.subject,
        totalMarks: quiz.questions?.length || 0,
        duration: quiz.durationMinutes || 0
      },
      students: studentDetails
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get quiz activity
// router.get('/quizzes/activity', authMiddleware, async (req, res) => {
//   try {
//     if (req.role !== 'faculty') {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const quizzes = await Quiz.find().sort({ createdAt: -1 }).lean();
//     const now = new Date();

//     const activity = await Promise.all(quizzes.map(async (quiz) => {
//       const totalStudents = quiz.students ? quiz.students.length : 0;
//       const results = await Result.find({ quiz: quiz._id.toString() });
//       const attempted = results.length;

//       let status = 'Upcoming';
//       if (quiz.startTime && quiz.endTime) {
//         const start = new Date(quiz.startTime);
//         const end = new Date(quiz.endTime);
//         if (now >= start && now <= end) {
//           status = 'Ongoing';
//         } else if (now > end) {
//           status = 'Completed';
//         }
//       }

//       return {
//         quizId: quiz._id,
//         title: quiz.title,
//         totalStudents,
//         attempted,
//         status
//       };
//     }));

//     res.json(activity);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });



// Create quiz
router.post('/quizzes', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, subject, totalMarks, durationMinutes, startTime, endTime } = req.body;

    if (!title || !subject || !totalMarks || !durationMinutes) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find students for this subject
    const students = await Student.find({ subject });
    const studentIds = students.map(s => s._id);

    const quiz = await Quiz.create({
      title,
      subject,
      durationMinutes: parseInt(durationMinutes),
      startTime: startTime ? new Date(startTime) : null,
      endTime: endTime ? new Date(endTime) : null,
      createdBy: req.user.id,
      students: studentIds,
      questions: [] // Questions will be added separately
    });

    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add questions to quiz
router.post('/quizzes/:id/questions', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const { questions } = req.body;

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: 'Questions must be an array' });
    }

    // Process questions
    const processedQuestions = questions.map(q => {
      // If question is from manual entry
      if (q.text && q.options && q.correctAnswer && q.explanation) {
        const correctIndex = q.options.findIndex(opt => opt === q.correctAnswer);
        return {
          text: q.text,
          options: q.options,
          correctIndex: correctIndex >= 0 ? correctIndex : 0,
          explanation:q.explanation
          
        };
      }
      // If question is from Excel upload
      return q;
    });

    quiz.questions = [...(quiz.questions || []), ...processedQuestions];
    await quiz.save();

    res.json({ message: 'Questions added successfully', quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload quiz questions from Excel file
router.post('/quizzes/:id/questions/upload', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Dynamically import multer and xlsx
    let multer, xlsx;
    try {
      multer = (await import('multer')).default;
      xlsx = (await import('xlsx')).default;
    } catch (importErr) {
      return res.status(501).json({ message: 'File upload not configured. Please install multer and xlsx packages.' });
    }

    const upload = multer({ dest: 'uploads/' });
    const uploadMiddleware = upload.single('file');

    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'File upload error: ' + err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

      try {
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        const questions = data.map((row, i) => {
          const options = [row.Option1, row.Option2, row.Option3, row.Option4].filter(Boolean);
          const correctIndex = options.findIndex(opt => opt === row.CorrectAnswer);
          return {
            text: row.Question,
            options,
            correctIndex: correctIndex >= 0 ? correctIndex : 0,
            explanation: row.Explanation || ''
          };
        });

        quiz.questions = [...quiz.questions, ...questions];
        await quiz.save();

        const fs = await import('fs');
        fs.unlinkSync(req.file.path);

        res.json({
          message: `Successfully uploaded ${questions.length} questions`,
          total: questions.length,
          quiz
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error processing Excel file: ' + err.message });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});


// Send notification to all students
router.post('/notifications/send', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const students = await Student.find();
    const notifications = students.map(student => ({
      student: student._id,
      title: 'Quiz Notification',
      message: message
    }));

    await Notification.insertMany(notifications);

    res.json({ message: 'Notification sent to all students', count: notifications.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notifications (for faculty to see what they sent)
router.get('/notifications', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const notifications = await Notification.find()
      .populate('student', 'name userId')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

