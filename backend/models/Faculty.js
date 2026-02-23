import { Schema, model } from 'mongoose';

const FacultySchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'faculty' }
}, { timestamps: true });

export default model('Faculty', FacultySchema);