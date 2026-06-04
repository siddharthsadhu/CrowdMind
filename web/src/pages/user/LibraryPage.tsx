import { useStitchData } from '@/hooks/useStitchData'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/02-library'
import { commonUserNav } from '@/data/navMaps'
import { faqsApi, PublishedFaqResponse } from '@/services/api/faqs'
import { categoriesApi, CategoryResponse } from '@/services/api/categories'
import { showLoading, showError, showEmpty } from '@/utils/pageStatus'

export default function LibraryPage() {
  const navigate = useNavigate()

  useStitchData(async (root) => {
    const gridContainer = root.querySelector('.col-span-6 .grid.grid-cols-1')
    const clearLoading = gridContainer ? showLoading(gridContainer as HTMLElement) : () => {}

    let allFaqs: PublishedFaqResponse[] = []
    let categoriesList: CategoryResponse[] = []

    const categoryContainer = root.querySelector('aside .glass:first-child .flex.flex-col.gap-3') as HTMLElement | null
    if (categoryContainer) {
      try {
        categoriesList = await categoriesApi.list()
        categoryContainer.innerHTML = ''
        categoriesList.forEach((cat) => {
          const label = document.createElement('label')
          label.className = 'flex items-center gap-3 cursor-pointer group'
          label.innerHTML = `
            <input class="rounded bg-surface-container border-outline-variant text-primary focus:ring-primary ring-offset-surface-dim cm-cat-cb" type="checkbox" data-id="${cat.id}">
            <span class="font-body-md text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">${cat.name}</span>
          `
          categoryContainer.appendChild(label)
        })

        const stats = root.querySelectorAll('.flex.gap-8.border-l .font-headline-md')
        if (stats.length >= 3) {
          stats[2].textContent = categoriesList.length.toString()
        }
      } catch (err) {
        console.error('Failed to load categories', err)
      }
    }

    try {
      const res = await faqsApi.list({ page_size: '100' })
      allFaqs = res.items
      const stats = root.querySelectorAll('.flex.gap-8.border-l .font-headline-md')
      if (stats.length >= 1) {
        stats[0].textContent = allFaqs.length.toString()
      }
    } catch {
      clearLoading()
      const stats = root.querySelectorAll('.flex.gap-8.border-l .font-headline-md')
      if (stats.length >= 1) stats[0].textContent = '—'
      if (gridContainer) showError(gridContainer as HTMLElement)
      return
    }

    clearLoading()

    const template = gridContainer?.querySelector('.glass.rounded-2xl') as HTMLElement | null
    if (!template || !gridContainer) return

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

        const catObj = categoriesList.find(c => c.id === faq.category_id)
        if (categoryEl) categoryEl.textContent = catObj ? catObj.name.toUpperCase() : 'GENERAL'

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

    const searchInput = root.querySelector('input[placeholder*="Search knowledge" i], input[placeholder*="search" i]') as HTMLInputElement | null
    const sortSelect = root.querySelector('select') as HTMLSelectElement | null
    const checkboxes = Array.from(root.querySelectorAll('.cm-cat-cb')) as HTMLInputElement[]

    const applyFiltersAndSort = () => {
      let filtered = [...allFaqs]

      const query = searchInput?.value?.trim()?.toLowerCase() || ''
      if (query) {
        filtered = filtered.filter(
          (faq) =>
            faq.title.toLowerCase().includes(query) ||
            faq.content.toLowerCase().includes(query),
        )
      }

      const activeCategoryIds = checkboxes
        .filter(cb => cb.checked)
        .map(cb => cb.getAttribute('data-id'))
        .filter(Boolean) as string[]

      if (activeCategoryIds.length > 0) {
        filtered = filtered.filter((faq) => {
          return activeCategoryIds.includes(faq.category_id || '')
        })
      }

      const sortBy = sortSelect?.value || 'Most Relevant'
      if (sortBy === 'Most Viewed' || sortBy === 'Highest Confidence') {
        filtered.sort((a, b) => (b.confidence_score ?? 0) - (a.confidence_score ?? 0))
      } else if (sortBy === 'Recently Updated') {
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      } else if (sortBy === 'Most Discussed' || sortBy === 'Highest Agreement') {
        filtered.sort((a, b) => (b.community_agreement_score ?? 0) - (a.community_agreement_score ?? 0))
      }

      renderFaqs(filtered)
      const stats = root.querySelectorAll('.flex.gap-8.border-l .font-headline-md')
      if (stats.length >= 1) {
        stats[0].textContent = filtered.length.toString()
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFiltersAndSort)
    }
    if (sortSelect) {
      sortSelect.addEventListener('change', applyFiltersAndSort)
    }
    checkboxes.forEach((cb) => {
      cb.addEventListener('change', applyFiltersAndSort)
    })

    applyFiltersAndSort()
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
