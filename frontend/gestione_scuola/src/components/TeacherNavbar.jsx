import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice'

const TeacherNavbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/teacher/dashboard">
          🎓 Gestione Scuola
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/teacher/corsi">
                📚 I miei corsi
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/teacher/profilo">
                👤 Profilo
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-outline-danger ms-3"
                onClick={handleLogout}
              >
                🔴 Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default TeacherNavbar
