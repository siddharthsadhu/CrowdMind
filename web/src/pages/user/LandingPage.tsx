import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/01-landing'
import { commonUserNav } from '@/data/navMaps'
import { analyticsApi } from '@/services/api/analytics'

export default function LandingPage() {
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
        const stats = root.querySelectorAll('.glass-card .font-headline-md')
        if (stats.length >= 4) {
          stats[0].textContent = dash.total_faqs.toString()
          stats[1].textContent = dash.total_discussions.toString()
          stats[2].textContent = dash.total_questions.toString()
          stats[3].textContent = dash.total_users.toString()
        }
      } catch {
        // keep static values
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Landing"
      navMap={{
        ...commonUserNav,
        'explore knowledge': '/library',
        'join the collective': '/login',
        trending: '/library',
      }}
    />
  )
}
