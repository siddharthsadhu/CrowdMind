import { api } from './client'

export type SavedItem = {
  id: string
  target_type: string
  target_id: string
  created_at: string | null
}

export type SavedListResponse = {
  items: SavedItem[]
  total: number
}

export type SavedId = {
  target_type: string
  target_id: string
}

export const savedApi = {
  list: () => api.get<SavedListResponse>('/api/v1/saved'),
  listIds: () => api.get<SavedId[]>('/api/v1/saved/ids'),
  add: (target_type: 'FAQ' | 'DISCUSSION' | 'QUESTION' | 'REPLY', target_id: string) =>
    api.post<SavedItem>('/api/v1/saved', { target_type, target_id }),
  remove: (target_type: string, target_id: string) =>
    api.delete<void>(`/api/v1/saved/${target_type}/${target_id}`),
}
