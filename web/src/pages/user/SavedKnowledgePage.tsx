import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/12-saved'
import { commonUserNav } from '@/data/navMaps'
import { faqsApi } from '@/services/api/faqs'

export default function SavedKnowledgePage() {
  const navigate = useNavigate()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const timer = setTimeout(async () => {
      const root = document.querySelector('.stitch-page-root')
      if (!root) return

      try {
        const res = await faqsApi.list({ page_size: '4' })
        const cards = root.querySelectorAll('.glass-card .font-headline-md')
        if (cards.length > 0 && res.items.length > 0) {
          res.items.forEach((faq, i) => {
            if (cards[i]) cards[i].textContent = faq.title
          })
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
      title="CrowdMind | Saved Knowledge"
      navMap={{ ...commonUserNav, profile: '/home', open: '/faq/1' }}
    />
  )
}
