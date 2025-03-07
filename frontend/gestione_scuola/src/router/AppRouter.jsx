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

const AppRouter = () => {
  const { user } = useSelector((state) => state.auth)

  return (
    <Router>
      <Routes>
        {/* Pagina di Login */}
        <Route path="/login" element={<Login />} />

        {/* Rotte Admin */}
        {user?.role === 'ADMIN' && (
          <>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/corsi" element={<CourseList />} />
            <Route path="/corsi/:id" element={<CourseDetail />} />
            <Route path="/studenti" element={<StudentList />} />
            <Route path="/studenti/:id" element={<StudentDetails />} />
          </>
        )}

        {/* Rotte Insegnante */}
        {user?.role === 'INSEGNANTE' && (
          <>
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/miei-corsi" element={<TeacherCourses />} />
            <Route path="/profilo" element={<TeacherProfile />} />
          </>
        )}

        {/* Redirect alla login se non autenticato */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default AppRouter
