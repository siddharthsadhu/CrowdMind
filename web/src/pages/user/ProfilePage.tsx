import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/10-profile'
import { commonUserNav } from '@/data/navMaps'

export default function ProfilePage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | User Profile"
      navMap={{
        ...commonUserNav,
        'saved knowledge': '/saved',
        contributions: '/contributions',
        'my contributions': '/contributions',
        evolution: '/evolution',
      }}
    />
  )
}
