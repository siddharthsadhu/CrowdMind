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

      let allFaqs: PublishedFaqResponse[] = []
      try {
        const res = await faqsApi.list({ page_size: '100' }) // Fetch up to 100 FAQs for rich local filter
        allFaqs = res.items
        if (totalFaqEl) totalFaqEl.textContent = allFaqs.length.toString()
      } catch {
        clearLoading()
        if (totalFaqEl) totalFaqEl.textContent = '—'
        if (gridContainer) showError(gridContainer as HTMLElement)
        return
      }

      clearLoading()

      const template = gridContainer?.querySelector('.glass.rounded-2xl') as HTMLElement | null
      if (!template || !gridContainer) return

      // Helper function to render a list of FAQs
      const renderFaqs = (items: PublishedFaqResponse[]) => {
        gridContainer.innerHTML = ''
        if (items.length === 0) {
          showEmpty(gridContainer as HTMLElement)
          return
        }

        items.forEach((faq) => {
          const card = template.cloneNode(true) as HTMLElement
          const titleEl = card.querySelector('h4')
          const descEl = card.querySelector('p.font-body-md')
          const categoryEl = card.querySelector('.bg-primary-container\\/20')
          const confidenceEl = card.querySelector('.text-primary.flex.items-center.gap-1')
          const viewBtn = card.querySelector('button')

          if (titleEl) titleEl.textContent = faq.title
          if (descEl) descEl.textContent = (faq.content?.slice(0, 120) ?? '') + '...'
          if (categoryEl) categoryEl.textContent = faq.category_id ? faq.category_id.toUpperCase() : 'GENERAL'
          if (confidenceEl) {
            confidenceEl.innerHTML = `<span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">verified</span> ${faq.confidence_score ?? 100}% AI Confidence`
          }
          if (viewBtn) {
            (viewBtn as HTMLButtonElement).onclick = (e) => {
              e.preventDefault()
              navigate(`/faq/${faq.id}`)
            }
          }

          gridContainer.appendChild(card)
        })
      }

      // Wire up Filter & Sort interactions
      const searchInput = root.querySelector('input[placeholder*="Search knowledge" i], input[placeholder*="search" i]') as HTMLInputElement | null
      const sortSelect = root.querySelector('select') as HTMLSelectElement | null
      const checkboxes = Array.from(root.querySelectorAll('aside input[type="checkbox"]')) as HTMLInputElement[]

      const applyFiltersAndSort = () => {
        let filtered = [...allFaqs]

        // 1. Search Query Filter
        const query = searchInput?.value?.trim()?.toLowerCase() || ''
        if (query) {
          filtered = filtered.filter(
            (faq) =>
              faq.title.toLowerCase().includes(query) ||
              faq.content.toLowerCase().includes(query)
          )
        }

        // 2. Category Checkboxes Filter
        const activeCategories: string[] = []
        checkboxes.forEach((cb) => {
          if (cb.checked) {
            const labelText = cb.parentElement?.textContent?.trim()?.toLowerCase() || ''
            if (labelText.includes('internship')) activeCategories.push('internship')
            if (labelText.includes('team formation')) activeCategories.push('team-formation')
            if (labelText.includes('vibe')) activeCategories.push('vibe')
            if (labelText.includes('rosetta')) activeCategories.push('rosetta')
          }
        })

        if (activeCategories.length > 0) {
          filtered = filtered.filter((faq) => {
            const cat = (faq.category_id || '').toLowerCase()
            return activeCategories.some((ac) => cat.includes(ac))
          })
        }

        // 3. Sorting select
        const sortBy = sortSelect?.value || 'Most Relevant'
        if (sortBy === 'Most Viewed' || sortBy === 'Highest Confidence') {
          filtered.sort((a, b) => (b.confidence_score ?? 0) - (a.confidence_score ?? 0))
        } else if (sortBy === 'Recently Updated') {
          filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        } else if (sortBy === 'Most Discussed' || sortBy === 'Highest Agreement') {
          filtered.sort((a, b) => (b.community_agreement_score ?? 0) - (a.community_agreement_score ?? 0))
        }

        renderFaqs(filtered)
        if (totalFaqEl) totalFaqEl.textContent = filtered.length.toString()
      }

      // Add event listeners
      if (searchInput) {
        searchInput.addEventListener('input', applyFiltersAndSort)
      }
      if (sortSelect) {
        sortSelect.addEventListener('change', applyFiltersAndSort)
      }
      checkboxes.forEach((cb) => {
        cb.addEventListener('change', applyFiltersAndSort)
      })

      // Initial Render
      applyFiltersAndSort()

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
