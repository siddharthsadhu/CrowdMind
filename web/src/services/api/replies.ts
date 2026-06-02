import { api } from './client'

export type ReplyCreate = {
  content: string
  parent_reply_id?: string
}

export type ReplyResponse = {
  id: string
  discussion_id: string
  parent_reply_id: string | null
  user_id: string
  content: string
  is_accepted: boolean
  upvote_count: number
  downvote_count: number
  created_at: string
  updated_at: string | null
}

export type ReplyListResponse = {
  items: ReplyResponse[]
  total: number
  page: number
  page_size: number
}

export const repliesApi = {
  listByDiscussion: (discussionId: string, params?: { page?: string; page_size?: string }) =>
    api.get<ReplyListResponse>(`/api/v1/discussions/${discussionId}/replies`, params),

  create: (discussionId: string, data: ReplyCreate) =>
    api.post<ReplyResponse>(`/api/v1/discussions/${discussionId}/replies`, data),

  getById: (replyId: string) =>
    api.get<ReplyResponse>(`/api/v1/replies/${replyId}`),

  update: (replyId: string, data: { content?: string }) =>
    api.patch<ReplyResponse>(`/api/v1/replies/${replyId}`, data),

  delete: (replyId: string) =>
    api.delete<void>(`/api/v1/replies/${replyId}`),
}
