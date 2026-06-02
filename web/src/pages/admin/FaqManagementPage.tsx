import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/16-faq-mgmt'
import { commonAdminNav } from '@/data/navMaps'
import { faqsApi } from '@/services/api/faqs'

export default function FaqManagementPage() {
  const navigate = useNavigate()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const timer = setTimeout(async () => {
      const root = document.querySelector('.stitch-page-root')
      if (!root) return

      try {
        const [faqRes, candRes] = await Promise.all([
          faqsApi.list({ page_size: '5' }),
          faqsApi.candidates.list({ page_size: '5' }),
        ])

        const publishedEl = root.querySelector('[class*="grid"] .glass-card')
        if (publishedEl && faqRes.items.length > 0) {
          const titleEl = publishedEl.querySelector('.font-headline-md')
          const statusEl = publishedEl.querySelector('.text-label-sm.rounded')
          if (titleEl) titleEl.textContent = faqRes.items[0].title
          if (statusEl) statusEl.textContent = `v${faqRes.items[0].version_number}`
        }

        const candidateSection = root.querySelectorAll('.glass-card')
        if (candidateSection.length > 1 && candRes.items.length > 0) {
          const cand = candRes.items[0]
          const candCard = candidateSection[candidateSection.length - 1]
          const titleEl = candCard.querySelector('.font-headline-md')
          const statusEl = candCard.querySelector('.text-label-sm.rounded')
          if (titleEl) titleEl.textContent = cand.title
          if (statusEl) statusEl.textContent = cand.status
        }
      } catch {
        // keep static
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [navigate])

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
