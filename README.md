# Online MCQ Technical System

A comprehensive online Multiple Choice Questions (MCQ) examination platform designed for technical assessments. This system enables faculty members to create and manage quizzes while allowing students to take exams in a secure, timed environment.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Key Features Explained](#key-features-explained)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Contributing](#contributing)

---

## 🎯 Overview

The Online MCQ Technical System is a full-stack web application that provides a platform for conducting online technical examinations. It supports two user roles:

1. **Faculty (Instructors)**: Create quizzes, manage students, monitor quiz activity, and view results
2. **Students**: Take quizzes, view results, and receive feedback

The system ensures security, fairness, and accurate assessment with features like timed quizzes, question shuffling, and comprehensive result analytics.

---

## ✨ Features

### Faculty Features
- **Quiz Management**: Create, edit, and delete quizzes with multiple choice questions
- **Student Management**: Add students individually or bulk upload via Excel files
- **Quiz Scheduling**: Set start and end times for quiz availability
- **Questions Management**: Add questions with options, correct answers, and explanations
- **Result Analysis**: View detailed result statistics and student performance
- **Dashboard Analytics**: Track quiz activity, student progress, and overall statistics
- **Notifications**: Send notifications to students about upcoming or ongoing quizzes
- **Quiz Status Monitoring**: View active, upcoming, and completed quizzes

### Student Features
- **Quiz Availability**: View available and upcoming quizzes
- **Quiz Participation**: Attempt quizzes within the scheduled time window
- **Timed Questions**: Answer questions within allocated time per question or overall quiz duration
- **Instant Feedback**: View results immediately after quiz completion
- **Answer Review**: Review submitted answers with explanations
- **Dashboard**: Track quiz history and performance statistics

### General Features
- **Authentication**: Secure login/signup with email validation
- **Role-Based Access Control**: Different views and features based on user role
- **Data Persistence**: All data stored in MongoDB
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **File Upload**: Support for Excel file uploads for bulk student registration

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt for hashing
- **File Handling**: Multer for file uploads
- **Data Processing**: XLSX for Excel file parsing
- **API Testing**: CORS enabled for cross-origin requests

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Bootstrap 5
- **HTTP Client**: Axios
- **Charts**: Chart.js with React wrapper (react-chartjs-2)
- **State Management**: React Hooks

### Development Tools
- **Backend**: Nodemon for hot reload
- **Linting**: ESLint
- **Version Control**: Git

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Auth (Login/Signup) | Faculty Dashboard | Quiz Player│   │
│  │ Student Dashboard   | Results & Analytics            │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬──────────────────────────────────────┘
                         │ HTTP/REST API
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Express.js)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Auth Routes | Faculty Routes | Quiz Routes           │   │
│  │ Results Routes | Notifications Routes                │   │
│  └──────────────────────────────────────────────────────┘   │
│                         ↓                                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Middleware: Authentication, Error Handling           │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬──────────────────────────────────────┘
                         │ Mongoose ODM
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  MongoDB Database                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Collections: Users, Quizzes, Results, Notifications  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **MongoDB** instance (local or cloud)
- **Git** for version control

### Clone the Repository

```bash
git clone <repository-url>
cd online-mcq-technical-system
```

---

## 📦 Installation & Setup

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file** with required environment variables:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:5173
   ```

4. **Seed initial data** (optional):
   ```bash
   npm run seed
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend/my-react-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Update API configuration** in `src/utils/api.jsx`:
   ```javascript
   const API_URL = 'http://localhost:5000/api';
   ```

---

## ⚙️ Configuration

### Environment Variables (.env)

**Backend**:
- `MONGO_URI`: MongoDB connection string
- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT token generation
- `FRONTEND_URL`: Frontend URL for CORS

**Frontend**:
- Configure API base URL in API utility files

---

## ▶️ Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Server will start on `http://localhost:5000`

### Start Frontend Application

```bash
cd frontend/my-react-app
npm run dev
```

Frontend will be available at `http://localhost:5173`

### Build for Production

**Backend**: No build step required (run directly)

**Frontend**:
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

### Backend Structure
```
backend/
├── index.js                 # Main server file
├── package.json            # Dependencies
├── .env                    # Environment variables
├── quizzes.json           # Sample quiz data
├── SeedStudent.js         # Database seeding script
├── middleware/
│   └── authmiddleware.js  # JWT authentication middleware
├── models/
│   ├── Faculty.js         # Faculty schema
│   ├── Student.js         # Student schema
│   ├── Quiz.js            # Quiz schema
│   ├── Result.js          # Quiz results schema
│   └── Notification.js    # Notification schema
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── faculty.js         # Faculty-specific routes
│   ├── quizzes.js         # Quiz management routes
│   ├── results.js         # Results routes
│   └── notifications.js   # Notification routes
├── uploads/               # File upload directory
└── utils/
    └── shuffle.js         # Question shuffling utility
```

### Frontend Structure
```
frontend/my-react-app/
├── package.json
├── vite.config.js         # Vite configuration
├── index.html             # HTML entry point
├── src/
│   ├── App.jsx            # Main App component
│   ├── App.css            # Global styles
│   ├── main.jsx           # React entry point
│   ├── components/
│   │   ├── auth/          # Login/Signup components
│   │   ├── common/        # Shared components (ProtectedRoute)
│   │   ├── dashboard/     # Dashboard components
│   │   │   ├── faculty/   # Faculty dashboard views
│   │   │   └── student/   # Student dashboard views
│   │   ├── quiz/          # Quiz-related components
│   │   └── api.jsx        # API utility functions
│   ├── styles/            # CSS stylesheets
│   ├── utils/
│   │   └── api.jsx        # API configuration
│   └── assets/            # Images and static assets
```

---

## 🎥 Key Features Explained

### 1. Quiz Creation & Management
- Faculty can create quizzes with custom titles, descriptions, and subjects
- Set specific start and end times for quiz availability
- Add multiple questions with four options each
- Mark correct answers and provide explanations

### 2. Student Management
- Add students individually through the dashboard
- Bulk upload students via Excel files (CSV/XLSX)
- Track student enrollment in quizzes

### 3. Quiz Execution
- Students see available quizzes based on scheduling
- Timed quiz execution with per-question or overall time limits
- Questions presented one at a time
- Submit answers with immediate feedback

### 4. Results & Analytics
- Automatic result calculation upon quiz completion
- View detailed answer explanations
- Faculty dashboard shows performance statistics
- Charts and graphs for visualization

### 5. Notifications
- Send notifications to students about quiz availability
- Push timely reminders for upcoming quizzes

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout

### Faculty Routes (`/api/faculty`)
- `GET /dashboard` - Faculty dashboard data
- `POST /add-student` - Add single student
- `POST /upload-students` - Bulk upload students
- `GET /students` - List all assigned students

### Quiz Routes (`/api/quizzes`)
- `POST /create` - Create new quiz
- `GET /` - Get all quizzes
- `GET /:id` - Get quiz details
- `PUT /:id` - Update quiz
- `DELETE /:id` - Delete quiz

### Results Routes (`/api/results`)
- `POST /submit` - Submit quiz answers
- `GET /:quizId` - Get quiz results
- `GET /user/:studentId` - Get student's results

### Notifications Routes (`/api/notifications`)
- `POST /send` - Send notification
- `GET /` - Get notifications
- `DELETE /:id` - Delete notification

---

## 💾 Database Models

### Faculty Schema
- Email, password, name, department, contact details
- Created quizzes reference, managed students reference

### Student Schema
- Email, password, name, admission number, department
- Enrolled quizzes reference, quiz results reference

### Quiz Schema
- Title, description, subject
- Start time, end time, duration settings
- Array of questions with options and correct answers
- Enrolled students, creation timestamp

### Result Schema
- Student reference, quiz reference
- User answers array, score, percentage
- Submission timestamp

### Notification Schema
- Message, recipient (student/faculty)
- Quiz reference, timestamp
- Read/unread status

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

---



---

## 📞 Support

For issues, questions, or suggestions, please contact the development team or open an issue in the repository.

---

## 🎓 Future Enhancements

- [ ] Real-time quiz monitoring for faculty
- [ ] Negative marking system
- [ ] Partial marking for subjective questions
- [ ] Question bank management
- [ ] Advanced analytics and reporting
- [ ] Mobile app development
- [ ] Proctoring features
- [ ] Integration with learning management systems

---

**Last Updated**: February 2026  
**Version**: 1.0.0
