import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/02-library'
import { commonUserNav } from '@/data/navMaps'

export default function LibraryPage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | FAQ Repository"
      navMap={{
        ...commonUserNav,
        'view details': '/faq/1',
        read: '/faq/1',
      }}
    />
  )
}
