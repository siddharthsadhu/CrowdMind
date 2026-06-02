import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/18-analytics'
import { commonAdminNav } from '@/data/navMaps'

export default function AnalyticsPage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Platform Intelligence"
      navMap={commonAdminNav}
    />
  )
}
