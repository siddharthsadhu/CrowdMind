import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/15-mission-control'
import { commonAdminNav, commonUserNav } from '@/data/navMaps'

export default function MissionControlPage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Mission Control"
      navMap={{ ...commonAdminNav, ...commonUserNav }}
    />
  )
}
