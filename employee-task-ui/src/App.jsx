import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import LoginPage from './pages/LoginPage'
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from './pages/DashboardPage'
import EmployeesPage from './pages/EmployeesPage'
import TasksPage from './pages/TasksPage'

function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}

function Protected({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
           <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Protected><Layout><DashboardPage /></Layout></Protected>} />
          <Route path="/employees" element={<Protected><Layout><EmployeesPage /></Layout></Protected>} />
          <Route path="/tasks" element={<Protected><Layout><TasksPage /></Layout></Protected>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
