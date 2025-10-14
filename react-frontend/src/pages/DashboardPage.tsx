import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '2px solid #e5e7eb',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // Redirect to appropriate dashboard based on user role
  if (user?.role === 'creator') {
    return <Navigate to="/creator-dashboard" replace />
  } else if (user?.role === 'brand') {
    return <Navigate to="/brand-dashboard" replace />
  }

  // Fallback to home if role is not recognized
  return <Navigate to="/" replace />
}