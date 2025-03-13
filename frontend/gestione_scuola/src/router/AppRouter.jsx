import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { useSelector } from 'react-redux'

import Login from '../pages/Login'
import Register from '../pages/Register'
import AdminDashboard from '../pages/AdminDashboard'
import TeacherDashboard from '../pages/TeacherDashboard'

const ProtectedRoute = ({ children, role }) => {
  const { token, role: userRole } = useSelector((state) => state.auth)

  if (!token) {
    console.log('🔴 Utente non autenticato, reindirizzamento a /login')
    return <Navigate to="/login" />
  }

  if (userRole !== role) {
    console.log('⚠️ Accesso negato, reindirizzamento alla dashboard corretta')
    return (
      <Navigate
        to={userRole === 'ADMIN' ? '/admin-dashboard' : '/teacher-dashboard'}
      />
    )
  }

  return children
}

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotte Admin Protette */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Rotte Insegnante Protette */}
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute role="INSEGNANTE">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect alla pagina corretta in base al ruolo */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default AppRouter
