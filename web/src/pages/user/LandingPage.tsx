import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/01-landing'
import { commonUserNav } from '@/data/navMaps'

export default function LandingPage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Landing"
      navMap={{
        ...commonUserNav,
        'explore knowledge': '/library',
        'join the collective': '/login',
        trending: '/library',
      }}
    />
  )
}
