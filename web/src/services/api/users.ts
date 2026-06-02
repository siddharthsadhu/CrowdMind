import { api } from './client'

export type UserProfileResponse = {
  id: string
  email: string
  name: string
  role: string
  reputation: number
  bio: string | null
  avatar_url: string | null
  created_at: string
  question_count: number
  answer_count: number
  faq_count: number
}

export const usersApi = {
  getProfile: (id: string) =>
    api.get<UserProfileResponse>(`/api/v1/users/${id}`),

  updateProfile: (data: Partial<{ name: string; bio: string }>) =>
    api.patch<UserProfileResponse>('/api/v1/users/me', data),

  getContributions: (id: string) =>
    api.get<{ questions: number; answers: number; faqs: number }>(`/api/v1/users/${id}/contributions`),
}
