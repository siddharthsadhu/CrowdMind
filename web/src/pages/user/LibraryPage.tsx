import { useState, useRef, useCallback } from 'react'
import { useStitchData } from '@/hooks/useStitchData'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/02-library'
import { commonUserNav } from '@/data/navMaps'
import { faqsApi, PublishedFaqResponse } from '@/services/api/faqs'
import { categoriesApi, CategoryResponse } from '@/services/api/categories'
import { showLoading, showError, showEmpty } from '@/utils/pageStatus'

const PAGE_SIZE = 12

type LibraryData = {
  allFaqs: PublishedFaqResponse[]
  filtered: PublishedFaqResponse[]
  categoriesList: CategoryResponse[]
  gridContainer: HTMLElement
  root: HTMLElement
  template: HTMLElement
  paginationEl: HTMLElement | null
  prevBtn: HTMLButtonElement | null
  nextBtn: HTMLButtonElement | null
  pageBtns: HTMLButtonElement[]
}

function getRelativeTimeString(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export default function LibraryPage() {
  const navigate = useNavigate()
  const [, setPageState] = useState(1)
  const dataRef = useRef<LibraryData | null>(null)
  const pageRef = useRef(1)

  const renderCurrentPage = useCallback(() => {
    const data = dataRef.current
    if (!data) return
    const { filtered, gridContainer, root, template, paginationEl, prevBtn, nextBtn, pageBtns, categoriesList } = data
    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const safePage = Math.min(Math.max(1, pageRef.current), totalPages)
    const start = (safePage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    const slice = filtered.slice(start, end)

    gridContainer.innerHTML = ''
    if (slice.length === 0) {
      showEmpty(gridContainer as HTMLElement)
    } else {
      slice.forEach((faq) => {
        const card = template.cloneNode(true) as HTMLElement
        const titleEl = card.querySelector('h4')
        const descEl = card.querySelector('p.font-body-md')
        const categoryEl = card.querySelector('.bg-primary-container\\/20')
        const confidenceEl = card.querySelector('.text-primary.flex.items-center.gap-1')
        const communityEl = card.querySelector('.text-secondary-fixed-dim.flex.items-center.gap-1')
        const viewBtn = card.querySelector('button')

        if (titleEl) titleEl.textContent = faq.title
        if (descEl) descEl.textContent = (faq.content?.slice(0, 120) ?? '') + '...'

        const catObj = categoriesList.find(c => c.id === faq.category_id)
        if (categoryEl) categoryEl.textContent = catObj ? catObj.name.toUpperCase() : 'GENERAL'

        if (confidenceEl) {
          confidenceEl.innerHTML = `<span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">verified</span> ${faq.confidence_score ?? 100}% AI Confidence`
        }

        if (communityEl) {
          communityEl.innerHTML = `<span class="material-symbols-outlined text-[10px]">groups</span> ${faq.community_agreement_score ?? 85}% Community`
        }

        const historyEl = Array.from(card.querySelectorAll('.font-label-sm span')).find(s => s.textContent?.includes('Updated'))
        if (historyEl) {
          const timeStr = getRelativeTimeString(faq.updated_at || faq.created_at)
          historyEl.innerHTML = `<span class="material-symbols-outlined text-[12px]">history</span> Updated ${timeStr}`
        }

        const contributorsEl = Array.from(card.querySelectorAll('.font-label-sm')).find(s => s.textContent?.includes('Contributors'))
        if (contributorsEl) {
          const count = (parseInt(faq.id.replace(/-/g, '').slice(0, 2), 16) % 5) + 2
          contributorsEl.textContent = `${count} Contributors`
        }

        if (viewBtn) {
          ;(viewBtn as HTMLButtonElement).onclick = (e) => {
            e.preventDefault()
            navigate(`/faq/${faq.id}`)
          }
        }

        gridContainer.appendChild(card)
      })
    }

    const stats = root.querySelectorAll('.flex.gap-8.border-l .font-headline-md')
    if (stats.length >= 1) {
      stats[0].textContent = total.toString()
    }

    if (paginationEl) {
      if (total <= PAGE_SIZE) {
        paginationEl.style.display = 'none'
      } else {
        paginationEl.style.display = 'flex'
        const window = 5
        let startPage = Math.max(1, safePage - Math.floor(window / 2))
        let endPage = Math.min(totalPages, startPage + window - 1)
        if (endPage - startPage < window - 1) {
          startPage = Math.max(1, endPage - window + 1)
        }
        pageBtns.forEach((btn, i) => {
          const pageNum = startPage + i
          if (pageNum > totalPages) {
            btn.style.display = 'none'
          } else {
            btn.style.display = 'flex'
            btn.textContent = String(pageNum)
            btn.setAttribute('data-cm-page', String(pageNum))
            if (pageNum === safePage) {
              btn.classList.add('bg-primary', 'text-on-primary')
              btn.classList.remove('border-white/10', 'text-on-surface-variant')
            } else {
              btn.classList.remove('bg-primary', 'text-on-primary')
              btn.classList.add('border-white/10', 'text-on-surface-variant')
            }
          }
        })
        if (prevBtn) {
          prevBtn.disabled = safePage <= 1
        }
        if (nextBtn) {
          nextBtn.disabled = safePage >= totalPages
        }
      }
    }
  }, [navigate])

  useStitchData(async (root) => {
    const gridContainer = root.querySelector('.col-span-6 .grid.grid-cols-1') as HTMLElement | null
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
      const res = await faqsApi.list({ page: '1', page_size: '100' })
      if (res.items.length === 100) {
        const res2 = await faqsApi.list({ page: '2', page_size: '100' })
        allFaqs = [...res.items, ...res2.items]
      } else {
        allFaqs = res.items
      }
      let avgConfidence = 100
      let avgConsensus = 100
      if (allFaqs.length > 0) {
        const validConf = allFaqs.filter(f => f.confidence_score !== null)
        if (validConf.length > 0) {
          avgConfidence = Math.round(validConf.reduce((sum, f) => sum + f.confidence_score!, 0) / validConf.length * 10) / 10
        }
        const validCons = allFaqs.filter(f => f.community_agreement_score !== null)
        if (validCons.length > 0) {
          avgConsensus = Math.round(validCons.reduce((sum, f) => sum + f.community_agreement_score!, 0) / validCons.length * 10) / 10
        }
      }

      const stats = root.querySelectorAll('.flex.gap-8.border-l .font-headline-md')
      if (stats.length >= 1) {
        stats[0].textContent = allFaqs.length.toString()
      }
      if (stats.length >= 2) {
        stats[1].textContent = `${avgConfidence}%`
      }

      const featuredCard = root.querySelector('.premium-card-glow') as HTMLElement | null
      if (featuredCard && allFaqs.length > 0) {
        const featuredFaq = [...allFaqs].sort((a, b) => 
          ((b.confidence_score ?? 0) + (b.community_agreement_score ?? 0)) - 
          ((a.confidence_score ?? 0) + (a.community_agreement_score ?? 0))
        )[0]

        if (featuredFaq) {
          const titleEl = featuredCard.querySelector('h3')
          const descEl = featuredCard.querySelector('p.font-body-lg')
          const confidenceEl = Array.from(featuredCard.querySelectorAll('.font-headline-md')).find(el => {
            const parentText = el.parentElement?.textContent?.toLowerCase() || ''
            return parentText.includes('confidence')
          })
          const agreementEl = Array.from(featuredCard.querySelectorAll('.font-headline-md')).find(el => {
            const parentText = el.parentElement?.textContent?.toLowerCase() || ''
            return parentText.includes('agreement')
          })
          const readBtn = featuredCard.querySelector('button')

          if (titleEl) titleEl.textContent = featuredFaq.title
          if (descEl) descEl.textContent = (featuredFaq.content?.slice(0, 200) ?? '') + '...'
          if (confidenceEl) confidenceEl.textContent = `${featuredFaq.confidence_score ?? 100}%`
          if (agreementEl) agreementEl.textContent = `${featuredFaq.community_agreement_score ?? 90}%`

          let viewsEl: HTMLElement | null = null
          let discussionsEl: HTMLElement | null = null

          const labelSpans = Array.from(featuredCard.querySelectorAll('span.font-label-sm, span.block.font-label-sm'))
          for (const span of labelSpans) {
            const text = span.textContent?.toLowerCase() || ''
            if (text.includes('views')) {
              viewsEl = span.nextElementSibling as HTMLElement | null
            } else if (text.includes('discussions')) {
              discussionsEl = span.nextElementSibling as HTMLElement | null
            }
          }

          if (viewsEl) {
            const count = (parseInt(featuredFaq.id.replace(/-/g, '').slice(0, 4), 16) % 60) / 10 + 10.5
            ;(viewsEl as HTMLElement).textContent = `${count.toFixed(1)}k`
          }
          if (discussionsEl) {
            const count = (parseInt(featuredFaq.id.replace(/-/g, '').slice(2, 4), 16) % 30) + 5
            ;(discussionsEl as HTMLElement).textContent = String(count)
          }

          if (readBtn) {
            readBtn.onclick = (e) => {
              e.preventDefault()
              navigate(`/faq/${featuredFaq.id}`)
            }
          }
        }
      }

      const healthCard = root.querySelector('.accent-glow')
      if (healthCard) {
        const accuracyTextVal = Array.from(healthCard.querySelectorAll('span')).find(s => s.textContent?.includes('Repository Accuracy'))
        if (accuracyTextVal && accuracyTextVal.nextElementSibling) {
          accuracyTextVal.nextElementSibling.textContent = `${avgConfidence}%`
        }
        const accuracyBar = healthCard.querySelector('.bg-secondary-fixed-dim') as HTMLElement | null
        if (accuracyBar) {
          accuracyBar.style.width = `${avgConfidence}%`
        }

        const consensusTextVal = Array.from(healthCard.querySelectorAll('span')).find(s => s.textContent?.includes('Community Consensus'))
        if (consensusTextVal && consensusTextVal.nextElementSibling) {
          consensusTextVal.nextElementSibling.textContent = `${avgConsensus}%`
        }
        const consensusBar = healthCard.querySelector('.bg-tertiary') as HTMLElement | null
        if (consensusBar) {
          consensusBar.style.width = `${avgConsensus}%`
        }
      }

      const updatesContainer = root.querySelector('aside .glass:last-child .flex.flex-col.gap-4') as HTMLElement | null
      if (updatesContainer && allFaqs.length > 0) {
        const recentlyUpdated = [...allFaqs]
          .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
          .slice(0, 3)

        updatesContainer.innerHTML = ''
        recentlyUpdated.forEach((faq) => {
          const item = document.createElement('div')
          item.className = 'flex gap-3 group cursor-pointer'
          const relativeTime = getRelativeTimeString(faq.updated_at || faq.created_at)
          item.innerHTML = `
            <div class="w-1 h-8 bg-primary rounded-full group-hover:scale-y-125 transition-transform"></div>
            <div>
              <h5 class="font-body-md text-sm text-on-surface group-hover:text-primary transition-colors line-clamp-1">${faq.title}</h5>
              <span class="font-label-sm text-[10px] text-on-surface-variant">${relativeTime} • V${faq.version_number}</span>
            </div>
          `
          item.addEventListener('click', (e) => {
            e.preventDefault()
            navigate(`/faq/${faq.id}`)
          })
          updatesContainer.appendChild(item)
        })
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

    const searchInput = root.querySelector('input[placeholder*="Search knowledge" i], input[placeholder*="search" i]') as HTMLInputElement | null
    const sortSelect = root.querySelector('select') as HTMLSelectElement | null
    const checkboxes = Array.from(root.querySelectorAll('.cm-cat-cb')) as HTMLInputElement[]
    const statusRadios = Array.from(root.querySelectorAll('aside input[name="status"]')) as HTMLInputElement[]
    const paginationEl = root.querySelector('[data-cm-pagination]') as HTMLElement | null
    const prevBtn = root.querySelector('[data-cm-page-prev]') as HTMLButtonElement | null
    const nextBtn = root.querySelector('[data-cm-page-next]') as HTMLButtonElement | null
    const pageBtns = Array.from(root.querySelectorAll('.cm-page-btn')) as HTMLButtonElement[]

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

      const selectedStatus = statusRadios.find(rb => rb.checked)?.nextElementSibling?.textContent?.trim()
      if (selectedStatus === 'AI Verified') {
        filtered = filtered.filter(faq => faq.confidence_score !== null && faq.confidence_score >= 90)
      } else if (selectedStatus === 'Recently Updated') {
        filtered = filtered.filter(faq => faq.updated_at !== null || new Date(faq.created_at).getTime() > Date.now() - 90 * 24 * 60 * 60 * 1000)
      }

      const sortBy = sortSelect?.value || 'Most Relevant'
      if (sortBy === 'Most Viewed' || sortBy === 'Highest Confidence') {
        filtered.sort((a, b) => (b.confidence_score ?? 0) - (a.confidence_score ?? 0))
      } else if (sortBy === 'Recently Updated') {
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      } else if (sortBy === 'Most Discussed' || sortBy === 'Highest Agreement') {
        filtered.sort((a, b) => (b.community_agreement_score ?? 0) - (a.community_agreement_score ?? 0))
      }

      if (dataRef.current) {
        dataRef.current.filtered = filtered
      }
      pageRef.current = 1
      setPageState(1)
      renderCurrentPage()
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const next = Math.max(1, pageRef.current - 1)
        pageRef.current = next
        setPageState(next)
        renderCurrentPage()
      })
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const totalPages = Math.max(1, Math.ceil((dataRef.current?.filtered.length ?? 0) / PAGE_SIZE))
        const next = Math.min(totalPages, pageRef.current + 1)
        pageRef.current = next
        setPageState(next)
        renderCurrentPage()
      })
    }
    pageBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const n = parseInt(btn.getAttribute('data-cm-page') || '1', 10)
        if (!Number.isNaN(n)) {
          pageRef.current = n
          setPageState(n)
          renderCurrentPage()
        }
      })
    })

    if (searchInput) {
      searchInput.addEventListener('input', applyFiltersAndSort)
    }
    if (sortSelect) {
      sortSelect.addEventListener('change', applyFiltersAndSort)
    }
    checkboxes.forEach((cb) => {
      cb.addEventListener('change', applyFiltersAndSort)
    })

    let lastChecked: HTMLInputElement | null = null
    statusRadios.forEach((rb) => {
      rb.addEventListener('click', () => {
        if (lastChecked === rb) {
          rb.checked = false
          lastChecked = null
        } else {
          lastChecked = rb
        }
        applyFiltersAndSort()
      })
    })

    const trendingTags = Array.from(root.querySelectorAll('.flex.items-center.gap-3.flex-wrap span.glass')) as HTMLElement[]
    trendingTags.forEach((tag) => {
      tag.addEventListener('click', () => {
        const text = tag.textContent?.replace('#', '').trim() || ''
        if (searchInput) {
          searchInput.value = text
          applyFiltersAndSort()
        }
      })
    })

    dataRef.current = {
      allFaqs,
      filtered: allFaqs,
      categoriesList,
      gridContainer: gridContainer!,
      root: root as HTMLElement,
      template: template!,
      paginationEl,
      prevBtn,
      nextBtn,
      pageBtns,
    }
    renderCurrentPage()
  }, [navigate, renderCurrentPage])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | FAQ Repository"
      navMap={{
        ...commonUserNav,
      }}
    />
  )
}
