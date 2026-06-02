import { api } from './client'

export type VoteCreate = {
  target_type: 'discussion' | 'reply'
  target_id: string
  vote_type: 'UPVOTE' | 'DOWNVOTE'
}

export type VoteResponse = {
  id: string
  user_id: string
  target_type: string
  target_id: string
  vote_type: string
  created_at: string
}

export const votesApi = {
  createOrUpdate: (data: VoteCreate) =>
    api.post<VoteResponse>('/api/v1/votes', data),

  remove: (targetType: string, targetId: string) =>
    api.delete<void>(`/api/v1/votes/${targetType}/${targetId}`),
}
