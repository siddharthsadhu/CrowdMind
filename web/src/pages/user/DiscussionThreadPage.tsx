import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/08-thread'
import { commonUserNav } from '@/data/navMaps'

export default function DiscussionThreadPage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Discussion Thread"
      navMap={{
        ...commonUserNav,
        back: '/discussions',
        'all discussions': '/discussions',
      }}
    />
  )
}
