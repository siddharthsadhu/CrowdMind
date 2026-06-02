import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/12-saved'
import { commonUserNav } from '@/data/navMaps'

export default function SavedKnowledgePage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Saved Knowledge"
      navMap={{ ...commonUserNav, profile: '/home', open: '/faq/1' }}
    />
  )
}
