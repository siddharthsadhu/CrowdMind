import { useStitchData } from '@/hooks/useStitchData'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/16-faq-mgmt'
import { commonAdminNav } from '@/data/navMaps'
import { faqsApi } from '@/services/api/faqs'
import { categoriesApi } from '@/services/api/categories'
import { showLoading, showError } from '@/utils/pageStatus'

export default function FaqManagementPage() {
  const navigate = useNavigate()

  useStitchData(async (root) => {
    const mainGrid = root.querySelector('[class*="grid"]')
    const clearLoading = mainGrid ? showLoading(mainGrid as HTMLElement) : () => {}

    try {
      const [faqRes, candRes, categories] = await Promise.all([
        faqsApi.list({ page_size: '10' }),
        faqsApi.candidates.list({ page_size: '5' }),
        categoriesApi.list().catch(() => []),
      ])

      clearLoading()

      const metrics = root.querySelectorAll('.glass-card')
      if (metrics.length >= 5) {
        const pubVal = metrics[0].querySelector('.text-headline-md')
        if (pubVal) pubVal.textContent = faqRes.total.toString()

        const candVal = metrics[1].querySelector('.text-headline-md')
        if (candVal) candVal.textContent = candRes.total.toString()

        const catVal = metrics[4].querySelector('.text-headline-md')
        if (catVal) catVal.textContent = categories.length.toString()
      }

      const tbody = root.querySelector('table tbody')
      if (tbody && faqRes.items.length > 0) {
        const templateRow = tbody.querySelector('tr')
        if (templateRow) {
          tbody.innerHTML = ''
          faqRes.items.forEach((faq) => {
            const row = templateRow.cloneNode(true) as HTMLElement

            const idEl = row.querySelector('td:first-child')
            const titleEl = row.querySelector('td:nth-child(2)')
            const catEl = row.querySelector('td:nth-child(3) span')
            const verEl = row.querySelector('td:nth-child(4)')
            const confidenceEl = row.querySelector('td:nth-child(5) span')
            const confidenceBar = row.querySelector('td:nth-child(5) .h-full') as HTMLElement | null
            const agreementEl = row.querySelector('td:nth-child(6)')
            const updatedEl = row.querySelector('td:nth-child(7)')
            const actionBtn = row.querySelector('td:last-child button')

            if (idEl) idEl.textContent = `#${faq.id.slice(0, 4).toUpperCase()}`

            if (titleEl) {
              titleEl.textContent = faq.title
              titleEl.className = 'p-4 font-body-md text-on-surface font-medium max-w-[240px] truncate cursor-pointer hover:text-primary transition-colors'
              titleEl.addEventListener('click', () => navigate(`/faq/${faq.id}`))
            }

            const catObj = categories.find(c => c.id === faq.category_id)
            if (catEl) catEl.textContent = catObj ? catObj.name : 'General'

            if (verEl) verEl.textContent = `v${faq.version_number}`

            const conf = faq.confidence_score ?? 100
            if (confidenceEl) confidenceEl.textContent = `${conf}%`
            if (confidenceBar) confidenceBar.style.width = `${conf}%`

            if (agreementEl) {
              agreementEl.textContent = faq.community_agreement_score ? `${faq.community_agreement_score}%` : '88%'
            }

            if (updatedEl) {
              updatedEl.textContent = faq.updated_at ? new Date(faq.updated_at).toLocaleDateString() : new Date(faq.created_at).toLocaleDateString()
            }

            if (actionBtn) {
              actionBtn.addEventListener('click', (e) => {
                e.stopPropagation()
                navigate(`/faq/${faq.id}`)
              })
            }

            tbody.appendChild(row)
          })
        }
      } else if (tbody) {
        tbody.innerHTML = `<tr><td colspan="9" class="p-8 text-center text-on-surface-variant italic">No published FAQs.</td></tr>`
      }

      const entryCountEl = root.querySelector('.p-4.bg-surface-container\\/30.border-t span')
      if (entryCountEl) {
        entryCountEl.textContent = `Showing 1 to ${faqRes.items.length} of ${faqRes.total} entries`
      }

      const candidatesCard = Array.from(root.querySelectorAll('.glass-card')).find(c =>
        c.querySelector('h4')?.textContent?.includes('Recent Updates')
      )
      if (candidatesCard) {
        const title = candidatesCard.querySelector('h4')
        if (title) title.textContent = 'FAQ Candidates Queue'

        const container = candidatesCard.querySelector('.space-y-4')
        if (container) {
          container.innerHTML = ''
          if (candRes.items.length === 0) {
            container.innerHTML = '<p class="text-label-sm text-on-surface-variant italic p-2">No candidates pending review</p>'
          } else {
            candRes.items.forEach((cand) => {
              const item = document.createElement('div')
              item.className = 'p-3 rounded-lg bg-surface-container/40 border border-white/5 hover:border-primary/30 transition-all cursor-pointer'
              item.innerHTML = `
                <div class="flex items-center gap-2 mb-1 justify-between">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-primary"></span>
                    <span class="text-label-md font-bold text-on-surface">${cand.title.slice(0, 20)}${cand.title.length > 20 ? '...' : ''}</span>
                  </div>
                  <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary-container/20 text-primary-fixed-dim border border-primary-container/20 uppercase">${cand.status}</span>
                </div>
                <p class="text-label-sm text-on-surface-variant line-clamp-2">${cand.content.slice(0, 80)}...</p>
                <span class="text-[10px] text-primary mt-2 block hover:underline">Review Candidate →</span>
              `
              item.addEventListener('click', (e) => {
                e.preventDefault()
                navigate(`/admin/faq-review/${cand.id}`)
              })
              container.appendChild(item)
            })
          }
        }
      }
    } catch (err) {
      clearLoading()
      if (mainGrid) showError(mainGrid as HTMLElement)
      console.error(err)
    }
  }, [navigate])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | FAQ Management"
      navMap={{
        ...commonAdminNav,
        publish: '/admin/faq',
        review: '/admin/faq-review/1024',
        candidate: '/admin/faq-review/1024',
        'approve faq': '/admin/faq-review/1024',
      }}
    />
  )
}
