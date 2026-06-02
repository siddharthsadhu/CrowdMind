import { api } from './client'

export type NotificationResponse = {
  id: string
  type: string
  title: string
  body: string
  read: boolean
  created_at: string
}

export const notificationsApi = {
  list: (params?: { page?: string; page_size?: string }) =>
    api.get<{ items: NotificationResponse[]; total: number }>('/api/v1/notifications', params),

  markRead: (id: string) =>
    api.patch<void>(`/api/v1/notifications/${id}/read`),

  markAllRead: () =>
    api.patch<void>('/api/v1/notifications/read-all'),
}
