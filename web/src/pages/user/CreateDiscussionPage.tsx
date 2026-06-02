import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/09-create-discussion'
import { commonUserNav } from '@/data/navMaps'

export default function CreateDiscussionPage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Create Discussion"
      navMap={{
        ...commonUserNav,
        publish: '/discussions/d1',
        submit: '/discussions/d1',
        cancel: '/discussions',
      }}
    />
  )
}
