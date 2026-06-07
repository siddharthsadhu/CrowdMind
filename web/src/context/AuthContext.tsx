import { createContext, useContext } from 'react'
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react'
import type { ReactNode } from 'react'

export type UserRole = 'guest' | 'user' | 'admin'

type AuthState = {
  role: UserRole
  email: string | null
  name: string
  imageUrl: string | null
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
          imageUrl: null,
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
    localStorage.removeItem('cm_custom_avatar_url')
    localStorage.removeItem('cm_custom_name')
    localStorage.removeItem('saved-faqs')
    localStorage.removeItem('faq-feedback-counts')
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
        imageUrl: user?.imageUrl ?? null,
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

/** Fallback when Clerk is unavailable (no valid publishable key). */
export function GuestOnlyProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider
      value={{
        role: 'guest',
        email: null,
        name: 'Guest',
        imageUrl: null,
        isLoaded: true,
        signIn: () => { alert('Clerk not configured — sign-in unavailable') },
        signOut: () => {},
        setAdmin: () => { alert('Set role to admin for dev testing') },
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
