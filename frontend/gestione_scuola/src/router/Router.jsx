import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { useSelector } from 'react-redux'
import Login from '../pages/Login'
import AdminDashboard from '../pages/AdminDashboard'

const AppRouter = () => {
  const token = useSelector((state) => state.auth.token)
  const user = useSelector((state) => state.auth.user)

  return (
    <Router>
      <Routes>
        {/* Pagina Login */}
        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" /> : <Login />}
        />

        {/* Dashboard Admin (protetta) */}
        <Route
          path="/dashboard"
          element={
            token && user?.role === 'ADMIN' ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Redirect alla login di default */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default AppRouter
