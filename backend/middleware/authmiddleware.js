// const jwt = require('jsonwebtoken');
// const Faculty = require('../models/Faculty').default;
// const Student = require('../models/Student').default;

// module.exports = function (req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'No token provided' });
//   }
//   const token = authHeader.split(' ')[1];
//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     // attach user info to request
//     req.user = { id: payload.id, role: payload.role };
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

// import { findById } from '../models/Faculty.js';
// import { findById as _findById } from '../models/Student.js';

// export default async function (req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   const token = authHeader.split(' ')[1];
//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     let user;
//     if (payload.role === 'faculty') {
//       user = await findById(payload.id);
//     } else if (payload.role === 'student') {
//       user = await _findById(payload.id);
//     }
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     req.user = user;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

// import jwt from 'jsonwebtoken';
// import Faculty from '../models/Faculty.js';
// import Student from '../models/Student.js';
// import dotenv from 'dotenv';
// dotenv.config();

// export default async function authMiddleware(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     let user;

//     if (payload.role === 'faculty') {
//       user = await Faculty.findById(payload.id).select('-password');
//     } else if (payload.role === 'student') {
//       user = await Student.findById(payload.id).select('-password');
//     }

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     req.user = { id: user._id, role: payload.role };
    
//     next();
//   } catch (err) {
//     console.error('Auth middleware error:', err);
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// }

import jwt from 'jsonwebtoken';
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';
import dotenv from 'dotenv';
dotenv.config();

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    let user;

    if (payload.role === 'faculty') {
      user = await Faculty.findById(payload.id).select('-password');
      if (!user) return res.status(404).json({ message: 'Faculty not found' });
      req.faculty = user;
      req.user = user; // ✅ keeps backward compatibility
    } else if (payload.role === 'student') {
      user = await Student.findById(payload.id).select('-password');
      if (!user) return res.status(404).json({ message: 'Student not found' });
      req.student = user;
      req.user = user; // ✅ makes /api/me still work
    }

    req.role = payload.role; // optional, but helpful for role-based logic
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
