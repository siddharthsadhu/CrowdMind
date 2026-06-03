import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/07-discussions'
import { commonUserNav } from '@/data/navMaps'
import { discussionsApi, DiscussionResponse } from '@/services/api/discussions'
import { showLoading, showError, showEmpty } from '@/utils/pageStatus'

export default function DiscussionsPage() {
  const navigate = useNavigate()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const timer = setTimeout(async () => {
      const root = document.querySelector('.stitch-page-root')
      if (!root) return

      const feed = root.querySelector('.lg\\:col-span-8.space-y-6')
      if (!feed) return

      const clearLoading = showLoading(feed as HTMLElement)

      let discussions: DiscussionResponse[] = []
      try {
        const res = await discussionsApi.list({ page_size: '50' })
        discussions = res.items
      } catch {
        clearLoading()
        showError(feed as HTMLElement)
        return
      }

      clearLoading()

      const template = feed.querySelector('article.glass-card') as HTMLElement | null
      if (!template) return

      const renderDiscussions = (items: DiscussionResponse[]) => {
        feed.innerHTML = ''
        if (items.length === 0) {
          showEmpty(feed as HTMLElement)
          return
        }

        items.forEach((d) => {
          const card = template.cloneNode(true) as HTMLElement
          const titleEl = card.querySelector('h3')
          const metricsEl = card.querySelector('.border-y')
          const viewBtn = card.querySelector('.quick-actions button:last-child')
          const badgeEl = card.querySelector('.font-label-sm.text-label-sm.bg-primary-container\\/10')
          const confidenceEl = card.querySelector('.text-headline-md.text-primary')

          if (titleEl) titleEl.textContent = d.title
          
          if (badgeEl) {
            badgeEl.textContent = d.question_id ? 'AI Escalated' : 'Community Discussion'
          }

          if (confidenceEl) {
            confidenceEl.textContent = d.consensus_score ? `${Math.round(d.consensus_score * 100)}%` : '75%'
          }

          if (metricsEl) {
            const spans = metricsEl.querySelectorAll('span:not(.material-symbols-outlined)')
            if (spans.length >= 3) {
              spans[0].textContent = d.reply_count.toString()
              spans[1].textContent = `${d.view_count}`
              spans[2].textContent = `${d.participant_count} unique`
            }
          }

          // Card Click Action
          card.style.cursor = 'pointer'
          card.addEventListener('click', (e) => {
            const target = e.target as HTMLElement
            if (target.closest('.quick-actions') || target.tagName === 'BUTTON') return
            navigate(`/discussions/${d.id}`)
          })

          if (viewBtn) {
            (viewBtn as HTMLButtonElement).onclick = (e) => {
              e.stopPropagation()
              navigate(`/discussions/${d.id}`)
            }
          }

          feed.appendChild(card)
        })
      }

      // Wire Search & Tabs
      const searchInput = root.querySelector('input[placeholder*="Search discussions" i]') as HTMLInputElement | null
      const tabBtns = Array.from(root.querySelectorAll('.flex.flex-wrap.gap-2 button')) as HTMLButtonElement[]
      let activeTab = 'All Discussions'

      const applyFilters = () => {
        let filtered = [...discussions]

        // 1. Search Query
        const query = searchInput?.value?.trim()?.toLowerCase() || ''
        if (query) {
          filtered = filtered.filter(
            (d) =>
              d.title.toLowerCase().includes(query) ||
              (d.description && d.description.toLowerCase().includes(query))
          )
        }

        // 2. Tab filtering
        const tab = activeTab.toLowerCase()
        if (tab.includes('open')) {
          filtered = filtered.filter(d => d.status === 'OPEN')
        } else if (tab.includes('answered')) {
          filtered = filtered.filter(d => d.status === 'RESOLVED' || d.status === 'COMPLETED')
        } else if (tab.includes('trending')) {
          filtered = filtered.filter(d => d.reply_count > 1 || d.view_count > 50)
          filtered.sort((a, b) => b.view_count - a.view_count)
        } else if (tab.includes('ai escalated')) {
          filtered = filtered.filter(d => d.question_id !== null)
        }

        renderDiscussions(filtered)
      }

      if (searchInput) {
        searchInput.addEventListener('input', applyFilters)
      }

      tabBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault()
          tabBtns.forEach((b) => {
            b.className = 'px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant font-label-sm text-label-sm transition-colors'
          })
          btn.className = 'px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm'
          activeTab = btn.textContent?.trim() || 'All Discussions'
          applyFilters()
        })
      })

      // Initial Render
      applyFilters()

    }, 100)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Discussions"
      navMap={{
        ...commonUserNav,
        'start discussion': '/discussions/new',
        'open questions': '/discussions',
        answered: '/discussions',
        trending: '/discussions',
        'ai escalated': '/discussions',
      }}
    />
  )
}
