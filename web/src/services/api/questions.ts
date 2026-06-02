import { api } from './client'

export type QuestionCreate = {
  title: string
  description?: string
  category_id?: string
}

export type QuestionUpdate = {
  title?: string
  description?: string
  category_id?: string
  status?: string
}

export type QuestionResponse = {
  id: string
  user_id: string
  title: string
  description: string | null
  category_id: string | null
  status: string
  ai_analysis_status: string
  created_at: string
  updated_at: string | null
}

export type QuestionListResponse = {
  items: QuestionResponse[]
  total: number
  page: number
  page_size: number
}

export const questionsApi = {
  list: (params?: { page?: string; page_size?: string; category_id?: string; status?: string }) =>
    api.get<QuestionListResponse>('/api/v1/questions', params),

  getById: (id: string) =>
    api.get<QuestionResponse>(`/api/v1/questions/${id}`),

  create: (data: QuestionCreate) =>
    api.post<QuestionResponse>('/api/v1/questions', data),

  update: (id: string, data: QuestionUpdate) =>
    api.patch<QuestionResponse>(`/api/v1/questions/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/api/v1/questions/${id}`),
}
