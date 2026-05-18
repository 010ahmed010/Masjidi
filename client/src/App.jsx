import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import HomePage from './pages/Public/HomePage';
import AttendancePage from './pages/Public/AttendancePage';
import ContactPage from './pages/Public/ContactPage';
import DeveloperPage from './pages/Public/DeveloperPage';
import LoginPage from './pages/LoginPage';

import AdminDashboard from './pages/Admin/AdminDashboard';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen dark:bg-[#0d1a10]"><div className="text-primary-600 text-xl">جاري التحميل...</div></div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/developer" element={<DeveloperPage />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/teacher'} /> : <LoginPage />} />
      <Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/teacher/*" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
    </Routes>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
