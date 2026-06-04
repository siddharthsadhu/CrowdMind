import { useStitchData } from '@/hooks/useStitchData'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/18-analytics'
import { commonAdminNav } from '@/data/navMaps'
import { analyticsApi } from '@/services/api/analytics'
import { showLoading, showError } from '@/utils/pageStatus'

export default function AnalyticsPage() {
  const navigate = useNavigate()

  useStitchData(async (root) => {
    const metricsRow = root.querySelector('section .grid.grid-cols-1')
    const clearLoading = metricsRow ? showLoading(metricsRow as HTMLElement) : () => {}

    try {
      const dash = await analyticsApi.getDashboard()
      clearLoading()
      const metrics = root.querySelectorAll('.glass-card .font-headline-md')
      if (metrics.length >= 4) {
        const vals = [dash.total_users, dash.total_questions, dash.total_discussions, dash.total_faqs]
        metrics.forEach((el, i) => {
          if (i < vals.length) el.textContent = vals[i].toString()
        })
      }
    } catch {
      clearLoading()
      if (metricsRow) showError(metricsRow as HTMLElement)
    }
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
