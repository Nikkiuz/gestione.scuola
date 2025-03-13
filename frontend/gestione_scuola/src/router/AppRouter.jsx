import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import Login from '../pages/Login'
import AdminDashboard from '../pages/AdminDashboard'
import CourseList from '../pages/CourseList'
import CourseDetail from '../pages/CourseDetail'
import StudentList from '../pages/StudentList'
import StudentDetails from '../pages/StudentDetails'
import SpeseList from '../pages/SpeseList'
import SpeseDetail from '../pages/SpeseDetail'
import AulaList from '../pages/AulaList'
import AulaDetail from '../pages/AulaDetail'
import Calendario from '../pages/Calendario'
import Report from '../pages/Report'

const ProtectedRoute = ({ children, role }) => {
  const { user } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🧐 Stato Redux user:', user)

    if (user === null) {
      console.log('⏳ Aspettando che Redux aggiorni user...')
      return
    }

    setLoading(false) // ✅ L'utente è stato caricato

    if (!user) {
      console.log('🔴 Utente non autenticato, reindirizzamento a /login')
      window.location.href = '/login'
    } else if (user.role !== role) {
      console.log('⚠️ Accesso negato, reindirizzamento alla dashboard admin')
      window.location.href = '/admin-dashboard'
    }
  }, [user, role])

  if (loading) return <p>⏳ Caricamento...</p>

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

        {/* Redirect alla pagina corretta in base al ruolo */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default AppRouter
