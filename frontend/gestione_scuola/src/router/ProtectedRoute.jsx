import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth)

  if (!token) {
    console.log('🔴 Utente non autenticato, MA NON REINDIRIZZO PER DEBUG')
    return <div>⚠️ ERRORE: Utente non autenticato!</div> // 🔥 Mostra un messaggio invece di reindirizzare
  }

  return children
}

export default ProtectedRoute
