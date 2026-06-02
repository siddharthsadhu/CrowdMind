import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, type UserRole } from '@/context/AuthContext'
import type { ReactNode } from 'react'

type RouteGuardProps = {
  children: ReactNode
  allow: UserRole[]
}

export function RouteGuard({ children, allow }: RouteGuardProps) {
  const { role, isLoaded } = useAuth()
  const location = useLocation()

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!allow.includes(role)) {
    if (role === 'guest') return <Navigate to="/login" state={{ from: location }} replace />
    if (role === 'user') return <Navigate to="/home" replace />
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}
