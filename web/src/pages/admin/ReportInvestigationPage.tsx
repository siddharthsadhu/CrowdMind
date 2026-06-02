import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/19-report'
import { commonAdminNav } from '@/data/navMaps'
import { moderationApi } from '@/services/api/moderation'

export default function ReportInvestigationPage() {
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
        const report = await moderationApi.getReport(id)
        const reasonEl = root.querySelector('h1')
        const statusEl = root.querySelector('.bg-primary\\/10.text-primary')
        const contentIdEl = root.querySelector('.font-label-sm.text-outline')
        if (reasonEl) reasonEl.textContent = report.reason
        if (statusEl) statusEl.textContent = report.status
        if (contentIdEl) contentIdEl.textContent = `Content ID: ${report.content_id?.slice(0, 8) ?? id.slice(0, 8)}`

        const dismissBtn = Array.from(root.querySelectorAll('button')).find(
          (b) => b.textContent?.trim() === 'Dismiss Report',
        )
        const resolveBtn = Array.from(root.querySelectorAll('button')).find(
          (b) => b.textContent?.trim() === 'Resolve & Apply',
        )

        if (dismissBtn) {
          (dismissBtn as HTMLButtonElement).onclick = async () => {
            try {
              await moderationApi.resolveReport(id, { status: 'DISMISSED' })
              navigate('/admin/moderation')
            } catch { /* ignore */ }
          }
        }
        if (resolveBtn) {
          (resolveBtn as HTMLButtonElement).onclick = async () => {
            try {
              await moderationApi.resolveReport(id, { status: 'RESOLVED' })
              navigate('/admin/moderation')
            } catch { /* ignore */ }
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
      title="CrowdMind | Report Investigation"
      navMap={{
        ...commonAdminNav,
        queue: '/admin/moderation',
        'moderation queue': '/admin/moderation',
        dismiss: '/admin/moderation',
        approve: '/admin/moderation',
      }}
    />
  )
}
