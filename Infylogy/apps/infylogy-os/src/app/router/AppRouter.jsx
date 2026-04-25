import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../providers/AuthContext';
import ProtectedRoute from '../providers/ProtectedRoute';
import DashboardLayout from '../layout/DashboardLayout';
import Login from '../../modules/auth/Login';
import DashboardHome from '../../modules/dashboard/DashboardHome';
import BenchManagement from '../../modules/bench/BenchManagement';
import ImmigrationReadiness from '../../modules/immigration/ImmigrationReadiness';
import ResumeMatch from '../../modules/resume-engine/ResumeMatch';
import Timesheets from '../../modules/timesheets/Timesheets';
import LeadManagement from '../../modules/leads/LeadManagement';
import ControlQueue from '../../modules/control-engine/ControlQueue';
import Onboarding from '../../modules/bench/Onboarding';
import PerformanceReviews from '../../modules/bench/PerformanceReviews';
import UserProfile from '../../modules/dashboard/UserProfile';
import ProfitabilityDashboard from '../../modules/billing/ProfitabilityDashboard';
import BenefitsPortal from '../../modules/bench/BenefitsPortal';
import Offboarding from '../../modules/bench/Offboarding';
import '../../index.css';

function AppRouter() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Core Operational Modules */}
          <Route path="/bench" element={
            <ProtectedRoute roles={['Admin', 'Recruiter', 'HR', 'Supervisor']}>
              <DashboardLayout>
                <BenchManagement />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/immigration" element={
            <ProtectedRoute roles={['Admin', 'Immigration', 'HR', 'Employee']}>
              <DashboardLayout>
                <ImmigrationReadiness />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/onboarding" element={
            <ProtectedRoute roles={['Admin', 'HR', 'Supervisor']}>
              <DashboardLayout>
                <Onboarding />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/benefits" element={
            <ProtectedRoute roles={['Admin', 'Employee', 'HR']}>
              <DashboardLayout>
                <BenefitsPortal />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* AI Intelligence Modules */}
          <Route path="/resumes" element={
            <ProtectedRoute roles={['Admin', 'Recruiter']}>
              <DashboardLayout>
                <ResumeMatch />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/leads" element={
            <ProtectedRoute roles={['Admin', 'Recruiter', 'Supervisor']}>
              <DashboardLayout>
                <LeadManagement />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Financial & Performance Modules */}
          <Route path="/timesheets" element={
            <ProtectedRoute roles={['Admin', 'Employee', 'Supervisor', 'Accounting']}>
              <DashboardLayout>
                <Timesheets />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/performance" element={
            <ProtectedRoute roles={['Admin', 'Supervisor', 'Employee']}>
              <DashboardLayout>
                <PerformanceReviews />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/billing" element={
            <ProtectedRoute roles={['Admin', 'Accounting', 'Supervisor']}>
              <DashboardLayout>
                <ProfitabilityDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Governance & Profile */}
          <Route path="/offboarding" element={
            <ProtectedRoute roles={['Admin', 'HR', 'Supervisor']}>
              <DashboardLayout>
                <Offboarding />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/control" element={
            <ProtectedRoute roles={['Admin', 'Supervisor']}>
              <DashboardLayout>
                <ControlQueue />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <DashboardLayout>
                <UserProfile />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default AppRouter;
