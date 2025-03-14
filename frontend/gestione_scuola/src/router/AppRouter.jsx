import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { useSelector } from 'react-redux'

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
import ProtectedRoute from './ProtectedRoute'

const AppRouter = () => {
  const { token } = useSelector((state) => state.auth)

  return (
    <Router>
      <Routes>
        {/* Pagina di Login */}
        <Route
          path="/login"
          element={token ? <Navigate to="/admin-dashboard" /> : <Login />}
        />

        {/* Rotte Admin Protette */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/corsi"
          element={
            <ProtectedRoute>
              <CourseList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/corsi/:id"
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studenti"
          element={
            <ProtectedRoute>
              <StudentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studenti/:id"
          element={
            <ProtectedRoute>
              <StudentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/spese"
          element={
            <ProtectedRoute>
              <SpeseList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/spese/:id"
          element={
            <ProtectedRoute>
              <SpeseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendario"
          element={
            <ProtectedRoute>
              <Calendario />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          }
        />
        <Route
          path="/aule"
          element={
            <ProtectedRoute>
              <AulaList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/aule/:id"
          element={
            <ProtectedRoute>
              <AulaDetail />
            </ProtectedRoute>
          }
        />

        {/* Redirect alla pagina corretta in base al token */}
        <Route
          path="*"
          element={<Navigate to={token ? '/admin-dashboard' : '/login'} />}
        />
      </Routes>
    </Router>
  )
}

export default AppRouter
