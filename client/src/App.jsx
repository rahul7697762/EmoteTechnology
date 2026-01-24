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
import './App.css';
import {Toaster} from 'react-hot-toast'

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

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster/>
    </AuthProvider>
  );
}

export default App;
