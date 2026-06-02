import { api } from './client'

export type NotificationResponse = {
  id: string
  type: string
  title: string
  body: string | null
  read: boolean
  created_at: string | null
}

export type NotificationListResponse = {
  items: NotificationResponse[]
  total: number
  page: number
  page_size: number
}

export const notificationsApi = {
  list: (params?: { page?: string; page_size?: string }) =>
    api.get<NotificationListResponse>('/api/v1/notifications', params),

  markRead: (id: string) =>
    api.patch<void>(`/api/v1/notifications/${id}/read`),

  markAllRead: () =>
    api.patch<void>('/api/v1/notifications/read-all'),
}
