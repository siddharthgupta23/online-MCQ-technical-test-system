// import { Router } from 'express';
// const router = Router();
// import { hash as _hash, compare } from 'bcrypt';
// import { sign } from 'jsonwebtoken';
// import Faculty from '../models/Faculty.js';
// import Student from '../models/Faculty.js';

// // Faculty signup
// router.post('/faculty/signup', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

//     const existing = await Faculty.findOne({ email });
//     if (existing) return res.status(400).json({ message: 'Email already used' });

//     const hash = await _hash(password, 10);
//     const f = await Faculty.create({ name, email, password: hash });

//     const token = sign({ id: f._id, role: 'faculty' }, process.env.JWT_SECRET, { expiresIn: '8h' });
//     res.json({ token, role: 'faculty', name: f.name, email: f.email });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Faculty login
// router.post('/faculty/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

//     const user = await Faculty.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     const ok = await compare(password, user.password);
//     if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

//     const token = sign({ id: user._id, role: 'faculty' }, process.env.JWT_SECRET, { expiresIn: '8h' });
//     res.json({ token, role: 'faculty', name: user.name, email: user.email });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Student login (students are pre-seeded)
// router.post('/student/login', async (req, res) => {
//   try {
//     const { userId, password } = req.body;
//     if (!userId || !password) return res.status(400).json({ message: 'Missing fields' });

//     const student = await Student.findOne({ userId });
//     if (!student) return res.status(400).json({ message: 'Invalid credentials' });

//     const ok = await compare(password, student.password);
//     if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

//     const token = sign({ id: student._id, role: 'student', userId: student.userId }, process.env.JWT_SECRET, { expiresIn: '8h' });
//     res.json({ token, role: 'student', name: student.name, userId: student.userId });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Example protected profile route
// import authMiddleware from '../middleware/authmiddleware.js';
// router.get('/profile', authMiddleware, async (req, res) => {
//   try {
//     if (req.user.role === 'faculty') {
//       const f = await Faculty.findById(req.user.id).select('-password');
//       return res.json({ profile: f });
//     }
//     if (req.user.role === 'student') {
//       const s = await Student.findById(req.user.id).select('-password');
//       return res.json({ profile: s });
//     }
//     res.status(403).json({ message: 'Unknown role' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default router;

// import express from 'express';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import Faculty from '../models/Faculty.js';
// import Student from '../models/Student.js';
// import authMiddleware from '../middleware/authmiddleware.js';

// const router = express.Router();

// // Faculty signup
// router.post('/faculty/signup', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password)
//       return res.status(400).json({ message: 'Missing fields' });

//     const existing = await Faculty.findOne({ email });
//     if (existing)
//       return res.status(400).json({ message: 'Email already used' });

//     const hash = await bcrypt.hash(password, 10);
//     const f = await Faculty.create({ name, email, password: hash });

//     const token = jwt.sign(
//       { id: f._id, role: 'faculty' },
//       process.env.JWT_SECRET,
//       { expiresIn: '8h' }
//     );

//     res.json({ token, role: 'faculty', name: f.name, email: f.email });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Faculty login
// router.post('/faculty/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password)
//       return res.status(400).json({ message: 'Missing fields' });

//     const user = await Faculty.findOne({ email });
//     if (!user)
//       return res.status(400).json({ message: 'Invalid credentials' });

//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok)
//       return res.status(400).json({ message: 'Invalid credentials' });

//     const token = jwt.sign(
//       { id: user._id, role: 'faculty' },
//       process.env.JWT_SECRET,
//       { expiresIn: '8h' }
//     );

//     res.json({ token, role: 'faculty', name: user.name, email: user.email });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

// Helper: validate work email
function isWorkEmail(email) {
  // Only allow emails ending with `.work@gmail.com`
  return email.endsWith('.work@gmail.com');
}

// =====================
// FACULTY SIGNUP
// =====================
router.post('/faculty/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Missing fields' });

    // ✅ Validate work email
    if (!isWorkEmail(email))
      return res
        .status(400)
        .json({ message: 'Invalid email. Please use a work email' });

    const existing = await Faculty.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const f = await Faculty.create({ name, email, password: hash });

    const token = jwt.sign(
      { id: f._id, role: 'faculty' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, role: 'faculty', name: f.name, email: f.email });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// =====================
// FACULTY LOGIN
// =====================
router.post('/faculty/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Missing fields' });

    // ✅ Check work email
    if (!isWorkEmail(email))
      return res
        .status(400)
        .json({ message: 'Invalid email. Please use your work email' });

    const user = await Faculty.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: 'faculty' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, role: 'faculty', name: user.name, email: user.email });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Student login (students are pre-seeded)
// router.post('/student/login', async (req, res) => {
//   try {
//     const { userId, password } = req.body;
//     if (!userId || !password)
//       return res.status(400).json({ message: 'Missing fields' });

//     const student = await Student.findOne({ userId });
//     if (!student)
//       return res.status(400).json({ message: 'Invalid credentials' });

//     const ok = await bcrypt.compare(password, student.password);
//     if (!ok)
//       return res.status(400).json({ message: 'Invalid credentials' });

//     const token = jwt.sign(
//       { id: student._id, role: 'student', userId: student.userId },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.json({ token, role: 'student', name: student.name, userId: student.userId });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

router.post('/student/login', async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password)
      return res.status(400).json({ message: 'Missing fields' });

    const student = await Student.findOne({ userId });
    if (!student)
      return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, student.password);
    if (!ok)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: student._id, role: 'student', userId: student.userId },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // ✅ Return student object here
    res.json({
      token,
      student: {
        name: student.name,
        userId: student.userId,
        role: 'student',
        id: student._id,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Protected route
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'faculty') {
      const f = await Faculty.findById(req.user.id).select('-password');
      return res.json({ profile: f });
    }

    if (req.user.role === 'student') {
      const s = await Student.findById(req.user.id).select('-password');
      return res.json({ profile: s });
    }

    res.status(403).json({ message: 'Unknown role' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// router.get('/me', authMiddleware, (req, res) => {
//   res.json({ student: req.student });
// });
router.get('/me', authMiddleware, async (req, res) => {
  try {
    if (req.role === 'faculty') {
      const faculty = await Faculty.findById(req.user.id).select('-password');
      return res.json({ faculty });
    } else if (req.role === 'student') {
      const student = await Student.findById(req.user.id).select('-password');
      return res.json({ student });
    }
    res.status(403).json({ message: 'Unknown role' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
