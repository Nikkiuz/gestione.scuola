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
import TeacherDashboard from '../pages/TeacherDashboard'
import TeacherCourses from '../pages/TeacherCourses'
import TeacherProfile from '../pages/TeacherProfile'
import TeacherList from '../pages/TeacherList'
import SpeseList from '../pages/SpeseList'
import SpesaDetail from '../pages/SpesaDetail'
import TeacherDetail from '../pages/TeacherDetail'
import AulaList from '../pages/AulaList'
import AulaDetail from '../pages/AulaDetail'
import Calendario from '../pages/Calendario'
import Report from '../pages/Report'

const ProtectedRoute = ({ children, role }) => {
  const { user } = useSelector((state) => state.auth)

  if (!user) {
    return <Navigate to="/login" />
  }

  if (user.role !== role) {
    return (
      <Navigate
        to={user.role === 'ADMIN' ? '/dashboard' : '/teacher-dashboard'}
      />
    )
  }

  return children
}

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Pagina di Login */}
        <Route path="/login" element={<Login />} />

        {/* Rotte Admin Protette */}
        <Route
          path="/dashboard"
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
              <SpesaDetail />
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
