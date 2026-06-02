import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/20-settings'
import { commonAdminNav } from '@/data/navMaps'

export default function SettingsPage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Settings"
      navMap={commonAdminNav}
    />
  )
}
