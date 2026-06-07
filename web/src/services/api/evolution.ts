import { api } from './client'

export type EvolutionEventResponse = {
  id: string
  faq_id: string
  version_id: string | null
  event_type: string
  description: string | null
  triggered_by: string | null
  created_at: string
}

export type EvolutionEventListResponse = {
  items: EvolutionEventResponse[]
  total: number
}

export type EvolutionTimelineEntry = {
  version_id: string
  version_number: number
  title: string
  change_summary: string | null
  created_by: string
  created_at: string
  is_current: boolean
  diff_summary: string | null
}

export type FaqTimelineResponse = {
  faq_id: string
  faq_title: string
  current_version: number
  timeline: EvolutionTimelineEntry[]
  events: EvolutionEventResponse[]
}

export type VersionDiffResponse = {
  faq_id: string
  from_version: number
  to_version: number
  diff: { op: string; before: string[]; after: string[] }[]
  additions: number
  deletions: number
}

export type SynthesisResponse = {
  discussion_id: string
  candidate_id: string | null
  title: string
  confidence_score: number
  source_reply_ids: string[]
  used_fallback: boolean
}

export const evolutionApi = {
  listEvents: (limit = 50) =>
    api.get<EvolutionEventListResponse>('/api/v1/evolution/events', { limit: String(limit) }),

  getTimeline: (faqId: string) =>
    api.get<FaqTimelineResponse>(`/api/v1/evolution/timeline/${faqId}`),

  getDiff: (faqId: string, fromV: number, toV: number) =>
    api.get<VersionDiffResponse>(`/api/v1/evolution/diff/${faqId}/${fromV}/${toV}`),

  synthesize: (discussionId: string, force = false) =>
    api.post<SynthesisResponse>(
      `/api/v1/discussions/${discussionId}/synthesize`,
      { force },
    ),

  rollback: (faqId: string, targetVersionId: string) =>
    api.post<{ faq_id: string; current_version: number; title: string }>(
      `/api/v1/faqs/${faqId}/rollback`,
      { target_version_id: targetVersionId },
    ),
}
