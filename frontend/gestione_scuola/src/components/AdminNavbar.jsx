import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice'

const AdminNavbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

   const handleDashboardClick = () => {
     navigate('/admin-dashboard', { replace: true }) 
   }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/admin-dashboard">
          🏫 Gestione Scuola
        </Link>

        <button
          onClick={handleDashboardClick}
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
              <Link className="nav-link" to="/admin-dashboard">
                📊 Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/studenti">
                🎓 Studenti
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/corsi">
                📚 Corsi
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/insegnanti">
                👨‍🏫 Insegnanti
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/aule">
                🏢 Aule
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/spese">
                💰 Spese
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/calendario">
                📅 Calendario
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/report">
                📜 Report
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

export default AdminNavbar
