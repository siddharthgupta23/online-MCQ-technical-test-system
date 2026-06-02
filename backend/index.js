
// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";


// dotenv.config();

// const app = express();


// app.use(cors()); 
// app.use(express.json());


// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Atlas connected successfully"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));


// app.get("/", (req, res) => {
//   res.send("Backend server is running 🚀");
// });


// const PORT = process.env.PORT;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


// import express, { json } from 'express';
// import { connect } from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import quizRoutes from './routes/quizzes.js';
// import notifRoutes from './routes/notifications.js';
// import resultRoutes from './routes/results.js';

// dotenv.config();

// const app = express();
// app.use(json());
// app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

// import authRoutes from "./routes/auth.js";
// import facultyRoutes from "./routes/faculty.js";

// app.use('/api', authRoutes);
// app.use('/api/faculty', facultyRoutes);

// app.use('/api/quizzes', quizRoutes);
// app.use('/api/notifications', notifRoutes);
// app.use('/api/results', resultRoutes);

// const PORT = process.env.PORT;

// connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('MongoDB connected');
//     app.listen(PORT, () => console.log('Server running on port', PORT));
//   })
//   .catch(err => {
//     console.error('MongoDB connection error', err);
//   });

// app.get('/', (req, res) => {
//   res.send('Server is running successfully');
// });


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import facultyRoutes from "./routes/faculty.js";
import quizRoutes from "./routes/quizzes.js";
import notifRoutes from "./routes/notifications.js";
import resultRoutes from "./routes/results.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

app.use("/api", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/notifications", notifRoutes);
app.use("/api/results", resultRoutes);

app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });