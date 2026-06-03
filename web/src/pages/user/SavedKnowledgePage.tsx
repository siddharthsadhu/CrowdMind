import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/12-saved'
import { commonUserNav } from '@/data/navMaps'
import { faqsApi, PublishedFaqResponse } from '@/services/api/faqs'
import { showLoading, showError, showEmpty } from '@/utils/pageStatus'

export default function SavedKnowledgePage() {
  const navigate = useNavigate()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const timer = setTimeout(async () => {
      const root = document.querySelector('.stitch-page-root')
      if (!root) return

      const savedGrid = root.querySelector('.grid.gap-6')
      if (!savedGrid) return

      const clearLoading = showLoading(savedGrid as HTMLElement)

      const loadSavedFaqs = async () => {
        const savedIds = JSON.parse(localStorage.getItem('saved-faqs') || '[]') as string[]
        
        // Update Saved FAQs counter card in header
        const savedFaqCountEl = root.querySelector('.glass-card .text-primary.text-headline-lg')
        if (savedFaqCountEl) savedFaqCountEl.textContent = savedIds.length.toString()

        if (savedIds.length === 0) {
          clearLoading()
          showEmpty(savedGrid as HTMLElement)
          return
        }

        try {
          const faqPromises = savedIds.map((id) => faqsApi.getById(id).catch(() => null))
          const resolved = await Promise.all(faqPromises)
          const validFaqs = resolved.filter(Boolean) as PublishedFaqResponse[]

          clearLoading()

          if (validFaqs.length === 0) {
            showEmpty(savedGrid as HTMLElement)
            return
          }

          const template = savedGrid.querySelector('.glass-card') as HTMLElement | null
          if (!template) return

          savedGrid.innerHTML = ''

          validFaqs.forEach((faq) => {
            const card = template.cloneNode(true) as HTMLElement
            const titleEl = card.querySelector('h4')
            const descEl = card.querySelector('p.font-body-md')
            const catTag = card.querySelector('.bg-primary\\/10')
            const confidenceEl = card.querySelector('.text-primary.font-bold')
            const agreementEl = card.querySelector('.text-secondary-fixed.font-bold, .text-on-surface-variant.font-bold')
            const buttons = card.querySelectorAll('button')

            if (titleEl) titleEl.textContent = faq.title
            if (descEl) descEl.textContent = (faq.content?.slice(0, 120) ?? '') + '...'
            if (catTag) catTag.textContent = faq.category_id ? faq.category_id.toUpperCase() : 'GENERAL'
            if (confidenceEl) confidenceEl.textContent = `${faq.confidence_score ?? 100}%`
            if (agreementEl) agreementEl.textContent = `${faq.community_agreement_score ?? 90}%`

            // Open Button (index 0)
            if (buttons[0]) {
              buttons[0].onclick = (e) => {
                e.preventDefault()
                navigate(`/faq/${faq.id}`)
              }
            }

            // Remove/Delete Button (index 2)
            if (buttons[2]) {
              buttons[2].onclick = (e) => {
                e.preventDefault()
                const newSaved = savedIds.filter((sid) => sid !== faq.id)
                localStorage.setItem('saved-faqs', JSON.stringify(newSaved))
                loadSavedFaqs()
              }
            }

            savedGrid.appendChild(card)
          })
        } catch {
          clearLoading()
          showError(savedGrid as HTMLElement)
        }
      }

      loadSavedFaqs()
    }, 100)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Saved Knowledge"
      navMap={{ ...commonUserNav, profile: '/home', open: '/faq/1' }}
    />
  )
}
