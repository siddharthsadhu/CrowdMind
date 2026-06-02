import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/19-report'
import { commonAdminNav } from '@/data/navMaps'

export default function ReportInvestigationPage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Report Investigation"
      navMap={{
        ...commonAdminNav,
        queue: '/admin/moderation',
        'moderation queue': '/admin/moderation',
        dismiss: '/admin/moderation',
        approve: '/admin/moderation',
      }}
    />
  )
}
