import { api } from './client'

export type ReportResponse = {
  id: string
  content_type: string
  content_id: string
  reason: string
  status: string
  reported_by: string
  created_at: string
}

export const moderationApi = {
  listReports: (params?: { page?: string; page_size?: string; status?: string }) =>
    api.get<{ items: ReportResponse[]; total: number }>('/api/v1/reports', params),

  getReport: (id: string) =>
    api.get<ReportResponse>(`/api/v1/reports/${id}`),

  createReport: (data: { content_type: string; content_id: string; reason: string }) =>
    api.post<ReportResponse>('/api/v1/reports', data),

  resolveReport: (id: string, action: string) =>
    api.patch<ReportResponse>(`/api/v1/reports/${id}`, { status: 'resolved', action }),
}
