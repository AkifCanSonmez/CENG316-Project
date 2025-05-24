// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RequestsProvider } from './context/RequestsContext';
import { GraduationAppProvider } from './context/GraduationAppContext';

import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import RequestExam from './components/RequestExam';
import StudentDecided from './components/StudentDecided';
import RequestExamDecided from './components/RequestExamDecided';
import DecideExamRequest from './components/DecideExamRequest';

import GradApply from './components/GradApply';
import AdvisorDecision from './components/AdvisorDecision';
import SecretaryList from './components/SecretaryList';
import DeanTop3 from './components/DeanTop3';
import CertAssign from './components/CertAssign';
import EligibilityCheck from './components/EligibilityCheck';
import AdminDashboard from './components/AdminDashboard';
import GraduationList from './components/GraduationList';


function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <RequestsProvider>
        <GraduationAppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/app/*"
                element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Home />} />
                <Route path="request-exam" element={<RequestExam />} />
                <Route path="request-exam/decided" element={<StudentDecided />} />
                <Route path="request-exam/decided-admin" element={<RequestExamDecided />} />
                <Route path="decide-exam/:id" element={<DecideExamRequest />} />

                <Route path="grad-apply" element={<GradApply />} />
                <Route path="advisor-decisions" element={<AdvisorDecision />} />
                <Route path="secretary-list" element={<SecretaryList />} />
                <Route path="dean-top3" element={<DeanTop3 />} />
                <Route path="cert-assign" element={<CertAssign />} />
                <Route path="eligibility-check" element={<EligibilityCheck />} />
                <Route path="admin-dashboard" element={<AdminDashboard />} />
                <Route path="graduation-list" element={<GraduationList />} />
              </Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </GraduationAppProvider>
      </RequestsProvider>
    </AuthProvider>
  );
}
