import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Login from '../pages/Login'
import AdminDashboard from '../pages/AdminDashboard'
import CourseList from '../pages/CourseList'
import CourseDetail from '../pages/CourseDetail'
import StudentList from '../pages/StudentList'
import StudentDetails from '../pages/StudentDetails'
import TeacherDashboard from '../pages/TeacherDashboard'
import TeacherCourses from '../pages/TeacherCourses'
import TeacherProfile from '../pages/TeacherProfile'
import TeacherList from '../pages/TeacherList'
import SpeseList from '../pages/SpeseList'
import SpeseDetail from '../pages/SpeseDetail'
import TeacherDetail from '../pages/TeacherDetail'
import AulaList from '../pages/AulaList'
import AulaDetail from '../pages/AulaDetail'
import Calendario from '../pages/Calendario'
import Report from '../pages/Report'

const ProtectedRoute = ({ children, role }) => {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      console.log('🔴 Utente non autenticato, reindirizzamento a /login')
      navigate('/login', { replace: true })
    } else if (user.role !== role) {
      console.log('⚠️ Accesso negato, reindirizzamento alla dashboard corretta')
      navigate(
        user.role === 'ADMIN' ? '/admin-dashboard' : '/teacher-dashboard',
        { replace: true }
      )
    }
    setLoading(false)
  }, [user, role, navigate])

  if (loading) return null // Evita rendering prematuro

  return user && user.role === role ? children : null
}

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Pagina di Login */}
        <Route path="/login" element={<Login />} />

        {/* Rotte Admin Protette */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/corsi"
          element={
            <ProtectedRoute role="ADMIN">
              <CourseList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/corsi/:id"
          element={
            <ProtectedRoute role="ADMIN">
              <CourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studenti"
          element={
            <ProtectedRoute role="ADMIN">
              <StudentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studenti/:id"
          element={
            <ProtectedRoute role="ADMIN">
              <StudentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insegnanti"
          element={
            <ProtectedRoute role="ADMIN">
              <TeacherList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insegnanti/:id"
          element={
            <ProtectedRoute role="ADMIN">
              <TeacherDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/spese"
          element={
            <ProtectedRoute role="ADMIN">
              <SpeseList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/spese/:id"
          element={
            <ProtectedRoute role="ADMIN">
              <SpeseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendario"
          element={
            <ProtectedRoute role="ADMIN">
              <Calendario />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute role="ADMIN">
              <Report />
            </ProtectedRoute>
          }
        />
        <Route
          path="/aule"
          element={
            <ProtectedRoute role="ADMIN">
              <AulaList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/aule/:id"
          element={
            <ProtectedRoute role="ADMIN">
              <AulaDetail />
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
        <Route
          path="/miei-corsi"
          element={
            <ProtectedRoute role="INSEGNANTE">
              <TeacherCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profilo"
          element={
            <ProtectedRoute role="INSEGNANTE">
              <TeacherProfile />
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
