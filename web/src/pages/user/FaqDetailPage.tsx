import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/03-faq-detail'
import { commonUserNav } from '@/data/navMaps'
import { faqsApi } from '@/services/api/faqs'

export default function FaqDetailPage() {
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
        const faq = await faqsApi.getById(id)
        const title = faq.title
        document.title = `CrowdMind | ${title}`

        const titleEl = root.querySelector('h1')
        const catEl = root.querySelector('.bg-primary\\/10.text-primary.font-label-sm')
        const verEl = root.querySelector('.bg-surface-container-highest.text-on-surface-variant.font-label-sm:last-child')
        const contentEl = root.querySelector('.glass-card.p-10 .font-body-lg')
        const confidenceVal = root.querySelector('.space-y-2:nth-child(1) .text-primary.font-label-md')
        const confidenceBar = root.querySelector('.space-y-2:nth-child(1) .bg-primary')
        const agreementVal = root.querySelector('.space-y-2:nth-child(2) .text-secondary-fixed-dim.font-label-md')
        const agreementBar = root.querySelector('.space-y-2:nth-child(2) .bg-secondary-fixed-dim')

        if (titleEl) titleEl.textContent = title
        if (catEl) catEl.textContent = faq.category_id ?? 'General'
        if (verEl) verEl.textContent = `v${faq.version_number}`
        if (contentEl) contentEl.textContent = faq.content
        if (confidenceVal) confidenceVal.textContent = `${faq.confidence_score ?? '—'}%`
        if (confidenceBar) {
          const w = confidenceBar.parentElement
          if (w) (confidenceBar as HTMLElement).style.width = `${faq.confidence_score ?? 0}%`
        }
        if (agreementVal) agreementVal.textContent = `${faq.community_agreement_score ?? '—'}%`
        if (agreementBar) {
          const w = agreementBar.parentElement
          if (w) (agreementBar as HTMLElement).style.width = `${faq.community_agreement_score ?? 0}%`
        }
      } catch {
        // FAQ not found — keep static content
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [id, navigate])

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
