import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import AdminDashboard from '../pages/AdminDashboard'
import TeacherDashboard from '../pages/TeacherDashboard'
import TeacherCourses from '../pages/TeacherCourses'
import TeacherProfile from '../pages/TeacherProfile'
import ProtectedRoute from './ProtectedRoute'

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Rotta per il login */}
        <Route path="/" element={<Login />} />

        {/* Rotta per Admin */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Rotte per Insegnanti */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute role="INSEGNANTE">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/corsi"
          element={
            <ProtectedRoute role="INSEGNANTE">
              <TeacherCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/profilo"
          element={
            <ProtectedRoute role="INSEGNANTE">
              <TeacherProfile />
            </ProtectedRoute>
          }
        />

        {/* Pagina di default in caso di errore */}
        <Route path="*" element={<h2>404 - Pagina non trovata</h2>} />
      </Routes>
    </Router>
  )
}

export default AppRouter
