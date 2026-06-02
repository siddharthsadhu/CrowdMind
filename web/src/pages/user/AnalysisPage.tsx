import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/06-analysis'
import { commonUserNav } from '@/data/navMaps'
import { questionsApi } from '@/services/api/questions'

export default function AnalysisPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const timer = setTimeout(async () => {
      if (!id) return
      const root = document.querySelector('.stitch-page-root')
      if (!root) return

      try {
        const q = await questionsApi.getById(id)
        document.title = `CrowdMind | Analysis: ${q.title}`

        const questionEl = root.querySelector('h1')
        const statusEl = root.querySelector('.glass-card.rounded-xl .font-headline-md.text-headline-md')
        const similarSection = root.querySelector('.md\\:col-span-8 .space-y-4 + div')

        if (questionEl) questionEl.textContent = `"${q.title}"`
        if (statusEl) statusEl.textContent = q.ai_analysis_status === 'completed' ? 'Analysis complete' : 'Analysis in progress'

        const similarRes = await questionsApi.list({ page_size: '3' })
        if (similarSection && similarRes.items.length > 0) {
          const cards = similarSection.querySelectorAll('.glass-card.rounded-xl')
          if (cards.length > 0) {
            cards[0].querySelector('h3')!.textContent = similarRes.items[0].title
            cards[0].querySelector('p')!.textContent = similarRes.items[0].description ?? ''
          }
        }
      } catch {
        // keep static
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [id, navigate])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | AI Analysis"
      navMap={{
        ...commonUserNav,
        discussion: '/discussions',
        'start discussion': '/discussions/new',
        'view discussion': '/discussions/d1',
        continue: '/discussions',
      }}
    />
  )
}
