import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext'

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/landing" replace />
  }

  return children
}
