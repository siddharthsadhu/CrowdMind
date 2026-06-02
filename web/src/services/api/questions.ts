import { api } from './client'

export type QuestionCreate = {
  title: string
  context?: string
  category?: string
}

export type QuestionResponse = {
  id: string
  title: string
  context: string
  category: string
  status: string
  created_by: string
  created_at: string
  updated_at: string
}

export type QuestionListResponse = {
  items: QuestionResponse[]
  total: number
  page: number
  page_size: number
}

export const questionsApi = {
  list: (params?: { page?: string; page_size?: string; category?: string }) =>
    api.get<QuestionListResponse>('/api/v1/questions', params),

  getById: (id: string) =>
    api.get<QuestionResponse>(`/api/v1/questions/${id}`),

  create: (data: QuestionCreate) =>
    api.post<QuestionResponse>('/api/v1/questions', data),

  update: (id: string, data: Partial<QuestionCreate>) =>
    api.patch<QuestionResponse>(`/api/v1/questions/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/api/v1/questions/${id}`),
}
