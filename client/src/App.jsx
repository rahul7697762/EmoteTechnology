import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/Login';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/Signup';
import FacultyDashboard from './pages/FacultyDashboard';
import CreateCourse from './pages/CreateCourse';
import CoursePreview from './pages/CoursePreview';
import MyCourses from './pages/MyCourses';
import ProtectedRoute from './components/ProtectedRoute';
import StudentDashboard from './pages/StudentDashboard';
import StudentCourses from './pages/StudentCourses';
import StudentCertificates from './pages/StudentCertificates';
import StudentQuizzes from './pages/StudentQuizzes';
import SettingsPage from './pages/Settings';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
              <FacultyDashboard />
            </ProtectedRoute>
          } />

          <Route path="/my-courses" element={
            <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
              <MyCourses />
            </ProtectedRoute>
          } />

          <Route path="/create-course" element={
            <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
              <CreateCourse />
            </ProtectedRoute>
          } />

          <Route path="/course-preview" element={
            <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
              <CoursePreview />
            </ProtectedRoute>
          } />

          <Route path="/student-dashboard" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'FACULTY', 'ADMIN']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />

          <Route path="/student-courses" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'FACULTY', 'ADMIN']}>
              <StudentCourses />
            </ProtectedRoute>
          } />

          <Route path="/student-certificates" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'FACULTY', 'ADMIN']}>
              <StudentCertificates />
            </ProtectedRoute>
          } />

          <Route path="/student-quizzes" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'FACULTY', 'ADMIN']}>
              <StudentQuizzes />
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'FACULTY', 'ADMIN']}>
              <SettingsPage />
            </ProtectedRoute>
          } />

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
