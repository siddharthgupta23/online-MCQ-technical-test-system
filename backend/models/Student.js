/* import { Schema, model } from 'mongoose';

const StudentSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  course: { type: String, required: true },
  role: { type: String, default: 'student' }
}, { timestamps: true });

export default model('Student', StudentSchema); */

// models/Student.js
// import mongoose from "mongoose";

// const StudentSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
//   subject: String, // 👈 add this if not already there (e.g. "DBMS", "Operating Systems", etc.)
//   class: String    // optional, e.g. "BCA 3rd Year"
// });

// export default mongoose.model("Student", StudentSchema);
import { Schema, model } from 'mongoose';

const StudentSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  course: { type: String, required: true },
  subject: { type: String, required: true }, // 👈 NEW FIELD
  role: { type: String, default: 'student' }
}, { timestamps: true });

export default model('Student', StudentSchema);

