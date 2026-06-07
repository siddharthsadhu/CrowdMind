import { api } from './client'

export type StatsSummary = {
  total_faqs: number
  total_discussions: number
  total_users: number
  total_questions: number
  resolved_discussions: number
  resolution_rate: number
}

export type TrendingFaqsList = {
  items: Array<{
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
  }>
  total: number
  page: number
  page_size: number
}

export const statsApi = {
  getSummary: () => api.get<StatsSummary>('/api/v1/stats/summary'),
  getTrendingFaqs: (limit = 4) =>
    api.get<TrendingFaqsList>(`/api/v1/stats/trending-faqs?limit=${limit}`),
}
