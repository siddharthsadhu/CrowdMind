import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/14-evolution'
import { commonUserNav } from '@/data/navMaps'

export default function EvolutionPage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Knowledge Evolution"
      navMap={{ ...commonUserNav, 'view faq': '/faq/2', timeline: '/library' }}
    />
  )
}
