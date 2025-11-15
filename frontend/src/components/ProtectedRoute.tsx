import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type Props = { children: React.ReactNode; requireRole?: string }

export function ProtectedRoute({ children, requireRole }: Props) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (requireRole && user.role?.toLowerCase() !== requireRole.toLowerCase() && user.role?.toLowerCase() !== 'admin') {
    return <div className="p-4">No tienes permisos para ver esta página.</div>
  }
  return <>{children}</>
}

export default ProtectedRoute
