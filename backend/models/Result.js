// import mongoose from 'mongoose';

// const ResultSchema = new mongoose.Schema({
//   student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
//   quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
//   score: Number,
//   total: Number,
//   attemptedAt: Date
// }, { timestamps: true });

// export default mongoose.model('Result', ResultSchema);

import mongoose from 'mongoose';
const AnswerSchema = new mongoose.Schema({
  questionId: mongoose.Schema.Types.ObjectId,
  chosenIndex: Number,
  correctIndex: Number
}, {_id: false});

const ResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
   // quiz: { type:String, ref: 'Quiz' },
   quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  score: Number,
  total: Number,
  subject:String,
  percentage: Number,
  answers: [AnswerSchema],
  attemptedAt: { type: Date, default: Date.now },
  durationSeconds: Number,
  infractions: { type: Number, default: 0 },
  locked: { type: Boolean, default: false },        // when true, student can't continue
  infractionsLog: [{
    at: { type: Date, default: Date.now },
    type: String,    // "visibility", "blur", "unload", etc.
    details: String
  }]
}, { timestamps: true });

export default mongoose.model('Result', ResultSchema);

