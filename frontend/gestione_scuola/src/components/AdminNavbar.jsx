import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import { useState } from 'react'

const AdminNavbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuAperto, setMenuAperto] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/admin-dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/studenti', icon: '🎓', label: 'Studenti' },
    { path: '/corsi', icon: '📚', label: 'Corsi' },
    { path: '/insegnanti', icon: '👨‍🏫', label: 'Insegnanti' },
    { path: '/aule', icon: '🏢', label: 'Aule' },
    { path: '/spese', icon: '💰', label: 'Spese' },
    { path: '/pagamenti', icon: '💳', label: 'Pagamenti' },
    { path: '/calendario', icon: '📅', label: 'Calendario' },
    { path: '/report', icon: '📄', label: 'Report' },
  ]

  return (
    <nav className="navbar fixed-top">
      <div className="container-fluid">
        <Link to="/dashboard" className="navbar-brand">
          🏫 Gestione Scuola
        </Link>
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          onClick={() => setMenuAperto(!menuAperto)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="d-none d-lg-flex nav-links-custom">
          {navLinks.map(({ path, icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${isActive(path) ? 'active-nav' : ''}`}
            >
              {icon} {label}
            </Link>
          ))}
          <button className="btn btn-logout btn-sm" onClick={handleLogout}>
            🔴 Logout
          </button>
        </div>
      </div>

      {menuAperto && (
        <div className="mobile-menu d-lg-none">
          {navLinks.map(({ path, icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${isActive(path) ? 'active-nav' : ''}`}
              onClick={() => setMenuAperto(false)}
            >
              {icon} {label}
            </Link>
          ))}
          <button className="btn btn-logout" onClick={handleLogout}>
            🔴 Logout
          </button>
        </div>
      )}
    </nav>
  )
}

export default AdminNavbar
