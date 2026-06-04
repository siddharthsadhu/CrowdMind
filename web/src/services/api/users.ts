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

export type ContributionItem = {
  type: 'question' | 'reply' | 'discussion' | 'faq' | 'faq_version'
  id: string
  title: string
  snippet: string | null
  url: string | null
  status: string | null
  created_at: string | null
  parent_id: string | null
  parent_title: string | null
}

export type ContributionSummary = {
  questions: number
  replies: number
  discussions: number
  faqs_published: number
  faq_versions: number
  total: number
}

export type ContributionsResponse = {
  items: ContributionItem[]
  summary: ContributionSummary
}

export const usersApi = {
  getMe: () =>
    api.get<UserResponse>('/api/v1/users/me'),

  getById: (id: string) =>
    api.get<UserResponse>(`/api/v1/users/${id}`),

  updateMe: (data: { full_name?: string; bio?: string; avatar_url?: string }) =>
    api.patch<UserResponse>('/api/v1/users/me', data),

  getMyContributions: () =>
    api.get<ContributionsResponse>('/api/v1/users/me/contributions'),
}
