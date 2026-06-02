import { api } from './client'

export type DashboardResponse = {
  total_users: number
  total_questions: number
  total_discussions: number
  total_faqs: number
  total_reports_open: number
}

export type AnalyticsEventCreate = {
  event_name: string
  entity_type?: string
  entity_id?: string
}

export const analyticsApi = {
  getDashboard: () =>
    api.get<DashboardResponse>('/api/v1/analytics/dashboard'),

  recordEvent: (data: AnalyticsEventCreate) =>
    api.post<void>('/api/v1/analytics/events', data),
}
