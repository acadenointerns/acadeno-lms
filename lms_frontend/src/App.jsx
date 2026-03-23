import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import MfaPage from './pages/MfaPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import BdaDashboardPage from './pages/bda/BdaDashboardPage';
import LeadsListPage from './pages/bda/LeadsListPage';
import NewLeadPage from './pages/bda/NewLeadPage';
import LeadDetailPage from './pages/bda/LeadDetailPage';
import ImportLeadsPage from './pages/bda/ImportLeadsPage';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mfa" element={<MfaPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Routes Wrapper */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardPage />}>
               <Route path="/dashboard" element={<BdaDashboardPage />} />
               <Route path="/leads" element={<LeadsListPage />} />
               <Route path="/leads/new" element={<NewLeadPage />} />
               <Route path="/leads/import" element={<ImportLeadsPage />} />
               <Route path="/leads/:id" element={<LeadDetailPage />} />
            </Route>
          </Route>
          
          {/* Catch All */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
