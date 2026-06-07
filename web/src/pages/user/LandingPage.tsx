import { useStitchData } from '@/hooks/useStitchData'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/01-landing'
import { commonUserNav } from '@/data/navMaps'
import { statsApi } from '@/services/api/stats'
import { discussionsApi } from '@/services/api/discussions'
import { categoriesApi, CategoryResponse } from '@/services/api/categories'
import { showLoading, showError } from '@/utils/pageStatus'
import { useAuth } from '@/context/AuthContext'

function formatStat(value: number, kind: 'count' | 'percent'): string {
  if (kind === 'percent') return `${value}%`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M+`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k+`
  return `${value}`
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { role } = useAuth()

  useStitchData(async (root) => {
    const statsRow = root.querySelector('.grid.grid-cols-2.lg\\:grid-cols-4')
    const clearLoading = statsRow ? showLoading(statsRow as HTMLElement) : () => {}

    let categoriesList: CategoryResponse[] = []
    try {
      categoriesList = await categoriesApi.list()
    } catch (err) {
      console.error('categories load failed', err)
    }

    try {
      const summary = await statsApi.getSummary()
      clearLoading()
      
      const statsCards = Array.from(root.querySelectorAll('section.py-12 .glass-card'))
      if (statsCards.length >= 4) {
        const setCardStat = (cardIndex: number, value: string) => {
          const valEl = statsCards[cardIndex].querySelector('.font-display, .text-4xl, div:first-child')
          if (valEl) valEl.textContent = value
        }
        setCardStat(0, formatStat(summary.total_faqs, 'count'))
        setCardStat(1, formatStat(summary.total_discussions, 'count'))
        setCardStat(2, formatStat(summary.resolution_rate, 'percent'))
        setCardStat(3, formatStat(summary.total_users, 'count'))
      }
    } catch (err) {
      console.error('stats load failed', err)
      clearLoading()
      if (statsRow) showError(statsRow as HTMLElement)
    }

    try {
      const faqGrid = root.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-8')
      if (faqGrid) {
        const faqRes = await statsApi.getTrendingFaqs(3)
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
                const conf = faq.confidence_score != null ? Math.round(faq.confidence_score) : null
                viewsEl.innerHTML = `<span class="material-symbols-outlined text-sm">verified</span> ${conf ?? 100}% AI Confidence`
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
  }, [navigate])

  const ctaStartPath = role === 'guest' ? '/login' : '/ask'
  const learnPath = '/methodology'

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Cognitive Clarity in Crowd Intelligence"
      navMap={{
        ...commonUserNav,
        // Overrides (must come AFTER commonUserNav spread — last write wins in JS)
        'get started now': ctaStartPath,
        'learn our methodology': learnPath,
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
