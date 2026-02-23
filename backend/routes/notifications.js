import express from 'express';
import Notification from '../models/Notification.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

// get notifications for logged-in student
router.get('/my', authMiddleware, async (req, res) => {
  const notes = await Notification.find({ student: req.student._id }).sort({ createdAt: -1 }).lean();
  res.json(notes);
});

// mark as read
router.post('/:id/read', authMiddleware, async (req, res) => {
  const n = await Notification.findOneAndUpdate({ _id: req.params.id, student: req.student._id }, { read: true }, { new: true });
  if (!n) return res.status(404).json({ message: 'Not found' });
  res.json(n);
});

export default router;
