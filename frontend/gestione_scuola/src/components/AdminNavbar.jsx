import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import { useState } from 'react'

const AdminNavbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menuAperto, setMenuAperto] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg shadow custom-navbar fixed-top">
      <div className="container">
        {/* Logo e Nome */}
        <Link className="navbar-brand fw-bold" to="/dashboard">
          🏫 Gestione Scuola
        </Link>

        {/* Bottone Hamburger */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={menuAperto ? 'true' : 'false'}
          aria-label="Toggle navigation"
          onClick={() => setMenuAperto(!menuAperto)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Desktop */}
        <div
          className={`collapse navbar-collapse ${menuAperto ? 'show' : ''}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto text-center text-lg-start">
            {' '}
            {/* Centra su mobile, allinea a sinistra su desktop */}
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
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
              <Link className="nav-link" to="/pagamenti">
                💳 Pagamenti
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
                className="btn btn-danger ms-lg-3 w-100 w-lg-auto"
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
