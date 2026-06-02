import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/18-analytics'
import { commonAdminNav } from '@/data/navMaps'
import { analyticsApi } from '@/services/api/analytics'

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const timer = setTimeout(async () => {
      const root = document.querySelector('.stitch-page-root')
      if (!root) return

      try {
        const dash = await analyticsApi.getDashboard()
        const metrics = root.querySelectorAll('.glass-card .font-headline-md')
        if (metrics.length >= 4) {
          const vals = [dash.total_users, dash.total_questions, dash.total_discussions, dash.total_faqs]
          metrics.forEach((el, i) => {
            if (i < vals.length) el.textContent = vals[i].toString()
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
      title="CrowdMind | Platform Intelligence"
      navMap={commonAdminNav}
    />
  )
}
