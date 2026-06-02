import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/04-auth'
import { commonUserNav } from '@/data/navMaps'

export default function LoginPage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Sign In"
      navMap={commonUserNav}
      onAuthSubmit
    />
  )
}
