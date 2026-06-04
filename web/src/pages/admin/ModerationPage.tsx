import { useStitchData } from '@/hooks/useStitchData'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/17-moderation'
import { commonAdminNav } from '@/data/navMaps'
import { moderationApi } from '@/services/api/moderation'

export default function ModerationPage() {
  const navigate = useNavigate()

  useStitchData(async (root) => {
    try {
      const res = await moderationApi.listReports({ page_size: '10', status: 'OPEN' })
      
      // Update open reports count metric card
      const openCountEl = root.querySelector('.border-l-primary\\/40 .text-headline-md')
      if (openCountEl) openCountEl.textContent = res.total.toString()

      const tbody = root.querySelector('table tbody')
      if (tbody && res.items.length > 0) {
        const templateRow = tbody.querySelector('tr')
        if (templateRow) {
          tbody.innerHTML = ''
          res.items.forEach((r) => {
            const row = templateRow.cloneNode(true) as HTMLElement
            
            // Report ID
            const idEl = row.querySelector('td:first-child span')
            if (idEl) idEl.textContent = `#${r.id.slice(0, 8)}`
            
            // Report Date/Time
            const timeEl = row.querySelector('td:first-child p')
            if (timeEl) {
              timeEl.textContent = r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Just now'
            }

            // Content Type
            const typeEl = row.querySelector('td:nth-child(2)')
            if (typeEl) typeEl.textContent = r.content_type

            // Reason
            const reasonEl = row.querySelector('td:nth-child(3)')
            if (reasonEl) reasonEl.textContent = r.reason

            // Severity
            const severityEl = row.querySelector('td:nth-child(4) span')
            if (severityEl) {
              severityEl.textContent = r.severity
              const sev = r.severity.toLowerCase()
              if (sev === 'critical') {
                severityEl.className = 'px-2 py-0.5 rounded bg-error/20 text-error border border-error/30 text-[11px] font-bold uppercase'
              } else if (sev === 'high') {
                severityEl.className = 'px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 text-[11px] font-bold uppercase'
              } else {
                severityEl.className = 'px-2 py-0.5 rounded bg-secondary-container/20 text-secondary-fixed border border-secondary-container/30 text-[11px] font-bold uppercase'
              }
            }

            // AI Risk mockup progress bar
            const riskBar = row.querySelector('td:nth-child(5) .h-full') as HTMLElement | null
            const riskVal = row.querySelector('td:nth-child(5) span')
            if (riskVal) {
              const percentage = r.severity.toLowerCase() === 'critical' ? 85 : r.severity.toLowerCase() === 'high' ? 71 : 42
              riskVal.textContent = `${percentage}%`
              if (riskBar) {
                riskBar.className = percentage === 85 ? 'h-full bg-error' : 'h-full bg-primary'
                riskBar.style.width = `${percentage}%`
              }
            }

            // Investigate Button Action
            const btn = row.querySelector('td:last-child button')
            btn?.addEventListener('click', (e) => {
              e.preventDefault()
              navigate(`/admin/reports/${r.id}`)
            })

            tbody.appendChild(row)
          })
        }
      } else if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="p-8 text-center text-on-surface-variant italic">
              No open reports in moderation queue.
            </td>
          </tr>
        `
      }
    } catch (err) {
      console.error('Failed to load moderation queue reports', err)
    }
  }, [navigate])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Moderation Queue"
      navMap={{
        ...commonAdminNav,
        investigate: '/admin/reports/r1',
        review: '/admin/reports/r1',
        open: '/admin/reports/r1',
      }}
    />
  )
}
