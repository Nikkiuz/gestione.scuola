import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth)

  if (!token) {
    console.log('🔴 Utente non autenticato, reindirizzamento a /login')
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
