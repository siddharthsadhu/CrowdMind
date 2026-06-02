import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, type UserRole } from '@/context/AuthContext'
import type { ReactNode } from 'react'

type RouteGuardProps = {
  children: ReactNode
  allow: UserRole[]
}

export function RouteGuard({ children, allow }: RouteGuardProps) {
  const { role } = useAuth()
  const location = useLocation()

  if (!allow.includes(role)) {
    if (role === 'guest') return <Navigate to="/login" state={{ from: location }} replace />
    if (role === 'user') return <Navigate to="/home" replace />
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}
