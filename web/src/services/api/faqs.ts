import { api } from './client'

export type FaqResponse = {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
  confidence_score: number
  version: number
  created_by: string
  created_at: string
  updated_at: string
}

export type FaqListResponse = {
  items: FaqResponse[]
  total: number
  page: number
  page_size: number
}

export type FaqCandidateResponse = {
  id: string
  question: string
  answer: string
  source_discussion_id: string
  status: string
  created_by: string
  created_at: string
  updated_at: string
}

export const faqsApi = {
  list: (params?: { page?: string; page_size?: string; category?: string; q?: string }) =>
    api.get<FaqListResponse>('/api/v1/faqs', params),

  getById: (id: string) =>
    api.get<FaqResponse>(`/api/v1/faqs/${id}`),

  getVersions: (id: string) =>
    api.get<{ items: FaqResponse[] }>(`/api/v1/faqs/${id}/versions`),

  candidates: {
    list: (params?: { page?: string; page_size?: string; status?: string }) =>
      api.get<{ items: FaqCandidateResponse[]; total: number }>('/api/v1/faq-candidates', params),
    getById: (id: string) =>
      api.get<FaqCandidateResponse>(`/api/v1/faq-candidates/${id}`),
    update: (id: string, data: Partial<FaqCandidateResponse>) =>
      api.patch<FaqCandidateResponse>(`/api/v1/faq-candidates/${id}`, data),
  },
}
