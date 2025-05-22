import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { RequestsProvider } from './context/RequestsContext'
import Layout from './components/Layout'
import Login from './components/Login'
import Register from './components/Register'
import RequestExam from './components/RequestExam'
import StudentDecided from './components/StudentDecided'
import RequestExamDecided from './components/RequestExamDecided'
import DecideExamRequest from './components/DecideExamRequest'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  if (user === null) return null        // still loading
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <RequestsProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected area */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="request-exam" replace />} />

              {/* Pending requests for both roles */}
              <Route path="request-exam" element={<RequestExam />} />

              {/* Student’s decided list */}
              <Route path="request-exam/decided" element={<StudentDecided />} />

              {/* Admin’s decided list */}
              <Route
                path="request-exam/decided-admin"
                element={<RequestExamDecided />}
              />

              {/* Academic decision page */}
              <Route path="decide-exam/:id" element={<DecideExamRequest />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </RequestsProvider>
    </AuthProvider>
  )
}
