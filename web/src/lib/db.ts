import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

export type UserRecord = {
  id: string
  clerk_user_id: string
  username: string
  email: string
  full_name: string
  avatar_url: string | null
  bio: string | null
  role: 'user' | 'admin'
  reputation_score: number
  joined_at: string
  notification_prefs: {
    mentions: boolean
    replies: boolean
    votes: boolean
    faq_publications: boolean
    weekly_digest: boolean
  }
  privacy: {
    show_reputation: boolean
    show_contributions: boolean
    allow_messages: boolean
  }
  appearance: {
    theme: 'dark' | 'light' | 'system'
    density: 'comfortable' | 'compact'
  }
  followed_category_ids: string[]
}

export type CategoryRecord = {
  id: string
  name: string
  slug: string
  description: string
  color: string
  icon: string
}

export type QuestionRecord = {
  id: string
  user_id: string
  title: string
  description: string | null
  category_id: string | null
  status: 'OPEN' | 'RESOLVED' | 'ARCHIVED'
  view_count: number
  created_at: string
  updated_at: string | null
}

export type FaqRecord = {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string
  category_id: string | null
  version_number: number
  confidence_score: number
  community_agreement_score: number
  view_count: number
  save_count: number
  published_by: string
  published_at: string
  updated_at: string | null
  contributors: string[]
  source_discussion_ids: string[]
}

export type FaqVersionRecord = {
  id: string
  faq_id: string
  version_number: number
  title: string
  content: string
  change_summary: string
  created_by: string
  created_at: string
}

export type FaqCandidateRecord = {
  id: string
  discussion_id: string
  generated_by_ai: boolean
  title: string
  content: string
  confidence_score: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION' | 'PUBLISHED'
  source: string
  review_notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string | null
}

export type DiscussionRecord = {
  id: string
  question_id: string | null
  created_by: string
  title: string
  description: string | null
  status: 'OPEN' | 'RESOLVED' | 'CLOSED'
  view_count: number
  reply_count: number
  participant_count: number
  consensus_score: number
  category_id: string | null
  tags: string[]
  created_at: string
  updated_at: string | null
}

export type ReplyRecord = {
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

export type VoteRecord = {
  id: string
  user_id: string
  target_type: 'discussion' | 'reply' | 'faq'
  target_id: string
  vote_type: 'UPVOTE' | 'DOWNVOTE'
  created_at: string
}

export type NotificationRecord = {
  id: string
  user_id: string
  type: 'MENTION' | 'REPLY' | 'VOTE' | 'FAQ_PUBLISHED' | 'REPUTATION' | 'SYSTEM' | 'MODERATION'
  title: string
  body: string
  actor_id: string | null
  target_type: string | null
  target_id: string | null
  read: boolean
  archived: boolean
  created_at: string
}

export type SavedKnowledgeRecord = {
  id: string
  user_id: string
  target_type: 'FAQ' | 'DISCUSSION' | 'QUESTION' | 'REPLY'
  target_id: string
  collection: string
  notes: string | null
  created_at: string
}

export type CollectionRecord = {
  id: string
  user_id: string
  name: string
  description: string
  color: string
  created_at: string
}

export type ReputationEventRecord = {
  id: string
  user_id: string
  delta: number
  reason: string
  source_type: string
  source_id: string | null
  created_at: string
}

export type AchievementRecord = {
  id: string
  user_id: string
  code: string
  title: string
  description: string
  icon: string
  earned_at: string
  progress: number
  target: number
}

export type ReportRecord = {
  id: string
  reporter_id: string
  target_type: 'discussion' | 'reply' | 'faq' | 'user'
  target_id: string
  reason: string
  details: string
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED'
  assigned_to: string | null
  resolution: string | null
  resolved_at: string | null
  created_at: string
}

export type ModerationActionRecord = {
  id: string
  target_user_id: string
  actor_id: string
  action: 'WARN' | 'REMOVE_CONTENT' | 'SUSPEND' | 'BAN' | 'ESCALATE'
  reason: string
  duration_days: number | null
  created_at: string
}

export type EvolutionEventRecord = {
  id: string
  faq_id: string
  event_type: 'CREATED' | 'UPDATED' | 'REVIEWED' | 'CONSENSUS_CHANGE' | 'CONTRIBUTOR_ADDED'
  description: string
  actor_id: string | null
  metadata: Record<string, string | number>
  created_at: string
}

type CrowdMindSchema = DBSchema & {
  users: { key: string; value: UserRecord; indexes: { 'by-clerk': string; 'by-email': string } }
  categories: { key: string; value: CategoryRecord; indexes: { 'by-slug': string } }
  questions: { key: string; value: QuestionRecord; indexes: { 'by-user': string; 'by-category': string } }
  faqs: { key: string; value: FaqRecord; indexes: { 'by-category': string; 'by-slug': string; 'by-published-at': string } }
  faq_versions: { key: string; value: FaqVersionRecord; indexes: { 'by-faq': string } }
  faq_candidates: { key: string; value: FaqCandidateRecord; indexes: { 'by-status': string; 'by-discussion': string } }
  discussions: { key: string; value: DiscussionRecord; indexes: { 'by-user': string; 'by-status': string; 'by-category': string } }
  replies: { key: string; value: ReplyRecord; indexes: { 'by-discussion': string; 'by-user': string } }
  votes: { key: string; value: VoteRecord; indexes: { 'by-user': string; 'by-target': [string, string] } }
  notifications: { key: string; value: NotificationRecord; indexes: { 'by-user': string; 'by-user-read': [string, string] } }
  saved: { key: string; value: SavedKnowledgeRecord; indexes: { 'by-user': string; 'by-user-target': [string, string, string] } }
  collections: { key: string; value: CollectionRecord; indexes: { 'by-user': string } }
  reputation_events: { key: string; value: ReputationEventRecord; indexes: { 'by-user': string } }
  achievements: { key: string; value: AchievementRecord; indexes: { 'by-user': string; 'by-user-code': [string, string] } }
  reports: { key: string; value: ReportRecord; indexes: { 'by-status': string; 'by-reporter': string } }
  moderation_actions: { key: string; value: ModerationActionRecord; indexes: { 'by-target-user': string } }
  evolution_events: { key: string; value: EvolutionEventRecord; indexes: { 'by-faq': string; 'by-created-at': string } }
  meta: { key: string; value: { key: string; value: string | number } }
}

const DB_NAME = 'crowdmind'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<CrowdMindSchema>> | null = null

export function getDb(): Promise<IDBPDatabase<CrowdMindSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<CrowdMindSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const users = db.createObjectStore('users', { keyPath: 'id' })
        users.createIndex('by-clerk', 'clerk_user_id', { unique: true })
        users.createIndex('by-email', 'email', { unique: false })

        const categories = db.createObjectStore('categories', { keyPath: 'id' })
        categories.createIndex('by-slug', 'slug', { unique: true })

        const questions = db.createObjectStore('questions', { keyPath: 'id' })
        questions.createIndex('by-user', 'user_id', { unique: false })
        questions.createIndex('by-category', 'category_id', { unique: false })

        const faqs = db.createObjectStore('faqs', { keyPath: 'id' })
        faqs.createIndex('by-category', 'category_id', { unique: false })
        faqs.createIndex('by-slug', 'slug', { unique: true })
        faqs.createIndex('by-published-at', 'published_at', { unique: false })

        const faqVersions = db.createObjectStore('faq_versions', { keyPath: 'id' })
        faqVersions.createIndex('by-faq', 'faq_id', { unique: false })

        const faqCandidates = db.createObjectStore('faq_candidates', { keyPath: 'id' })
        faqCandidates.createIndex('by-status', 'status', { unique: false })
        faqCandidates.createIndex('by-discussion', 'discussion_id', { unique: false })

        const discussions = db.createObjectStore('discussions', { keyPath: 'id' })
        discussions.createIndex('by-user', 'created_by', { unique: false })
        discussions.createIndex('by-status', 'status', { unique: false })
        discussions.createIndex('by-category', 'category_id', { unique: false })

        const replies = db.createObjectStore('replies', { keyPath: 'id' })
        replies.createIndex('by-discussion', 'discussion_id', { unique: false })
        replies.createIndex('by-user', 'user_id', { unique: false })

        const votes = db.createObjectStore('votes', { keyPath: 'id' })
        votes.createIndex('by-user', 'user_id', { unique: false })
        votes.createIndex('by-target', ['target_type', 'target_id'], { unique: false })

        const notifications = db.createObjectStore('notifications', { keyPath: 'id' })
        notifications.createIndex('by-user', 'user_id', { unique: false })
        notifications.createIndex('by-user-read', ['user_id', 'read'], { unique: false })

        const saved = db.createObjectStore('saved', { keyPath: 'id' })
        saved.createIndex('by-user', 'user_id', { unique: false })
        saved.createIndex('by-user-target', ['user_id', 'target_type', 'target_id'], { unique: true })

        const collections = db.createObjectStore('collections', { keyPath: 'id' })
        collections.createIndex('by-user', 'user_id', { unique: false })

        const reputation = db.createObjectStore('reputation_events', { keyPath: 'id' })
        reputation.createIndex('by-user', 'user_id', { unique: false })

        const achievements = db.createObjectStore('achievements', { keyPath: 'id' })
        achievements.createIndex('by-user', 'user_id', { unique: false })
        achievements.createIndex('by-user-code', ['user_id', 'code'], { unique: true })

        const reports = db.createObjectStore('reports', { keyPath: 'id' })
        reports.createIndex('by-status', 'status', { unique: false })
        reports.createIndex('by-reporter', 'reporter_id', { unique: false })

        const modActions = db.createObjectStore('moderation_actions', { keyPath: 'id' })
        modActions.createIndex('by-target-user', 'target_user_id', { unique: false })

        const evolution = db.createObjectStore('evolution_events', { keyPath: 'id' })
        evolution.createIndex('by-faq', 'faq_id', { unique: false })
        evolution.createIndex('by-created-at', 'created_at', { unique: false })

        db.createObjectStore('meta', { keyPath: 'key' })
      },
    })
  }
  return dbPromise
}

export async function isSeeded(): Promise<boolean> {
  const db = await getDb()
  const row = await db.get('meta', 'seeded')
  return row?.value === '1'
}

export async function markSeeded(userId: string): Promise<void> {
  const db = await getDb()
  await db.put('meta', { key: 'seeded', value: '1' })
  await db.put('meta', { key: 'seeded_for', value: userId })
}

export async function getSeededFor(): Promise<string | null> {
  const db = await getDb()
  const row = await db.get('meta', 'seeded_for')
  return typeof row?.value === 'string' ? row.value : null
}

export async function clearAll(): Promise<void> {
  const db = await getDb()
  const tx = db.transaction(
    ['users', 'categories', 'questions', 'faqs', 'faq_versions', 'faq_candidates',
     'discussions', 'replies', 'votes', 'notifications', 'saved', 'collections',
     'reputation_events', 'achievements', 'reports', 'moderation_actions',
     'evolution_events', 'meta'],
    'readwrite',
  )
  await Promise.all(
    [
      tx.objectStore('users').clear(),
      tx.objectStore('categories').clear(),
      tx.objectStore('questions').clear(),
      tx.objectStore('faqs').clear(),
      tx.objectStore('faq_versions').clear(),
      tx.objectStore('faq_candidates').clear(),
      tx.objectStore('discussions').clear(),
      tx.objectStore('replies').clear(),
      tx.objectStore('votes').clear(),
      tx.objectStore('notifications').clear(),
      tx.objectStore('saved').clear(),
      tx.objectStore('collections').clear(),
      tx.objectStore('reputation_events').clear(),
      tx.objectStore('achievements').clear(),
      tx.objectStore('reports').clear(),
      tx.objectStore('moderation_actions').clear(),
      tx.objectStore('evolution_events').clear(),
      tx.objectStore('meta').clear(),
    ],
  )
  await tx.done
}
