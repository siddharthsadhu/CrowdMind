import { useStitchData } from '@/hooks/useStitchData'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/12-saved'
import { commonUserNav } from '@/data/navMaps'
import { faqsApi, PublishedFaqResponse } from '@/services/api/faqs'
import { discussionsApi, DiscussionResponse } from '@/services/api/discussions'
import { categoriesApi } from '@/services/api/categories'
import { savedApi, SavedItem } from '@/services/api/saved'
import { showLoading, showError, showEmpty } from '@/utils/pageStatus'

type EnrichedItem =
  | { kind: 'faq'; saved: SavedItem; detail: PublishedFaqResponse | null }
  | { kind: 'discussion'; saved: SavedItem; detail: DiscussionResponse | null }

export default function SavedKnowledgePage() {
  const navigate = useNavigate()

  useStitchData(async (root) => {
    const savedGrid = root.querySelector('.grid.gap-6')
    if (!savedGrid) return

    const clearLoading = showLoading(savedGrid as HTMLElement)

    const load = async () => {
      let items: SavedItem[] = []
      try {
        const list = await savedApi.list()
        items = list.items
      } catch {
        clearLoading()
        showError(savedGrid as HTMLElement)
        return
      }

      const savedFaqCountEl = root.querySelector('.glass-card .text-primary.text-headline-lg')
      if (savedFaqCountEl) savedFaqCountEl.textContent = items.length.toString()

      if (items.length === 0) {
        clearLoading()
        showEmpty(savedGrid as HTMLElement)
        return
      }

      try {
        const enriched: EnrichedItem[] = await Promise.all(
          items.map(async (s) => {
            if (s.target_type === 'FAQ') {
              const d = await faqsApi.getById(s.target_id).catch(() => null)
              return { kind: 'faq', saved: s, detail: d }
            }
            if (s.target_type === 'DISCUSSION') {
              const d = await discussionsApi.getById(s.target_id).catch(() => null)
              return { kind: 'discussion', saved: s, detail: d }
            }
            return { kind: 'faq', saved: s, detail: null }
          })
        )

        const categories = await categoriesApi.list().catch(() => [])

        clearLoading()

        if (enriched.length === 0) {
          showEmpty(savedGrid as HTMLElement)
          return
        }

        const template = savedGrid.querySelector('.glass-card') as HTMLElement | null
        if (!template) return

        savedGrid.innerHTML = ''

        enriched.forEach((item) => {
          const card = template.cloneNode(true) as HTMLElement
          const titleEl = card.querySelector('h4')
          const descEl = card.querySelector('p.font-body-md')
          const catTag = card.querySelector('.bg-primary\\/10')
          const confidenceEl = card.querySelector('.text-primary.font-bold')
          const agreementEl = card.querySelector('.text-secondary-fixed.font-bold, .text-on-surface-variant.font-bold')
          const buttons = card.querySelectorAll('button')

          const title = item.kind === 'faq'
            ? (item.detail?.title ?? '(deleted FAQ)')
            : (item.detail?.title ?? '(deleted discussion)')
          const desc = item.kind === 'faq'
            ? ((item.detail?.content ?? '').slice(0, 120) + '...')
            : ((item.detail?.description ?? '').slice(0, 120) + '...')

          if (titleEl) titleEl.textContent = title
          if (descEl) descEl.textContent = desc

          const catObj = item.kind === 'faq' && item.detail?.category_id
            ? categories.find(c => c.id === item.detail?.category_id)
            : null
          if (catTag) catTag.textContent = catObj ? catObj.name.toUpperCase() : (item.kind === 'faq' ? 'GENERAL' : 'DISCUSSION')

          if (confidenceEl) {
            confidenceEl.textContent = item.kind === 'faq'
              ? `${(item.detail?.confidence_score ?? 100).toFixed(0)}%`
              : '—'
          }
          if (agreementEl) {
            agreementEl.textContent = item.kind === 'faq'
              ? `${(item.detail?.community_agreement_score ?? 90).toFixed(0)}%`
              : '—'
          }

          if (buttons[0]) {
            buttons[0].onclick = (e) => {
              e.preventDefault()
              if (item.kind === 'faq') navigate(`/faq/${item.saved.target_id}`)
              else navigate(`/discussions/${item.saved.target_id}`)
            }
          }

          if (buttons[2]) {
            buttons[2].onclick = async (e) => {
              e.preventDefault()
              try {
                await savedApi.remove(item.saved.target_type, item.saved.target_id)
              } catch {
                // ignore
              }
              card.remove()
              const counter = root.querySelector('.glass-card .text-primary.text-headline-lg')
              if (counter) {
                const remaining = savedGrid.querySelectorAll('.glass-card').length
                counter.textContent = remaining.toString()
              }
            }
          }

          savedGrid.appendChild(card)
        })
      } catch {
        clearLoading()
        showError(savedGrid as HTMLElement)
      }
    }

    load()
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
