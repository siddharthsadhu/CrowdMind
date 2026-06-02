import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/17-moderation'
import { commonAdminNav } from '@/data/navMaps'

export default function ModerationPage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Moderation Queue"
      navMap={{
        ...commonAdminNav,
        investigate: '/admin/reports/r1',
        review: '/admin/reports/r1',
        open: '/admin/reports/r1',
      }}
    />
  )
}
