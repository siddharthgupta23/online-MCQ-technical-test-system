// import mongoose from 'mongoose';

// const QuizSchema = new mongoose.Schema({
//   title: String,
//   subject:String,
//   description: String,
//   startTime: Date,
//   endTime: Date,
//   students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }] // assigned students
// }, { timestamps: true });

// export default mongoose.model('Quiz', QuizSchema);

import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  text: String,
  options: [String],
  correctIndex: Number,
  explanation: String
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  subject: String,
  startTime: Date,
  endTime: Date,
  durationMinutes: Number, // total duration for the quiz (optional)
  perQuestionSeconds: Number, // seconds per question (optional)
  questions: [QuestionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
}, { timestamps: true });

export default mongoose.model('Quiz', QuizSchema);

