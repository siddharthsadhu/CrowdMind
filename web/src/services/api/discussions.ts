import { api } from './client'

export type DiscussionCreate = {
  title: string
  description?: string
  question_id?: string
}

export type DiscussionResponse = {
  id: string
  question_id: string | null
  created_by: string
  title: string
  description: string | null
  status: string
  view_count: number
  reply_count: number
  participant_count: number
  consensus_score: number | null
  created_at: string
  updated_at: string | null
}

export type DiscussionListResponse = {
  items: DiscussionResponse[]
  total: number
  page: number
  page_size: number
}

export const discussionsApi = {
  list: (params?: { page?: string; page_size?: string; status?: string }) =>
    api.get<DiscussionListResponse>('/api/v1/discussions', params),

  getById: (id: string) =>
    api.get<DiscussionResponse>(`/api/v1/discussions/${id}`),

  create: (data: DiscussionCreate) =>
    api.post<DiscussionResponse>('/api/v1/discussions', data),

  update: (id: string, data: { title?: string; description?: string; status?: string }) =>
    api.patch<DiscussionResponse>(`/api/v1/discussions/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/api/v1/discussions/${id}`),
}
