import { api } from './client'

export type DiscussionCreate = {
  title: string
  content?: string
  question_id?: string
}

export type DiscussionResponse = {
  id: string
  title: string
  content: string
  question_id: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export type DiscussionListResponse = {
  items: DiscussionResponse[]
  total: number
  page: number
  page_size: number
}

export const discussionsApi = {
  list: (params?: { page?: string; page_size?: string }) =>
    api.get<DiscussionListResponse>('/api/v1/discussions', params),

  getById: (id: string) =>
    api.get<DiscussionResponse>(`/api/v1/discussions/${id}`),

  create: (data: DiscussionCreate) =>
    api.post<DiscussionResponse>('/api/v1/discussions', data),

  update: (id: string, data: Partial<DiscussionCreate>) =>
    api.patch<DiscussionResponse>(`/api/v1/discussions/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/api/v1/discussions/${id}`),
}
