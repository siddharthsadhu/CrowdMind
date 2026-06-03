import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/15-mission-control'
import { commonAdminNav, commonUserNav } from '@/data/navMaps'
import { analyticsApi } from '@/services/api/analytics'
import { showLoading, showError } from '@/utils/pageStatus'

export default function MissionControlPage() {
  const navigate = useNavigate()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const timer = setTimeout(async () => {
      const root = document.querySelector('.stitch-page-root')
      if (!root) return

      const metricsRow = root.querySelector('section .grid.grid-cols-1')
      const clearLoading = metricsRow ? showLoading(metricsRow as HTMLElement) : () => {}

      try {
        const dash = await analyticsApi.getDashboard()
        clearLoading()
        const cards = root.querySelectorAll('.glass-card .text-headline-md.font-headline-md')
        if (cards.length >= 4) {
          const values = [dash.total_faqs, dash.total_questions, dash.total_discussions, dash.total_reports_open]
          cards.forEach((card, i) => {
            if (i < values.length) {
              const allText = card.parentElement?.querySelectorAll('.text-headline-md, .font-headline-md')
              if (allText) {
                const last = allText[allText.length - 1] as HTMLElement
                if (last) last.textContent = values[i].toString()
              }
            }
          })
        }
      } catch {
        clearLoading()
        if (metricsRow) showError(metricsRow as HTMLElement)
      }
    }, 100)

    return () => clearTimeout(timer)
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
