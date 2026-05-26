import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Navbar from './components/layout/Navbar'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import SetupPage from './pages/SetupPage'
import InterviewPage from './pages/InterviewPage'
import ReportPage from './pages/ReportPage'
import HistoryPage from './pages/HistoryPage'

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/auth" replace />
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/interview/new" element={<ProtectedRoute><SetupPage /></ProtectedRoute>} />
        <Route path="/interview/:id" element={<ProtectedRoute><InterviewPage /></ProtectedRoute>} />
        <Route path="/interview/:id/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
