import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/03-faq-detail'
import { commonUserNav } from '@/data/navMaps'

export default function FaqDetailPage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | FAQ Detail"
      navMap={{
        ...commonUserNav,
        'related discussions': '/discussions',
        'want to participate': '/login',
        participate: '/login',
      }}
    />
  )
}
