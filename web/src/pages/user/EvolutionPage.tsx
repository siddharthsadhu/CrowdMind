import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/14-evolution'
import { commonUserNav } from '@/data/navMaps'
import { faqsApi } from '@/services/api/faqs'

export default function EvolutionPage() {
  const navigate = useNavigate()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const timer = setTimeout(async () => {
      const root = document.querySelector('.stitch-page-root')
      if (!root) return

      try {
        const res = await faqsApi.list({ page_size: '3' })
        const timeline = root.querySelector('.space-y-4 .flex.flex-col.md\\:flex-row')
        if (timeline && res.items.length > 0) {
          for (let i = 0; i < Math.min(res.items.length, 3); i++) {
            const faq = res.items[i]
            const titleEl = root.querySelectorAll('.font-headline-md.text-on-surface')
            if (titleEl[i]) titleEl[i].textContent = faq.title
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
      title="CrowdMind | Knowledge Evolution"
      navMap={{ ...commonUserNav, 'view faq': '/faq/2', timeline: '/library' }}
    />
  )
}
