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
  action_taken: string | null
  resolution_notes: string | null
  resolved_at: string | null
  resolved_by: string | null
  created_at: string | null
}

export type ReportListResponse = {
  items: ReportResponse[]
  total: number
  page: number
  page_size: number
}

export type ModerationActionResponse = {
  id: string
  report_id: string | null
  target_user_id: string
  moderator_id: string
  action_type: string
  action_reason: string | null
  expires_at: string | null
  created_at: string | null
}

export const moderationApi = {
  listReports: (params?: { page?: string; page_size?: string; status?: string }) =>
    api.get<ReportListResponse>('/api/v1/reports', params),

  getReport: (id: string) =>
    api.get<ReportResponse>(`/api/v1/reports/${id}`),

  createReport: (data: ReportCreate) =>
    api.post<ReportResponse>('/api/v1/reports', data),

  resolveReport: (
    id: string,
    data: { status: 'RESOLVED' | 'DISMISSED'; action?: string; resolution_notes?: string }
  ) =>
    api.patch<ReportResponse>(`/api/v1/reports/${id}`, data),

  applyAction: (
    id: string,
    data: { action: 'WARN' | 'HIDE' | 'DELETE' | 'ESCALATE' | 'NO_ACTION'; notes?: string }
  ) =>
    api.post<ModerationActionResponse>(`/api/v1/reports/${id}/actions`, data),
}
