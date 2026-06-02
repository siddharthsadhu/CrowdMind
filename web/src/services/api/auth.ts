import { api } from './client'

export type UserResponse = {
  id: string
  email: string
  name: string
  role: string
  reputation: number
  created_at: string
}

export const authApi = {
  me: () => api.get<UserResponse>('/api/v1/users/me'),
  login: () => {
    // Clerk handles login; this is a placeholder for backend user sync
    return api.get<UserResponse>('/api/v1/users/me')
  },
}
