import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/21-faq-candidate-review'
import { commonAdminNav } from '@/data/navMaps'

export default function FaqCandidateReviewPage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | FAQ Candidate Review"
      navMap={{
        ...commonAdminNav,
        'approve faq': '/admin/faq',
        'edit faq': '/admin/faq',
        'reject faq': '/admin/faq',
        'request more discussion': '/discussions',
        'view detailed audit log': '/admin/faq',
        faqs: '/library',
        discussions: '/discussions',
        'ask question': '/ask',
        analytics: '/admin/analytics',
      }}
    />
  )
}
