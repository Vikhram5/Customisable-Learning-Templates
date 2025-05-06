import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./components/LandingPage"
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import MCQForm from "./components/mcq-template/MCQForm";
import QuizGame from "./components/mcq-template/QuizGame";

import UploadImage from "./components/UploadImage";

import MatchTemplate from "./components/match-template/MatchTemplate";
import MatchUp from "./components/match-template/MatchUp";

import SentenceGame from "./components/sentence-builder/SentenceGame";
import ImageFetcher from "./components/sentence-builder/ImageFetcher";

import TeacherDashboard from './components/dashboard/TeacherDashboard';
import StudentDashboard from './components/dashboard/StudentDashboard';



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />

          {/* Student-restricted routes */}
          <Route path="/mcqform" element={<ProtectedRoute element={<MCQForm />} allowedRoles={["teacher"]} />} />
          <Route path="/matchform" element={<ProtectedRoute element={<MatchTemplate />} allowedRoles={["teacher"]} />} />
          <Route path="/sentence-template" element={<ProtectedRoute element={<ImageFetcher />} allowedRoles={["teacher"]} />} />
          <Route path="/add-images" element={<ProtectedRoute element={<UploadImage />} allowedRoles={["teacher"]} />} />

          <Route path="/mcq-template" element={<ProtectedRoute element={<QuizGame />} allowedRoles={["teacher", "student"]} />} />
          <Route path="/match-template" element={<ProtectedRoute element={<MatchUp />} allowedRoles={["teacher", "student"]} />} />
          <Route path="/sentence-game" element={<ProtectedRoute element={<SentenceGame />} allowedRoles={["teacher", "student"]} />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;