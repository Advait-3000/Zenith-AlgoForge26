import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './features/auth/pages/AuthPage';
import { DoctorProfileSetup } from './features/doctor/pages/DoctorProfileSetup';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { ConsultationPage } from './features/prescriptions/pages/ConsultationPage';
import { ProfilePage } from './features/doctor/pages/ProfilePage';

import { PatientsPage } from './features/patients/pages/PatientsPage';

import { ForgotAccessPage } from './features/auth/pages/ForgotAccessPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/forgot-access" element={<ForgotAccessPage />} />
      <Route path="/setup" element={<DoctorProfileSetup />} />
      
      {/* Dashboard Protected Routes */}
      <Route path="/dashboard" element={<DashboardLayout children={<DashboardPage />} />} />
      <Route path="/consultation" element={<DashboardLayout children={<ConsultationPage />} />} />
      <Route path="/profile" element={<DashboardLayout children={<ProfilePage />} />} />
      <Route path="/patients" element={<DashboardLayout children={<PatientsPage />} />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
