import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/04-auth'
import { commonUserNav } from '@/data/navMaps'

export default function RegisterPage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Register"
      navMap={{
        ...commonUserNav,
        'sign in': '/login',
        'already have': '/login',
      }}
      onAuthSubmit
    />
  )
}
