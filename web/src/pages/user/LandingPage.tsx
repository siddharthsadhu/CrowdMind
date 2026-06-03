import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/01-landing'
import { commonUserNav } from '@/data/navMaps'
import { analyticsApi } from '@/services/api/analytics'
import { faqsApi } from '@/services/api/faqs'
import { discussionsApi } from '@/services/api/discussions'
import { categoriesApi, CategoryResponse } from '@/services/api/categories'
import { showLoading, showError } from '@/utils/pageStatus'

export default function LandingPage() {
  const navigate = useNavigate()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const timer = setTimeout(async () => {
      const root = document.querySelector('.stitch-page-root')
      if (!root) return

      const statsRow = root.querySelector('.grid.grid-cols-2.md\\:grid-cols-4')
      const clearLoading = statsRow ? showLoading(statsRow as HTMLElement) : () => {}

      let categoriesList: CategoryResponse[] = []
      try {
        categoriesList = await categoriesApi.list()
      } catch (err) {
        console.error(err)
      }

      try {
        const dash = await analyticsApi.getDashboard()
        clearLoading()
        const stats = root.querySelectorAll('.glass-card .font-headline-md')
        if (stats.length >= 4) {
          stats[0].textContent = dash.total_faqs.toString()
          stats[1].textContent = dash.total_discussions.toString()
          stats[2].textContent = dash.total_questions.toString()
          stats[3].textContent = dash.total_users.toString()
        }
      } catch {
        clearLoading()
        if (statsRow) showError(statsRow as HTMLElement)
      }

      // Populate Trending FAQs dynamically
      try {
        const faqGrid = root.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-8')
        if (faqGrid) {
          const faqRes = await faqsApi.list({ page_size: '3' })
          if (faqRes.items.length > 0) {
            const template = faqGrid.querySelector('.glass-card')
            if (template) {
              faqGrid.innerHTML = ''
              faqRes.items.forEach((faq) => {
                const card = template.cloneNode(true) as HTMLElement
                const titleEl = card.querySelector('h3')
                const categoryEl = card.querySelector('.text-primary.font-label-sm')
                const viewsEl = card.querySelector('.flex.items-center.gap-2')

                if (titleEl) titleEl.textContent = faq.title
                
                const catObj = categoriesList.find(c => c.id === faq.category_id)
                if (categoryEl) categoryEl.textContent = catObj ? catObj.name.toUpperCase() : 'GENERAL'
                
                if (viewsEl) {
                  viewsEl.innerHTML = `<span class="material-symbols-outlined text-sm">verified</span> ${faq.confidence_score ?? 100}% AI Confidence`
                }
                card.style.cursor = 'pointer'
                card.onclick = () => navigate(`/faq/${faq.id}`)
                faqGrid.appendChild(card)
              })
            }
          }
        }
      } catch (err) {
        console.error('Failed to load trending FAQs', err)
      }

      // Populate Active Discussions dynamically
      try {
        const discGrid = root.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-gutter')
        if (discGrid) {
          const discRes = await discussionsApi.list({ page_size: '2' })
          if (discRes.items.length > 0) {
            const template = discGrid.querySelector('.glass-card')
            if (template) {
              discGrid.innerHTML = ''
              discRes.items.forEach((d) => {
                const card = template.cloneNode(true) as HTMLElement
                const tagEl = card.querySelector('.font-label-sm.text-tertiary-container')
                const replyCountEl = card.querySelector('.flex.items-center.gap-2 span + span')
                const titleEl = card.querySelector('h4')
                const progressEl = card.querySelector('.h-full.bg-primary-container') as HTMLElement | null

                if (tagEl) tagEl.textContent = `DISCUSSION #${d.id.slice(0, 4).toUpperCase()}`
                if (replyCountEl) replyCountEl.textContent = `${d.reply_count} replies`
                if (titleEl) titleEl.textContent = d.title
                if (progressEl) {
                  progressEl.style.width = `${d.consensus_score ?? 50}%`
                }
                card.style.cursor = 'pointer'
                card.onclick = () => navigate(`/discussions/${d.id}`)
                discGrid.appendChild(card)
              })
            }
          }
        }
      } catch (err) {
        console.error('Failed to load active discussions', err)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Landing"
      navMap={{
        ...commonUserNav,
        'read more': '/library',
        'learn more': '/evolution',
        features: '/',
        integrations: '/',
        leaderboard: '/',
        contributors: '/',
        api: '/',
        'help center': '/',
      }}
    />
  )
}
