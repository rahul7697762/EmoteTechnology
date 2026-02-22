import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/Signup';
import FacultyDashboard from './pages/FacultyDashboard';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import ManageCourse from './pages/ManageCourse';
import CoursePreview from './pages/CoursePreview';
import MyCourses from './pages/MyCourses';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import StudentDashboard from './pages/StudentDashboard';
import StudentCourses from './pages/StudentCourses';
import StudentCourseView from './pages/StudentCourseView';
import StudentCertificates from './pages/StudentCertificates';
import StudentQuizzes from './pages/StudentQuizzes';
import SettingsPage from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Jobs from './pages/Jobs';
import AiInterview from './pages/AiInterview';
import './App.css';
import { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './redux/slices/authSlice';
import { useEffect } from 'react';
import CompanyDashboard from './pages/CompanyDashboard';
import CompanyProfilePage from './pages/CompanyProfilePage';
import CompanyPostJobPage from './pages/CompanyPostJobPage';
import CompanyApplicantsPage from './pages/CompanyApplicantsPage';
import CompanyJobDetailPage from './pages/CompanyJobDetailPage';
import CompanyOnboardingPage from './pages/CompanyOnboardingPage';
import CompanySettingsPage from './pages/CompanySettingsPage';
import StudentJobDashboard from './pages/StudentJobDashboard';
import StudentApplications from './pages/StudentApplications';
import ProfileCompletionPopup from './components/company-dashboard/ProfileCompletionPopup';

function App() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  // Sync theme to DOM on mount and changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<Jobs />} />
          <Route path="/ai-interview" element={<AiInterview />} />
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          } />

          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />
          <Route path="/verify-otp" element={
            <PublicRoute>
              <VerifyOTP />
            </PublicRoute>
          } />
          <Route path="/reset-password" element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          } />
          <Route path="/verify-email" element={<VerifyEmail />
          } />

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

          <Route path="/edit-course/:id" element={
            <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
              <EditCourse />
            </ProtectedRoute>
          } />
          <Route path="/manage-course/:courseId" element={
            <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
              <ManageCourse />
            </ProtectedRoute>
          } />

          <Route path="/preview/course/:id" element={
            <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
              <CoursePreview />
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
          } />          <Route path="/company/dashboard" element={
            <ProtectedRoute allowedRoles={['COMPANY', 'EMPLOYER', 'ADMIN']}>
              <CompanyDashboard />
            </ProtectedRoute>
          } />

          <Route path="/company/profile" element={
            <ProtectedRoute allowedRoles={['COMPANY', 'EMPLOYER', 'ADMIN']}>
              <CompanyProfilePage />
            </ProtectedRoute>
          } />

          <Route path="/company/post-job" element={
            <ProtectedRoute allowedRoles={['COMPANY', 'EMPLOYER', 'ADMIN']}>
              <CompanyPostJobPage />
            </ProtectedRoute>
          } />

          <Route path="/company/jobs/edit/:id" element={
            <ProtectedRoute allowedRoles={['COMPANY', 'EMPLOYER', 'ADMIN']}>
              <CompanyPostJobPage />
            </ProtectedRoute>
          } />

          <Route path="/company/jobs/:id" element={
            <ProtectedRoute allowedRoles={['COMPANY', 'EMPLOYER', 'ADMIN']}>
              <CompanyJobDetailPage />
            </ProtectedRoute>
          } />

          <Route path="/company/applicants" element={
            <ProtectedRoute allowedRoles={['COMPANY', 'EMPLOYER', 'ADMIN']}>
              <CompanyApplicantsPage />
            </ProtectedRoute>
          } />

          <Route path="/company/onboarding" element={
            <ProtectedRoute allowedRoles={['COMPANY', 'EMPLOYER', 'ADMIN']}>
              <CompanyOnboardingPage />
            </ProtectedRoute>
          } />

          <Route path="/company/settings" element={
            <ProtectedRoute allowedRoles={['COMPANY', 'EMPLOYER', 'ADMIN']}>
              <CompanySettingsPage />
            </ProtectedRoute>
          } />

          <Route path="/student-courses" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'FACULTY', 'ADMIN']}>
              <StudentCourses />
            </ProtectedRoute>
          } />

          <Route path="/course/:id/learn" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'FACULTY', 'ADMIN']}>
              <StudentCourseView />
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

          <Route path="/student/job-dashboard" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
              <StudentJobDashboard />
            </ProtectedRoute>
          } />

          <Route path="/student/applications" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
              <StudentApplications />
            </ProtectedRoute>
          } />

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </Router>
    </>
  );
}

export default App;
