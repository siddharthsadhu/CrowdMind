import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/13-contributions'
import { commonUserNav } from '@/data/navMaps'
import { questionsApi } from '@/services/api/questions'

export default function ContributionsPage() {
  const navigate = useNavigate()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const timer = setTimeout(async () => {
      const root = document.querySelector('.stitch-page-root')
      if (!root) return

      try {
        const res = await questionsApi.list({ page_size: '5' })
        const feed = root.querySelector('.space-y-4')
        if (feed && res.items.length > 0) {
          const template = feed.querySelector('.glass-card')
          if (template) {
            feed.innerHTML = ''
            res.items.forEach((q) => {
              const card = template.cloneNode(true) as HTMLElement
              const titleEl = card.querySelector('h4')
              if (titleEl) titleEl.textContent = q.title
              feed.appendChild(card)
            })
          }
        }
      } catch {
        // keep static
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | My Contributions"
      navMap={{ ...commonUserNav, profile: '/home', view: '/faq/1' }}
    />
  )
}
