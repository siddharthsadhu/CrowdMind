export type FaqItem = {
  id: string
  title: string
  category: string
  excerpt: string
  helpful: number
  views: number
  verified: boolean
  evolution: 'stable' | 'evolving' | 'candidate'
}

export const faqs: FaqItem[] = [
  {
    id: '1',
    title: 'How does CrowdMind validate community answers before FAQ promotion?',
    category: 'Platform',
    excerpt:
      'Our consensus engine weighs contributor reputation, citation density, and moderator review before elevating content.',
    helpful: 142,
    views: 3200,
    verified: true,
    evolution: 'stable',
  },
  {
    id: '2',
    title: 'What triggers an FAQ candidate review workflow?',
    category: 'Workflow',
    excerpt:
      'When an accepted answer receives sufficient upvotes and passes AI similarity checks against the knowledge base.',
    helpful: 89,
    views: 1100,
    verified: true,
    evolution: 'evolving',
  },
  {
    id: '3',
    title: 'Can guests browse discussions without signing in?',
    category: 'Access',
    excerpt: 'Yes. Public FAQ and discussion listings are readable; participation requires authentication.',
    helpful: 56,
    views: 890,
    verified: false,
    evolution: 'stable',
  },
  {
    id: '4',
    title: 'How does AI synthesis contribute to FAQ generation?',
    category: 'AI',
    excerpt: 'Explainable analysis clusters answers, surfaces citations, and proposes FAQ candidates for review.',
    helpful: 201,
    views: 4500,
    verified: true,
    evolution: 'candidate',
  },
]

export const discussions = [
  {
    id: 'd1',
    title: 'Optimizing retrieval for long-form research papers',
    replies: 24,
    signal: 'high' as const,
    author: 'Dr. Chen',
  },
  {
    id: 'd2',
    title: 'Best practices for moderator escalation',
    replies: 11,
    signal: 'medium' as const,
    author: 'Jordan K.',
  },
  {
    id: 'd3',
    title: 'Consensus thresholds for high-stakes FAQs',
    replies: 18,
    signal: 'high' as const,
    author: 'Morgan Lee',
  },
]

export const threadPosts = [
  {
    id: 'p1',
    author: 'Dr. Chen',
    role: 'Contributor',
    body: 'We should weight citation density higher when promoting to FAQ candidate status.',
    votes: 42,
    accepted: true,
  },
  {
    id: 'p2',
    author: 'Alex R.',
    role: 'Member',
    body: 'Agreed — also consider recency of sources for evolving topics.',
    votes: 18,
    accepted: false,
  },
]

export const notifications = [
  {
    id: 'n1',
    type: 'answer',
    text: 'Your answer was accepted on "FAQ candidate workflow"',
    time: '2h ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'mention',
    text: 'Alex mentioned you in Community Discussions',
    time: '5h ago',
    read: true,
  },
  {
    id: 'n3',
    type: 'review',
    text: 'Your contribution is under FAQ candidate review',
    time: '1d ago',
    read: false,
  },
]

export const moderationReports = [
  {
    id: 'r1',
    type: 'Discussion',
    target: 'Thread #d2',
    reason: 'Spam / low signal',
    status: 'pending',
    reporter: 'user_42',
  },
  {
    id: 'r2',
    type: 'Answer',
    target: 'FAQ #2 comment',
    reason: 'Misinformation',
    status: 'investigating',
    reporter: 'mod_bot',
  },
]

export const analyticsSeries = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  discussions: [120, 145, 132, 168, 190, 175, 210],
  faqsPublished: [4, 6, 5, 8, 7, 9, 11],
}

export function getFaq(id: string) {
  return faqs.find((f) => f.id === id) ?? faqs[0]
}

export function getDiscussion(id: string) {
  return discussions.find((d) => d.id === id) ?? discussions[0]
}

export function getReport(id: string) {
  return moderationReports.find((r) => r.id === id) ?? moderationReports[0]
}
