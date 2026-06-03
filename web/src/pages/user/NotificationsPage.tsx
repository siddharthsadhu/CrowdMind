import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/11-notifications'
import { commonUserNav } from '@/data/navMaps'
import { notificationsApi } from '@/services/api/notifications'
import { showError, showEmpty } from '@/utils/pageStatus'

export default function NotificationsPage() {
  const navigate = useNavigate()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const timer = setTimeout(async () => {
      const root = document.querySelector('.stitch-page-root')
      if (!root) return

      try {
        const res = await notificationsApi.list({ page_size: '20' })
        const feed = root.querySelector('.space-y-4 .flex.flex-col')
        if (feed && res.items.length > 0) {
          const template = feed.querySelector('.glass-card')
          if (template) {
            feed.innerHTML = ''
            res.items.forEach((n) => {
              const card = template.cloneNode(true) as HTMLElement
              const titleEl = card.querySelector('.font-headline-md')
              const descEl = card.querySelector('.font-body-md')
              if (titleEl) titleEl.textContent = n.title
              if (descEl) descEl.textContent = n.body ?? n.type
              feed.appendChild(card)
            })
          }
        } else if (feed && res.items.length === 0) {
          showEmpty(feed as HTMLElement)
        }
      } catch {
        const feed = root.querySelector('.space-y-4 .flex.flex-col')
        if (feed) showError(feed as HTMLElement)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Notifications"
      navMap={commonUserNav}
    />
  )
}
