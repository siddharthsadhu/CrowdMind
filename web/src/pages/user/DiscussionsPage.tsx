import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/07-discussions'
import { commonUserNav } from '@/data/navMaps'

export default function DiscussionsPage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Discussions"
      navMap={{
        ...commonUserNav,
        'start a discussion': '/discussions/new',
        'new discussion': '/discussions/new',
        create: '/discussions/new',
        view: '/discussions/d1',
        thread: '/discussions/d1',
      }}
    />
  )
}
