import { create } from 'zustand'

export type UserRole = 'guest' | 'user' | 'admin'

type AuthState = {
  role: UserRole
  email: string | null
  name: string
  signIn: (email: string) => void
  signOut: () => void
  setAdmin: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  role: 'guest',
  email: null,
  name: 'Guest',
  signIn: (userEmail: string) =>
    set({
      email: userEmail,
      name: userEmail.split('@')[0] ?? 'Member',
      role: userEmail.includes('admin') ? 'admin' : 'user',
    }),
  signOut: () => set({ role: 'guest', email: null, name: 'Guest' }),
  setAdmin: () => set({ role: 'admin' }),
}))
