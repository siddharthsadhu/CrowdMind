import { useStitchData } from '@/hooks/useStitchData'
import { useNavigate, useParams } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/03-faq-detail'
import { commonUserNav } from '@/data/navMaps'
import { faqsApi } from '@/services/api/faqs'
import { categoriesApi } from '@/services/api/categories'
import { showLoading, showError } from '@/utils/pageStatus'

export default function FaqDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  useStitchData(async (root) => {
    if (!id) return

    const contentCard = root.querySelector('.grid.gap-8')
    if (!contentCard) return

    const clearLoading = showLoading(contentCard as HTMLElement)

    try {
      const [faq, categories] = await Promise.all([
        faqsApi.getById(id),
        categoriesApi.list().catch(() => []),
      ])

      clearLoading()
      const title = faq.title
      document.title = `CrowdMind | ${title}`

      const titleEl = root.querySelector('h1')
      const catEl = root.querySelector('.bg-primary\\/10.text-primary.font-label-sm')
      const verEl = root.querySelector('.bg-surface-container-highest.text-on-surface-variant.font-label-sm:last-child')
      const contentEl = root.querySelector('.glass-card.p-10 .font-body-lg')
      const confidenceVal = root.querySelector('.space-y-2:nth-child(1) .text-primary.font-label-md')
      const confidenceBar = root.querySelector('.space-y-2:nth-child(1) .bg-primary')
      const agreementVal = root.querySelector('.space-y-2:nth-child(2) .text-secondary-fixed-dim.font-label-md')
      const agreementBar = root.querySelector('.space-y-2:nth-child(2) .bg-secondary-fixed-dim')

      if (titleEl) titleEl.textContent = title

      const catObj = categories.find((c) => c.id === faq.category_id)
      if (catEl) catEl.textContent = catObj ? catObj.name.toUpperCase() : 'GENERAL'

      if (verEl) verEl.textContent = `v${faq.version_number}`
      if (contentEl) contentEl.textContent = faq.content
      if (confidenceVal) confidenceVal.textContent = `${faq.confidence_score ?? 100}%`
      if (confidenceBar) {
        const w = confidenceBar.parentElement
        if (w) (confidenceBar as HTMLElement).style.width = `${faq.confidence_score ?? 100}%`
      }
      if (agreementVal) agreementVal.textContent = `${faq.community_agreement_score ?? 90}%`
      if (agreementBar) {
        const w = agreementBar.parentElement
        if (w) (agreementBar as HTMLElement).style.width = `${faq.community_agreement_score ?? 90}%`
      }

      const bookmarkBtns = root.querySelectorAll('button[title="Bookmark"]')
      const bookmarkCountEl = Array.from(root.querySelectorAll('span')).find((s) => s.textContent?.includes('Bookmarks'))

      const savedFaqs = JSON.parse(localStorage.getItem('saved-faqs') || '[]')
      let isBookmarked = savedFaqs.includes(id)

      const updateBookmarkUi = () => {
        bookmarkBtns.forEach((btn) => {
          const icon = btn.querySelector('.material-symbols-outlined')
          if (icon) {
            icon.textContent = isBookmarked ? 'bookmark' : 'bookmark_add'
          }
        })
        if (bookmarkCountEl) {
          const baseCount = 452
          bookmarkCountEl.textContent = `${isBookmarked ? baseCount + 1 : baseCount} Bookmarks`
        }
      }

      updateBookmarkUi()

      bookmarkBtns.forEach((btn) => {
        btn.addEventListener('click', (e: Event) => {
          e.preventDefault()
          const bookmarks = JSON.parse(localStorage.getItem('saved-faqs') || '[]')
          if (isBookmarked) {
            const idx = bookmarks.indexOf(id)
            if (idx > -1) bookmarks.splice(idx, 1)
            isBookmarked = false
          } else {
            bookmarks.push(id)
            isBookmarked = true
          }
          localStorage.setItem('saved-faqs', JSON.stringify(bookmarks))
          updateBookmarkUi()
        })
      })

      const yesBtn = Array.from(root.querySelectorAll('button')).find(
        (b) => b.textContent?.trim().toLowerCase().includes('yes'),
      )
      const noBtn = Array.from(root.querySelectorAll('button')).find(
        (b) => b.textContent?.trim().toLowerCase().includes('no'),
      )
      const feedbackPanel = root.querySelector('section.glass-card.p-8.rounded-xl.flex.flex-col.md\\:flex-row')

      const renderFeedbackSuccess = () => {
        if (feedbackPanel) {
          feedbackPanel.innerHTML = `
            <div>
              <h4 class="font-headline-md text-headline-md mb-1">Feedback Submitted</h4>
              <p class="text-on-surface-variant text-body-md">Thank you for helping optimize the neural protocol.</p>
            </div>
          `
        }
      }

      const hasVoted = localStorage.getItem(`faq-feedback-${id}`)
      if (hasVoted) {
        renderFeedbackSuccess()
      } else if (yesBtn && noBtn) {
        yesBtn.onclick = (e) => {
          e.preventDefault()
          localStorage.setItem(`faq-feedback-${id}`, 'yes')
          renderFeedbackSuccess()
        }
        noBtn.onclick = (e) => {
          e.preventDefault()
          localStorage.setItem(`faq-feedback-${id}`, 'no')
          renderFeedbackSuccess()
        }
      }

      const timelineSection = root.querySelector('.glass-card.p-6.rounded-xl.space-y-6 .relative.space-y-8')
      if (timelineSection) {
        try {
          const versionsRes = await faqsApi.getVersions(id)
          if (versionsRes.items.length > 0) {
            timelineSection.innerHTML = ''
            versionsRes.items.forEach((ver, index) => {
              const verNode = document.createElement('div')
              if (index === 0) {
                verNode.className = 'relative pl-10 group cursor-pointer'
                verNode.innerHTML = `
                  <div class="absolute left-0 top-1.5 w-6 h-6 bg-primary rounded-full border-4 border-surface ring-2 ring-primary/20 flex items-center justify-center transition-transform group-hover:scale-110">
                    <span class="material-symbols-outlined text-[12px] text-on-primary font-bold">check</span>
                  </div>
                  <div class="space-y-3 bg-white/5 p-4 rounded-lg border border-primary/20 group-hover:border-primary/40 transition-all">
                    <div class="flex justify-between items-center">
                      <span class="font-label-md text-label-md text-primary">v${ver.version_number} Patch</span>
                      <span class="text-[10px] text-outline uppercase">Active Now</span>
                    </div>
                    <p class="text-label-sm text-on-surface">${ver.change_summary || 'Verified community consensus.'}</p>
                    <div class="pt-3 border-t border-white/10 space-y-2">
                      <div class="flex items-center justify-between text-[11px]">
                        <span class="text-outline">Publisher:</span>
                        <span class="text-on-surface">${ver.created_by.slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>
                `
              } else {
                verNode.className = 'relative pl-10 group cursor-pointer hover:translate-x-1 transition-transform'
                verNode.innerHTML = `
                  <div class="absolute left-[8px] top-2 w-2 h-2 bg-outline rounded-full group-hover:bg-primary"></div>
                  <div class="space-y-1">
                    <div class="flex justify-between items-center">
                      <span class="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">v${ver.version_number} Revision</span>
                      <span class="text-[10px] text-outline uppercase">${new Date(ver.created_at).toLocaleDateString()}</span>
                    </div>
                    <p class="text-label-sm text-on-surface-variant">${ver.change_summary || 'Historical update.'}</p>
                  </div>
                `
              }
              timelineSection.appendChild(verNode)
            })
          }
        } catch (err) {
          console.error('Failed to load version history', err)
        }
      }

    } catch {
      clearLoading()
      showError(contentCard as HTMLElement)
    }
  }, [id, navigate])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | FAQ Detail"
      navMap={{
        ...commonUserNav,
        'related discussions': '/discussions',
        'want to participate': '/login',
        participate: '/login',
      }}
    />
  )
}
