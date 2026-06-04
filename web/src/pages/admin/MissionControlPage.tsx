import { useStitchData } from '@/hooks/useStitchData'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/15-mission-control'
import { commonAdminNav, commonUserNav } from '@/data/navMaps'
import { analyticsApi } from '@/services/api/analytics'
import { showLoading, showError } from '@/utils/pageStatus'

export default function MissionControlPage() {
  const navigate = useNavigate()

  useStitchData(async (root) => {
    const headerSection = root.querySelector('section.mb-12, header.mb-12')
    const clearLoading = headerSection ? showLoading(headerSection as HTMLElement) : () => {}

    try {
      const dash = await analyticsApi.getDashboard()
      clearLoading()

      // Find funnel steps by their label text; replace the .text-3xl value with the dashboard count
      const funnelGrid = root.querySelector('.funnel, .grid.grid-cols-2.md\\:grid-cols-3.lg\\:grid-cols-6')
      if (funnelGrid) {
        const labelMap: Record<string, number> = {
          'questions': dash.total_questions,
          'discussions': dash.total_discussions,
        }
        funnelGrid.querySelectorAll('.funnel-step').forEach((step) => {
          const labelEl = step.querySelector('p.font-label-sm')
          if (!labelEl) return
          const txt = (labelEl.textContent ?? '').trim().toLowerCase()
          for (const [key, val] of Object.entries(labelMap)) {
            if (txt === key || txt.startsWith(key + ' ')) {
              const valEl = step.querySelector('p.font-display, p.text-3xl') as HTMLElement | null
              if (valEl) valEl.textContent = val.toString()
              break
            }
          }
        })
      }

      // Also surface the 4 KPIs as a top-of-page summary by replacing any 'k' style big numbers
      // in the hero metric row (the first 3 .glass-card .text-headline-md/text-primary in the page)
      const heroCards = root.querySelectorAll('section.grid.grid-cols-2.md\\:grid-cols-4 > .glass-card')
      if (heroCards.length >= 4) {
        const values = [dash.total_faqs, dash.total_questions, dash.total_discussions, dash.total_reports_open]
        heroCards.forEach((card, i) => {
          if (i < values.length) {
            const valEl = card.querySelector('p.font-headline-md, p.text-3xl') as HTMLElement | null
            if (valEl) valEl.textContent = values[i].toString()
          }
        })
      }
    } catch {
      clearLoading()
      if (headerSection) showError(headerSection as HTMLElement)
    }
  }, [navigate])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Mission Control"
      navMap={{ ...commonAdminNav, ...commonUserNav }}
    />
  )
}
