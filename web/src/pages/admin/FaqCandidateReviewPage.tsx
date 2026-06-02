import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/21-faq-candidate-review'
import { commonAdminNav } from '@/data/navMaps'
import { faqsApi } from '@/services/api/faqs'

export default function FaqCandidateReviewPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const timer = setTimeout(async () => {
      if (!id) return
      const root = document.querySelector('.stitch-page-root')
      if (!root) return

      try {
        const cand = await faqsApi.candidates.getById(id)
        const titleEl = root.querySelector('h1')
        const contentEl = root.querySelector('.glass-card.p-8 .font-body-lg')
        const confidenceEl = root.querySelector('.text-primary.font-label-md')

        if (titleEl) titleEl.textContent = cand.title
        if (contentEl) contentEl.textContent = cand.content
        if (confidenceEl) confidenceEl.textContent = `${cand.confidence_score ?? '—'}%`

        const approveBtn = Array.from(root.querySelectorAll('button')).find(
          (b) => b.textContent?.trim() === 'Approve & Publish',
        )
        if (approveBtn) {
          (approveBtn as HTMLButtonElement).onclick = async () => {
            const slug = cand.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now()
            try {
              await faqsApi.publishFromCandidate({ candidate_id: id, slug, title: cand.title, content: cand.content })
              navigate('/admin/faq')
            } catch { /* ignore */ }
          }
        }
      } catch {
        // keep static
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [id, navigate])

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
