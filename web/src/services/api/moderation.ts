import { api } from './client'

export type ReportCreate = {
  target_type: string
  target_id: string
  reason: string
  description?: string
}

export type ReportResponse = {
  id: string
  content_type: string
  content_id: string
  reason: string
  description: string | null
  severity: string
  status: string
  reported_by: string
  created_at: string | null
}

export type ReportListResponse = {
  items: ReportResponse[]
  total: number
  page: number
  page_size: number
}

export const moderationApi = {
  listReports: (params?: { page?: string; page_size?: string; status?: string }) =>
    api.get<ReportListResponse>('/api/v1/reports', params),

  getReport: (id: string) =>
    api.get<ReportResponse>(`/api/v1/reports/${id}`),

  createReport: (data: ReportCreate) =>
    api.post<ReportResponse>('/api/v1/reports', data),

  resolveReport: (id: string, data: { status: 'RESOLVED' | 'DISMISSED'; action?: string }) =>
    api.patch<ReportResponse>(`/api/v1/reports/${id}`, data),
}
