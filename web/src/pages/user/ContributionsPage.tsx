import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/13-contributions'
import { commonUserNav } from '@/data/navMaps'

export default function ContributionsPage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | My Contributions"
      navMap={{ ...commonUserNav, profile: '/home', view: '/faq/1' }}
    />
  )
}
