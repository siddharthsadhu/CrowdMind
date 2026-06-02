import { createContext, useContext, useState, type ReactNode } from 'react'

export type UserRole = 'guest' | 'user' | 'admin'

type AuthState = {
  role: UserRole
  email: string | null
  name: string
  signIn: (email: string) => void
  signOut: () => void
  setAdmin: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('guest')
  const [email, setEmail] = useState<string | null>(null)
  const [name, setName] = useState('Guest')

  const signIn = (userEmail: string) => {
    setEmail(userEmail)
    setName(userEmail.split('@')[0] ?? 'Member')
    setRole(userEmail.includes('admin') ? 'admin' : 'user')
  }

  const signOut = () => {
    setRole('guest')
    setEmail(null)
    setName('Guest')
  }

  const setAdmin = () => setRole('admin')

  return (
    <AuthContext.Provider value={{ role, email, name, signIn, signOut, setAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
