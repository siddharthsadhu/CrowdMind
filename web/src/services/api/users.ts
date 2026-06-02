import { api } from './client'

export type UserResponse = {
  id: string
  clerk_user_id: string
  username: string
  email: string
  full_name: string
  avatar_url: string | null
  bio: string | null
  reputation_score: number
  role: string
  created_at: string | null
}

export const usersApi = {
  getMe: () =>
    api.get<UserResponse>('/api/v1/users/me'),

  getById: (id: string) =>
    api.get<UserResponse>(`/api/v1/users/${id}`),

  updateMe: (data: { full_name?: string; bio?: string; avatar_url?: string }) =>
    api.patch<UserResponse>('/api/v1/users/me', data),
}
