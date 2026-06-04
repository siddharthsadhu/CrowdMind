import { useStitchData } from '@/hooks/useStitchData'
import { useNavigate, useParams } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/19-report'
import { commonAdminNav } from '@/data/navMaps'
import { moderationApi } from '@/services/api/moderation'

export default function ReportInvestigationPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  useStitchData(async (root) => {
    if (!id) return

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
      const warnRemoveBtn = Array.from(root.querySelectorAll('button')).find(
        (b) => b.textContent?.trim().includes('Remove Content & Warn User'),
      )
      const finalizeBtn = root.querySelector('#finalize-btn') as HTMLButtonElement | null
      const textarea = root.querySelector('#resolution-textarea') as HTMLTextAreaElement | null

      const getNotes = () => textarea?.value.trim() ?? ''

      if (dismissBtn) {
        (dismissBtn as HTMLButtonElement).onclick = async () => {
          try {
            await moderationApi.resolveReport(id, {
              status: 'DISMISSED',
              resolution_notes: getNotes() || undefined,
            })
            navigate('/admin/moderation')
          } catch { /* ignore */ }
        }
      }
      if (resolveBtn) {
        (resolveBtn as HTMLButtonElement).onclick = async () => {
          try {
            await moderationApi.resolveReport(id, {
              status: 'RESOLVED',
              resolution_notes: getNotes() || undefined,
            })
            navigate('/admin/moderation')
          } catch { /* ignore */ }
        }
      }
      if (warnRemoveBtn) {
        (warnRemoveBtn as HTMLButtonElement).onclick = async () => {
          try {
            await moderationApi.applyAction(id, {
              action: 'WARN',
              notes: getNotes() || undefined,
            })
            navigate('/admin/moderation')
          } catch { /* ignore */ }
        }
      }
      if (finalizeBtn) {
        finalizeBtn.onclick = async () => {
          try {
            await moderationApi.resolveReport(id, {
              status: 'RESOLVED',
              resolution_notes: getNotes() || undefined,
            })
            navigate('/admin/moderation')
          } catch { /* ignore */ }
        }
      }
    } catch {
      // keep static
    }
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
