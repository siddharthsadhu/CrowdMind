import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/16-faq-mgmt'
import { commonAdminNav } from '@/data/navMaps'

export default function FaqManagementPage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | FAQ Management"
      navMap={{
        ...commonAdminNav,
        publish: '/admin/faq',
        review: '/admin/faq-review/1024',
        candidate: '/admin/faq-review/1024',
        'approve faq': '/admin/faq-review/1024',
      }}
    />
  )
}
