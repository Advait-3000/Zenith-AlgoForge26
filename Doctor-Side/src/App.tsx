import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './store';
import Sidebar from './layouts/Sidebar';
import Navbar from './layouts/Navbar';

// Lazy load pages for better performance
const Login = lazy(() => import('./features/auth/Login'));
const Signup = lazy(() => import('./features/auth/Signup'));
const ProfileSetup = lazy(() => import('./features/doctor/ProfileSetup'));
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const Appointments = lazy(() => import('./features/appointments/Appointments'));
const Patients= lazy(() => import('./features/patients/Patients'));
const Prescriptions = lazy(() => import('./features/prescriptions/Prescriptions'));
const Analytics = lazy(() => import('./features/dashboard/Analytics'));

const ProtectedLayout: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
  const { isAuthenticated, hasProfile } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // If no profile, and not already on setup page, redirect to setup
  if (!hasProfile && window.location.pathname !== '/profile-setup') {
    return <Navigate to="/profile-setup" replace />;
  }

  return (
    <div className="flex h-screen bg-[#f7f9fb] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-60 transition-all duration-300">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <Suspense fallback={<LoadingUI />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

const LoadingUI = () => (
  <div className="flex flex-col items-center justify-center h-full w-full bg-slate-50 relative overflow-hidden">
     <div className="w-16 h-16 border-4 border-slate-100 border-t-primary-500 rounded-full animate-spin"></div>
     <p className="mt-6 text-sm font-black text-slate-300 uppercase tracking-widest animate-pulse">Cura Intelligence Loading...</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Suspense fallback={<LoadingUI />}><Login /></Suspense>} />
      <Route path="/signup" element={<Suspense fallback={<LoadingUI />}><Signup /></Suspense>} />

      {/* Profile Setup - Forced for first-time, accessible via Settings later */}
      <Route
        path="/profile-setup"
        element={
          <ProtectedLayout title="Profile Setup">
            <ProfileSetup />
          </ProtectedLayout>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout title="Welcome Back, Doctor">
            <DashboardPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedLayout title="Manage Appointments">
            <Appointments />
          </ProtectedLayout>
        }
      />
      <Route
        path="/patients"
        element={
          <ProtectedLayout title="Patient Database">
            <Patients />
          </ProtectedLayout>
        }
      />
      <Route
        path="/prescriptions"
        element={
          <ProtectedLayout title="Issue Prescriptions">
            <Prescriptions />
          </ProtectedLayout>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedLayout title="Performance Analytics">
            <Analytics />
          </ProtectedLayout>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<div className="flex items-center justify-center h-screen">404 - Not Found</div>} />
    </Routes>
  );
};

export default App;
