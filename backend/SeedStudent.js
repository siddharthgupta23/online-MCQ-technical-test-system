
// import { connect } from 'mongoose';
// import { hash as _hash } from 'bcrypt';
// import Student from './models/Student.js';
// import dotenv from 'dotenv'

// dotenv.config();

// const studentsToGenerate = 20; // change as needed

// async function gen() {
//   await connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//   console.log('Connected for seeding');

//   // Clear existing students (optional)
//   // await Student.deleteMany({});

//   const students = [];
//   for (let i = 1; i <= studentsToGenerate; i++) {
//     const userId = `S${1000 + i}`; // S1001, S1002...
//     const rawPassword = `pass${i}`; // simple password for demo; in real use better scheme
//     const hash = await _hash(rawPassword, 10);
//     students.push({ name: `Student ${i}`, userId, password: hash, course: i % 2 === 0 ? 'MCA' : 'BTech' });
//   }

//   // insert without duplicates (upsert-like behavior)
//   for (const s of students) {
//     const exists = await Student.findOne({ userId: s.userId });
//     if (!exists) await Student.create(s);
//   }

//   console.log('Seeding complete. Sample credentials:');
//   students.slice(0, 5).forEach((s, idx) => console.log(`${s.userId} / pass${idx + 1}  (name: ${s.name})`));
//   process.exit(0);
// }

// gen().catch(err => { console.error(err); process.exit(1); });

import { connect } from 'mongoose';
import { hash as _hash } from 'bcrypt';
import Student from './models/Student.js';
import dotenv from 'dotenv';

dotenv.config();

const studentsToGenerate = 20;

async function gen() {
  await connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('✅ Connected to MongoDB for seeding');

  const subjects = ["Operating Systems", "DBMS", "Computer Networks"];
  const students = [];

  for (let i = 1; i <= studentsToGenerate; i++) {
    const userId = `S${1000 + i}`;
    const rawPassword = `pass${i}`;
    const hash = await _hash(rawPassword, 10);

    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];

    students.push({
      name: `Student ${i}`,
      userId,
      password: hash,
      course: i % 2 === 0 ? 'MCA' : 'BTech',
      subject: randomSubject // 👈 assign random subject
    });
  }

  // Insert without duplicates
  for (const s of students) {
    const exists = await Student.findOne({ userId: s.userId });
    if (!exists) await Student.create(s);
  }

  console.log('🎯 Seeding complete. Example students:');
  students.slice(0, 5).forEach((s, idx) =>
    console.log(`${s.userId} / pass${idx + 1}  (${s.subject}, ${s.course})`)
  );

  process.exit(0);
}

gen().catch(err => {
  console.error(err);
  process.exit(1);
});
