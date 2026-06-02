import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/06-analysis'
import { commonUserNav } from '@/data/navMaps'

export default function AnalysisPage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | AI Analysis"
      navMap={{
        ...commonUserNav,
        discussion: '/discussions',
        'start discussion': '/discussions/new',
        'view discussion': '/discussions/d1',
        continue: '/discussions',
      }}
    />
  )
}
