import { createContext, useContext } from 'react'
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react'
import type { ReactNode } from 'react'

export type UserRole = 'guest' | 'user' | 'admin'

type AuthState = {
  role: UserRole
  email: string | null
  name: string
  isLoaded: boolean
  signIn: (email?: string) => void
  signOut: () => void
  setAdmin: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, user, isLoaded: userLoaded } = useUser()
  const { signOut: clerkSignOut } = useClerkAuth()
  const clerk = useClerk()

  if (!userLoaded) {
    return (
      <AuthContext.Provider
        value={{
          role: 'guest',
          email: null,
          name: 'Guest',
          isLoaded: false,
          signIn: () => {},
          signOut: () => {},
          setAdmin: () => {},
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  }

  const role: UserRole = !isSignedIn
    ? 'guest'
    : (user?.publicMetadata?.role === 'admin' ? 'admin' : 'user')
  const email = user?.primaryEmailAddress?.emailAddress ?? null
  const displayName =
    user?.fullName ??
    user?.firstName ??
    user?.username ??
    email?.split('@')[0] ??
    'Member'

  const signIn = () => {
    clerk.openSignIn()
  }

  const signOut = () => {
    clerkSignOut()
    localStorage.removeItem('clerk-token')
  }

  const setAdmin = () => {
    // Admin role is set via Clerk user metadata (backend webhook)
  }

  return (
    <AuthContext.Provider
      value={{
        role,
        email,
        name: displayName,
        isLoaded: true,
        signIn,
        signOut,
        setAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
