/** Stitch screen IDs and static HTML refs (pixel source of truth) */
export const STITCH_HTML = {
  landing: '/stitch-ref/01-landing.html',
  library: '/stitch-ref/02-library.html',
  faqDetail: '/stitch-ref/03-faq-detail.html',
  auth: '/stitch-ref/04-auth.html',
  ask: '/stitch-ref/05-ask.html',
  analysis: '/stitch-ref/06-analysis.html',
  discussions: '/stitch-ref/07-discussions.html',
  thread: '/stitch-ref/08-thread.html',
  createDiscussion: '/stitch-ref/09-create-discussion.html',
  profile: '/stitch-ref/10-profile.html',
  notifications: '/stitch-ref/11-notifications.html',
  saved: '/stitch-ref/12-saved.html',
  contributions: '/stitch-ref/13-contributions.html',
  evolution: '/stitch-ref/14-evolution.html',
  missionControl: '/stitch-ref/15-mission-control.html',
  faqMgmt: '/stitch-ref/16-faq-mgmt.html',
  moderation: '/stitch-ref/17-moderation.html',
  analytics: '/stitch-ref/18-analytics.html',
  report: '/stitch-ref/19-report.html',
  settings: '/stitch-ref/20-settings.html',
  /** Admin drill-down from FAQ Management (not part of frozen 20) */
  faqCandidateReview: '/stitch-ref/21-faq-candidate-review.html',
} as const

export type StitchHtmlKey = keyof typeof STITCH_HTML
