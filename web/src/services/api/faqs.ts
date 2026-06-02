import { api } from './client'

export type PublishedFaqResponse = {
  id: string
  slug: string
  title: string
  content: string
  category_id: string | null
  version_number: number
  confidence_score: number | null
  community_agreement_score: number | null
  published_by: string
  published_at: string
  created_at: string
  updated_at: string | null
}

export type PublishedFaqListResponse = {
  items: PublishedFaqResponse[]
  total: number
  page: number
  page_size: number
}

export type FaqCandidateResponse = {
  id: string
  discussion_id: string
  generated_by_ai: boolean
  title: string
  content: string
  confidence_score: number | null
  status: string
  created_at: string
  updated_at: string | null
}

export type FaqCandidateListResponse = {
  items: FaqCandidateResponse[]
  total: number
  page: number
  page_size: number
}

export type FaqVersionResponse = {
  id: string
  faq_id: string
  version_number: number
  title: string
  content: string
  change_summary: string | null
  created_by: string
  created_at: string
}

export const faqsApi = {
  list: (params?: { page?: string; page_size?: string; category_id?: string }) =>
    api.get<PublishedFaqListResponse>('/api/v1/faqs', params),

  getById: (id: string) =>
    api.get<PublishedFaqResponse>(`/api/v1/faqs/${id}`),

  getBySlug: (slug: string) =>
    api.get<PublishedFaqResponse>(`/api/v1/faqs/by-slug/${slug}`),

  update: (id: string, data: { title?: string; content?: string; category_id?: string }) =>
    api.patch<PublishedFaqResponse>(`/api/v1/faqs/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/api/v1/faqs/${id}`),

  getVersions: (id: string) =>
    api.get<{ items: FaqVersionResponse[]; total: number }>(`/api/v1/faqs/${id}/versions`),

  candidates: {
    list: (params?: { page?: string; page_size?: string; status?: string }) =>
      api.get<FaqCandidateListResponse>('/api/v1/faqs/candidates', params),

    getById: (id: string) =>
      api.get<FaqCandidateResponse>(`/api/v1/faqs/candidates/${id}`),

    review: (id: string, status: 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION') =>
      api.patch<FaqCandidateResponse>(`/api/v1/faqs/candidates/${id}/review`, { status }),
  },

  publishFromCandidate: (params: { candidate_id: string; slug: string; title?: string; content?: string; category_id?: string }) =>
    api.post<PublishedFaqResponse>('/api/v1/faqs/from-candidate', undefined, params),
}
