import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth)

  console.log('📌 Token nel ProtectedRoute:', token) // Log per monitorare il token

  if (!token) {
    console.log('🔴 Token mancante, MA NON REINDIRIZZO PER DEBUG')
    return (
      <div>
        ⚠️ ERRORE: Token mancante, ma non reindirizzo alla login per debug
      </div>
    )
  }

  return children
}

export default ProtectedRoute
