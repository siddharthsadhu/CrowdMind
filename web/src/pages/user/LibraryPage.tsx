import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/02-library'
import { commonUserNav } from '@/data/navMaps'
import { faqsApi, PublishedFaqResponse } from '@/services/api/faqs'
import { showLoading, showError, showEmpty } from '@/utils/pageStatus'

export default function LibraryPage() {
  const navigate = useNavigate()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const timer = setTimeout(async () => {
      const root = document.querySelector('.stitch-page-root')
      if (!root) return

      const totalFaqEl = root.querySelector('.border-l\\.pl-8 .flex-col:nth-child(1) .font-headline-md')
      const gridContainer = root.querySelector('.col-span-6 .grid.grid-cols-1')

      if (totalFaqEl) totalFaqEl.textContent = 'Loading...'
      const clearLoading = gridContainer ? showLoading(gridContainer as HTMLElement) : () => {}

      let faqs: PublishedFaqResponse[] = []
      try {
        const res = await faqsApi.list({ page_size: '20' })
        faqs = res.items
        if (totalFaqEl) totalFaqEl.textContent = res.total.toString()
      } catch {
        clearLoading()
        if (totalFaqEl) totalFaqEl.textContent = '—'
        if (gridContainer) showError(gridContainer as HTMLElement)
        return
      }

      clearLoading()

      if (gridContainer && faqs.length > 0) {
        const template = gridContainer.querySelector('.glass.rounded-2xl')
        if (!template) return

        gridContainer.innerHTML = ''

        faqs.forEach((faq) => {
          const card = template.cloneNode(true) as HTMLElement
          const titleEl = card.querySelector('h4')
          const descEl = card.querySelector('p.font-body-md')
          const categoryEl = card.querySelector('.bg-primary-container\\/20')
          const confidenceEl = card.querySelector('.text-primary.flex.items-center.gap-1')
          const viewBtn = card.querySelector('button')

          if (titleEl) titleEl.textContent = faq.title
          if (descEl) descEl.textContent = (faq.content?.slice(0, 120) ?? '') + '...'
          if (categoryEl) categoryEl.textContent = faq.category_id ?? 'General'
          if (confidenceEl) {
            confidenceEl.innerHTML = `<span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">verified</span> ${faq.confidence_score ?? '—'}% AI Confidence`
          }
          if (viewBtn) {
            (viewBtn as HTMLButtonElement).onclick = () => navigate(`/faq/${faq.id}`)
          }

          gridContainer.appendChild(card)
        })
      } else if (gridContainer) {
        showEmpty(gridContainer as HTMLElement)
      }

    }, 100)

    return () => clearTimeout(timer)
  }, [navigate])

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
