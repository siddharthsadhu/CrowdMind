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
        const res = await discussionsApi.list({ page_size: '20' })
        discussions = res.items
      } catch {
        clearLoading()
        showError(feed as HTMLElement)
        return
      }

      clearLoading()

      if (discussions.length === 0) {
        showEmpty(feed as HTMLElement)
        return
      }

      const template = feed.querySelector('article.glass-card')
      if (!template) return

      feed.innerHTML = ''

      discussions.forEach((d) => {
        const card = template.cloneNode(true) as HTMLElement
        const titleEl = card.querySelector('h3')
        const metricsEl = card.querySelector('.border-y')
        const viewBtn = card.querySelector('.quick-actions button:last-child')

        if (titleEl) titleEl.textContent = d.title

        if (metricsEl) {
          const spans = metricsEl.querySelectorAll('span:not(.material-symbols-outlined)')
          if (spans.length >= 3) {
            spans[0].textContent = d.reply_count.toString()
            spans[1].textContent = `${d.view_count}`
            spans[2].textContent = `${d.participant_count} unique`
          }
        }

        if (viewBtn) {
          (viewBtn as HTMLButtonElement).onclick = () => navigate(`/discussions/${d.id}`)
        }

        feed.appendChild(card)
      })
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
