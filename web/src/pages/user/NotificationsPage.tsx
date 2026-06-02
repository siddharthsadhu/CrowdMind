import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/11-notifications'
import { commonUserNav } from '@/data/navMaps'

export default function NotificationsPage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Notifications"
      navMap={commonUserNav}
    />
  )
}
