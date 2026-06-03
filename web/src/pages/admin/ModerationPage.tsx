import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/17-moderation'
import { commonAdminNav } from '@/data/navMaps'
import { moderationApi } from '@/services/api/moderation'
import { showLoading, showError, showEmpty } from '@/utils/pageStatus'

export default function ModerationPage() {
  const navigate = useNavigate()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const timer = setTimeout(async () => {
      const root = document.querySelector('.stitch-page-root')
      if (!root) return

      const reportSection = root.querySelector('.space-y-4')
      const clearLoading = reportSection ? showLoading(reportSection as HTMLElement) : () => {}

      try {
        const res = await moderationApi.listReports({ page_size: '10', status: 'OPEN' })
        clearLoading()
        const openCountEl = root.querySelector('.border-l-primary\\/40 .text-headline-md')
        if (openCountEl) openCountEl.textContent = res.total.toString()

        const reportList = root.querySelector('.space-y-4 .glass-panel')
        if (reportList && res.items.length > 0) {
          const template = reportList.cloneNode(true) as HTMLElement
          const container = reportList.parentElement
          if (container) {
            container.innerHTML = ''
            res.items.forEach((r) => {
              const card = template.cloneNode(true) as HTMLElement
              const reasonEl = card.querySelector('.font-headline-md')
              const contentIdEl = card.querySelector('.font-label-md.text-label-sm.text-outline')
              if (reasonEl) reasonEl.textContent = r.reason
              if (contentIdEl) contentIdEl.textContent = `#${r.content_id?.slice(0, 8) ?? r.id.slice(0, 8)}`
              container.appendChild(card)
            })
          }
        } else if (reportList) {
          showEmpty(reportList as HTMLElement)
        }
      } catch {
        clearLoading()
        if (reportSection) showError(reportSection as HTMLElement)
      }
    }, 100)

    return () => clearTimeout(timer)
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
