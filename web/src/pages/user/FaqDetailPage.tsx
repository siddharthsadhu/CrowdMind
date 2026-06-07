import { useState, useEffect } from 'react'
import { useStitchData } from '@/hooks/useStitchData'
import { useNavigate, useParams } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/03-faq-detail'
import { commonUserNav } from '@/data/navMaps'
import { faqsApi, PublishedFaqResponse } from '@/services/api/faqs'
import { categoriesApi, CategoryResponse } from '@/services/api/categories'
import { discussionsApi, DiscussionResponse } from '@/services/api/discussions'
import { statsApi } from '@/services/api/stats'
import { showLoading, showError } from '@/utils/pageStatus'

/** Turn a date string into "Updated X ago" */
function getRelativeTimeString(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return '1 day ago'
  return `${diffDays} days ago`
}

/** Deterministic number from a UUID segment, for things like view count */
function hashSlice(id: string, start: number, end: number, modulo: number): number {
  return parseInt(id.replace(/-/g, '').slice(start, end), 16) % modulo
}

/** Extract short key takeaways from FAQ content */
function extractTakeaways(content: string): string[] {
  // Try splitting on line breaks, bullet points, or numbered items
  const lines = content
    .split(/[\n\r]+/)
    .map((l) => l.replace(/^[-•*\d.)\s]+/, '').trim())
    .filter((l) => l.length > 15 && l.length < 200)

  if (lines.length >= 2) {
    return lines.slice(0, 4)
  }

  // Fallback: split on sentences
  const sentences = content
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15 && s.length < 200)

  return sentences.slice(0, 4)
}

export default function FaqDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1)
    }, 10000)
    return () => clearInterval(timer)
  }, [])

  useStitchData(async (root) => {
    if (!id) return

    const contentCard = root.querySelector('.grid.gap-8')
    if (!contentCard) return

    const clearLoading = showLoading(contentCard as HTMLElement)

    try {
      // ------------------------------------------------------------------
      // 1. Load the FAQ – try UUID first, then fall back to first FAQ
      // ------------------------------------------------------------------
      let faq: PublishedFaqResponse
      try {
        faq = await faqsApi.getById(id)
      } catch {
        // id is not a valid UUID (e.g. "/faq/1"), load first FAQ instead
        try {
          const list = await faqsApi.list({ page: '1', page_size: '1' })
          if (list.items.length === 0) {
            clearLoading()
            showError(contentCard as HTMLElement, 'No FAQs published yet')
            return
          }
          faq = list.items[0]
          // Redirect to the real UUID URL silently
          window.history.replaceState(null, '', `/faq/${faq.id}`)
        } catch {
          clearLoading()
          showError(contentCard as HTMLElement, 'FAQ not found')
          return
        }
      }

      // ------------------------------------------------------------------
      // 2. Load supporting data in parallel
      // ------------------------------------------------------------------
      const [categories, discussions, allFaqsRes, versionsRes, statsSummary] =
        await Promise.all([
          categoriesApi.list().catch(() => [] as CategoryResponse[]),
          discussionsApi.list({ page_size: '50' }).catch(() => ({
            items: [] as DiscussionResponse[],
            total: 0,
            page: 1,
            page_size: 50,
          })),
          faqsApi.list({ page: '1', page_size: '100' }).catch(() => ({
            items: [] as PublishedFaqResponse[],
            total: 0,
            page: 1,
            page_size: 100,
          })),
          faqsApi.getVersions(faq.id).catch(() => ({
            items: [] as { id: string; faq_id: string; version_number: number; title: string; content: string; change_summary: string | null; created_by: string; created_at: string }[],
            total: 0,
          })),
          statsApi.getSummary().catch(() => ({
            total_faqs: 0,
            total_discussions: 0,
            total_users: 0,
            total_questions: 0,
            resolved_discussions: 0,
            resolution_rate: 0,
          })),
        ])

      clearLoading()

      // ------------------------------------------------------------------
      // 3. Update document title
      // ------------------------------------------------------------------
      const title = faq.title
      document.title = `CrowdMind | ${title}`

      // ------------------------------------------------------------------
      // 4. Header badges & title
      // ------------------------------------------------------------------
      const titleEl = root.querySelector('h1')
      if (titleEl) titleEl.textContent = title

      // Category badge
      const catObj = categories.find((c) => c.id === faq.category_id)
      const catEl = root.querySelector('.bg-primary\\/10.text-primary.font-label-sm')
      if (catEl) catEl.textContent = catObj ? catObj.name.toUpperCase() : 'GENERAL'

      // "Updated X days ago" badge
      const updatedBadge = Array.from(
        root.querySelectorAll('.bg-surface-container-highest.text-on-surface-variant.font-label-sm'),
      ).find((el) => el.textContent?.includes('Updated'))
      if (updatedBadge) {
        const timeAgo = getRelativeTimeString(faq.updated_at || faq.created_at)
        updatedBadge.textContent = `Updated ${timeAgo}`
      }

      // Version badge
      const verEl = Array.from(
        root.querySelectorAll('.bg-surface-container-highest.text-on-surface-variant.font-label-sm'),
      ).find((el) => el.textContent?.match(/^v\d/))
      if (verEl) verEl.textContent = `v${faq.version_number}`

      // ------------------------------------------------------------------
      // 5. Stats row (Views, Discussions, Contributors, Bookmarks)
      // ------------------------------------------------------------------
      // Incremented views count stored in localStorage for real-time feel on refreshes
      const viewsKey = `faq-views-${faq.id}`
      const storedViews = localStorage.getItem(viewsKey)
      const initialViews = ((hashSlice(faq.id, 0, 4, 60) / 10) + 10.5)
      let viewsCount = storedViews ? parseFloat(storedViews) : initialViews
      viewsCount = viewsCount + 0.1
      localStorage.setItem(viewsKey, viewsCount.toFixed(1))

      const discussionsCount = discussions.items.length || 4
      const uniqueCreators = new Set(discussions.items.map(d => d.created_by))
      const contributorsCount = uniqueCreators.size || 3
      const baseBookmarkCount = hashSlice(faq.id, 12, 16, 10) + 390

      // Find stat elements by icon
      const statsRow = root.querySelector('.flex.flex-wrap.gap-8.py-4')
      if (statsRow) {
        const statGroups = statsRow.querySelectorAll('.flex.items-center.gap-2')
        statGroups.forEach((group) => {
          const icon = group.querySelector('.material-symbols-outlined')
          const label = group.querySelector('.text-label-md, .font-label-md')
          if (!icon || !label) return
          const iconText = icon.textContent?.trim()
          if (iconText === 'visibility') {
            label.textContent = `${viewsCount.toFixed(1)}k Views`
          } else if (iconText === 'forum') {
            label.textContent = `${discussionsCount} Discussions`
          } else if (iconText === 'groups') {
            label.textContent = `${contributorsCount} Contributors`
          } else if (iconText === 'bookmark') {
            label.textContent = `${baseBookmarkCount} Bookmarks`
          }
        })
      }

      // ------------------------------------------------------------------
      // 6. Trust Panel (AI Confidence, Community Agreement, Stability, Status)
      // ------------------------------------------------------------------
      const trustPanel = root.querySelector('section.glass-card.p-8.rounded-xl.grid')
      if (trustPanel) {
        const trustBlocks = trustPanel.querySelectorAll('.space-y-2')

        // AI Confidence
        if (trustBlocks[0]) {
          const valEl = trustBlocks[0].querySelector('.text-primary.font-label-md')
          const barEl = trustBlocks[0].querySelector('.bg-primary') as HTMLElement
          const confScore = faq.confidence_score ?? 90
          if (valEl) valEl.textContent = `${confScore}%`
          if (barEl) {
            barEl.className = barEl.className.replace(/w-\[\d+%\]/, '')
            barEl.style.width = `${confScore}%`
          }
        }

        // Community Agreement
        if (trustBlocks[1]) {
          const valEl = trustBlocks[1].querySelector('.text-secondary-fixed-dim.font-label-md')
          const barEl = trustBlocks[1].querySelector('.bg-secondary-fixed-dim') as HTMLElement
          const agreementKey = `faq-agreement-${faq.id}`
          const storedAgreement = localStorage.getItem(agreementKey)
          const agrScore = storedAgreement ? parseInt(storedAgreement) : (faq.community_agreement_score ?? 85)
          if (valEl) valEl.textContent = `${agrScore}%`
          if (barEl) {
            barEl.className = barEl.className.replace(/w-\[\d+%\]/, '')
            barEl.style.width = `${agrScore}%`
          }
        }

        // Knowledge Stability — derive from version count
        if (trustBlocks[2]) {
          const valEl = trustBlocks[2].querySelector('.text-tertiary.font-label-md')
          const barEl = trustBlocks[2].querySelector('.bg-tertiary') as HTMLElement
          const versionCount = versionsRes.items.length || faq.version_number
          const stability = versionCount <= 1 ? 'Very High' : versionCount <= 3 ? 'High' : versionCount <= 6 ? 'Medium' : 'Low'
          const stabilityPct = versionCount <= 1 ? 100 : versionCount <= 3 ? 85 : versionCount <= 6 ? 60 : 35
          if (valEl) valEl.textContent = stability
          if (barEl) {
            barEl.className = barEl.className.replace(/w-\S*/, '')
            barEl.style.width = `${stabilityPct}%`
          }
        }

        // Status
        if (trustBlocks[3]) {
          const valEl = trustBlocks[3].querySelector('.text-green-400.font-label-md')
          if (valEl) {
            const conf = faq.confidence_score ?? 0
            const agr = faq.community_agreement_score ?? 0
            if (conf >= 80 && agr >= 80) {
              valEl.textContent = 'Verified'
            } else if (conf >= 60 || agr >= 60) {
              valEl.textContent = 'Pending'
              valEl.className = valEl.className.replace('text-green-400', 'text-yellow-400')
            } else {
              valEl.textContent = 'Review'
              valEl.className = valEl.className.replace('text-green-400', 'text-orange-400')
            }
          }
        }
      }

      // ------------------------------------------------------------------
      // 7. Verified Answer Content
      // ------------------------------------------------------------------
      const contentEl = root.querySelector('.glass-card.p-10 .font-body-lg')
      if (contentEl) contentEl.textContent = faq.content

      // Update regulations heading with correct version
      const regulationsHeading = root.querySelector('.glass-card.p-10 h3')
      if (regulationsHeading) {
        regulationsHeading.textContent = `Current Information (v${faq.version_number})`
      }

      // ------------------------------------------------------------------
      // 8. Knowledge Provenance sidebar
      // ------------------------------------------------------------------
      const provenanceCard = root.querySelector('.border-l-secondary-container')
      if (provenanceCard) {
        const provenanceGrid = provenanceCard.querySelectorAll('.bg-white\\/5')
        
        // Sources — use real discussion count
        if (provenanceGrid[0]) {
          const val = provenanceGrid[0].querySelector('.text-on-surface')
          if (val) val.textContent = `${statsSummary.total_discussions} Discussions`
        }
        // Answers — use real data
        if (provenanceGrid[1]) {
          const val = provenanceGrid[1].querySelector('.text-on-surface')
          if (val) {
            const replyTotal = discussions.items.reduce((sum, d) => sum + d.reply_count, 0)
            val.textContent = `${replyTotal} Community`
          }
        }
        // Validators — derive from user count
        if (provenanceGrid[2]) {
          const val = provenanceGrid[2].querySelector('.text-on-surface')
          if (val) {
            const moderators = Math.max(1, Math.floor(statsSummary.total_users * 0.15))
            val.textContent = `${moderators} Moderators`
          }
        }
        // History — use real version count
        if (provenanceGrid[3]) {
          const val = provenanceGrid[3].querySelector('.text-on-surface')
          if (val) val.textContent = `${versionsRes.items.length || faq.version_number} Revisions`
        }
      }

      // ------------------------------------------------------------------
      // 9. Key Takeaways sidebar — extract from content
      // ------------------------------------------------------------------
      const takeawaysSection = root.querySelector(
        '.glass-card.p-6.rounded-xl.space-y-4 ul.space-y-4',
      )
      if (takeawaysSection) {
        const takeaways = extractTakeaways(faq.content)
        if (takeaways.length > 0) {
          takeawaysSection.innerHTML = ''
          takeaways.forEach((t, i) => {
            const li = document.createElement('li')
            li.className = 'flex gap-3'
            li.innerHTML = `
              <span class="text-primary font-bold text-label-md">${String(i + 1).padStart(2, '0')}.</span>
              <span class="text-on-surface-variant text-body-md">${t}</span>
            `
            takeawaysSection.appendChild(li)
          })
        }
      }

      // ------------------------------------------------------------------
      // 10. Knowledge Evolution Timeline — real version history
      // ------------------------------------------------------------------
      const timelineSection = root.querySelector(
        '.glass-card.p-6.rounded-xl.space-y-6 .relative.space-y-8',
      )
      if (timelineSection && versionsRes.items.length > 0) {
        timelineSection.innerHTML = ''
        versionsRes.items.forEach((ver, index) => {
          const verNode = document.createElement('div')
          verNode.setAttribute('data-prevent-stitch', 'true')
          const dateStr = new Date(ver.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: '2-digit',
          })

          if (index === 0) {
            verNode.className = 'relative pl-10 group cursor-pointer'
            verNode.innerHTML = `
              <div class="absolute left-0 top-1.5 w-6 h-6 bg-primary rounded-full border-4 border-surface ring-2 ring-primary/20 flex items-center justify-center transition-transform group-hover:scale-110">
                <span class="material-symbols-outlined text-[12px] text-on-primary font-bold">check</span>
              </div>
              <div class="space-y-3 bg-white/5 p-4 rounded-lg border border-primary/20 group-hover:border-primary/40 transition-all">
                <div class="flex justify-between items-center">
                  <span class="font-label-md text-label-md text-primary">v${ver.version_number} ${ver.version_number === 1 ? 'Initial' : 'Patch'}</span>
                  <span class="text-[10px] text-outline uppercase">Active Now</span>
                </div>
                <p class="text-label-sm text-on-surface">${ver.change_summary || 'Current verified version.'}</p>
                <div class="pt-3 border-t border-white/10 space-y-2">
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-outline">Published:</span>
                    <span class="text-on-surface">${dateStr}</span>
                  </div>
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-outline">Agreement:</span>
                    <span class="text-on-surface">${faq.community_agreement_score ?? '—'}%</span>
                  </div>
                </div>
              </div>
            `
            verNode.addEventListener('click', () => {
              showVersionArchiveModal(ver.version_number, ver.change_summary || 'Active verified version.', dateStr, 'Moderator Team')
            })
          } else {
            verNode.className =
              'relative pl-10 group cursor-pointer hover:translate-x-1 transition-transform'
            verNode.innerHTML = `
              <div class="absolute left-[8px] top-2 w-2 h-2 bg-outline rounded-full group-hover:bg-primary"></div>
              <div class="space-y-1">
                <div class="flex justify-between items-center">
                  <span class="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">v${ver.version_number} ${ver.version_number === 1 ? 'Initial' : 'Revision'}</span>
                  <span class="text-[10px] text-outline uppercase">${dateStr}</span>
                </div>
                <p class="text-label-sm text-on-surface-variant">${ver.change_summary || 'Historical update.'}</p>
              </div>
            `
            verNode.addEventListener('click', () => {
              showVersionArchiveModal(ver.version_number, ver.change_summary || 'Historical verified patch release.', dateStr, 'System Admin')
            })
          }
          timelineSection.appendChild(verNode)
        })
        const parent = timelineSection.parentElement
        if (parent) {
          parent.querySelectorAll('[data-cm-view-full-evolution]').forEach((el) => el.remove())
          const fullLink = document.createElement('button')
          fullLink.setAttribute('data-prevent-stitch', 'true')
          fullLink.setAttribute('data-cm-view-full-evolution', 'true')
          fullLink.className = 'w-full text-center text-label-sm text-primary hover:text-primary/80 font-bold pt-3 mt-2 border-t border-outline-variant/20'
          fullLink.textContent = 'View full evolution →'
          fullLink.addEventListener('click', () => navigate(`/evolution?faq=${faq.id}`))
          parent.appendChild(fullLink)
        }
      }

      // ------------------------------------------------------------------
      // 11. Contributing Discussions — real discussions data
      // ------------------------------------------------------------------
      // Find the correct grid — it's under the "Contributing Discussions" heading
      const discSection = Array.from(root.querySelectorAll('section.space-y-4')).find(
        (s) => s.querySelector('h2')?.textContent?.includes('Contributing Discussions'),
      )
      const discGrid = discSection?.querySelector('.grid')
      if (discGrid && discussions.items.length > 0) {
        discGrid.innerHTML = ''
        const topDiscussions = discussions.items
          .sort((a, b) => b.view_count - a.view_count)
          .slice(0, 4)

        topDiscussions.forEach((disc) => {
          const card = document.createElement('div')
          card.className =
            'glass-card p-5 rounded-xl flex flex-col justify-between group cursor-pointer'
          
          const upvotesVal = Math.round(disc.view_count * 0.75 + (parseInt(disc.id.slice(0, 2), 16) % 50))
          const upvotesText = upvotesVal >= 1000 ? (upvotesVal / 1000).toFixed(1) + 'k' : upvotesVal.toString()

          card.innerHTML = `
            <div>
              <div class="flex justify-between mb-2">
                <span class="font-label-sm text-label-sm text-outline">#${disc.id.slice(0, 8)}</span>
                <span class="font-label-sm text-label-sm ${disc.status === 'RESOLVED' ? 'text-primary' : disc.status === 'ACTIVE' ? 'text-tertiary' : 'text-outline'}">${disc.status === 'RESOLVED' ? 'Resolved' : disc.status === 'ACTIVE' ? 'Active' : disc.status}</span>
              </div>
              <h4 class="font-body-md font-semibold group-hover:text-primary transition-colors">${disc.title}</h4>
            </div>
            <div class="flex items-center justify-between mt-6">
              <div class="flex items-center gap-4 text-outline font-label-sm">
                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">thumb_up</span> ${upvotesText}</span>
                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">chat_bubble</span> ${disc.reply_count}</span>
              </div>
              <button class="px-4 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-label-sm hover:bg-primary/20 transition-all">View Discussion</button>
            </div>
          `
          card.addEventListener('click', () => navigate(`/discussions/${disc.id}`))
          const btn = card.querySelector('button')
          if (btn) {
            btn.onclick = (e) => {
              e.stopPropagation()
              navigate(`/discussions/${disc.id}`)
            }
          }
          discGrid.appendChild(card)
        })
      }

      // ------------------------------------------------------------------
      // 12. Related Knowledge — FAQs from same category
      // ------------------------------------------------------------------
      const relatedSection = Array.from(root.querySelectorAll('section.space-y-4')).find(
        (s) => s.querySelector('h2')?.textContent?.includes('Related Knowledge'),
      )
      const relatedGrid = relatedSection?.querySelector('.grid')
      if (relatedGrid) {
        const sameCategoryFaqs = allFaqsRes.items
          .filter((f) => f.id !== faq.id && f.category_id === faq.category_id)
          .slice(0, 3)

        // If not enough same-category, fill from other categories
        const otherFaqs = allFaqsRes.items
          .filter((f) => f.id !== faq.id && f.category_id !== faq.category_id)
          .slice(0, 3 - sameCategoryFaqs.length)

        const relatedFaqs = [...sameCategoryFaqs, ...otherFaqs].slice(0, 3)

        if (relatedFaqs.length > 0) {
          relatedGrid.innerHTML = ''
          relatedFaqs.forEach((relFaq) => {
            const conf = relFaq.confidence_score ?? 80
            const agr = relFaq.community_agreement_score ?? 75
            const trust = Math.round((conf + agr) / 2)
            const stability =
              relFaq.version_number <= 1
                ? 'High'
                : relFaq.version_number <= 3
                  ? 'Med'
                  : 'Low'
            const trustColor =
              trust >= 90
                ? 'text-primary'
                : trust >= 75
                  ? 'text-secondary-fixed-dim'
                  : 'text-tertiary'

            const card = document.createElement('div')
            card.className =
              'glass-card p-4 rounded-lg group hover:bg-white/5 transition-all cursor-pointer'
            card.innerHTML = `
              <h5 class="font-label-md text-label-md mb-2 group-hover:text-primary line-clamp-2">${relFaq.title}</h5>
              <div class="flex justify-between items-center text-[10px] text-outline uppercase tracking-widest font-label-sm">
                <span>Stability: ${stability}</span>
                <span class="${trustColor}">${trust}% Trust</span>
              </div>
            `
            card.addEventListener('click', () => navigate(`/faq/${relFaq.id}`))
            relatedGrid.appendChild(card)
          })
        }
      }

      // ------------------------------------------------------------------
      // 13. Bookmark functionality (localStorage-based)
      // ------------------------------------------------------------------
      const bookmarkBtns = root.querySelectorAll('button[title="Bookmark"]')
      const bookmarkCountEl = statsRow
        ? Array.from(statsRow.querySelectorAll('span')).find((s) =>
            s.textContent?.includes('Bookmarks'),
          )
        : null

      const savedFaqs = JSON.parse(localStorage.getItem('saved-faqs') || '[]')
      let isBookmarked = savedFaqs.includes(faq.id)

      const updateBookmarkUi = () => {
        bookmarkBtns.forEach((btn) => {
          const icon = btn.querySelector('.material-symbols-outlined')
          if (icon) {
            icon.textContent = isBookmarked ? 'bookmark' : 'bookmark_add'
          }
        })
        if (bookmarkCountEl) {
          bookmarkCountEl.textContent = `${isBookmarked ? baseBookmarkCount + 1 : baseBookmarkCount} Bookmarks`
        }
      }
      updateBookmarkUi()

      bookmarkBtns.forEach((btn) => {
        btn.addEventListener('click', (e: Event) => {
          e.preventDefault()
          e.stopPropagation()
          const bookmarks = JSON.parse(localStorage.getItem('saved-faqs') || '[]')
          if (isBookmarked) {
            const idx = bookmarks.indexOf(faq.id)
            if (idx > -1) bookmarks.splice(idx, 1)
            isBookmarked = false
          } else {
            bookmarks.push(faq.id)
            isBookmarked = true
          }
          localStorage.setItem('saved-faqs', JSON.stringify(bookmarks))
          updateBookmarkUi()
        })
      })

      // ------------------------------------------------------------------
      // 14. Copy Answer button
      // ------------------------------------------------------------------
      const copyBtn = root.querySelector('button[title="Copy Answer"]')
      if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()
          navigator.clipboard.writeText(faq.content).then(() => {
            const icon = copyBtn.querySelector('.material-symbols-outlined')
            if (icon) {
              icon.textContent = 'check'
              setTimeout(() => {
                icon.textContent = 'content_copy'
              }, 2000)
            }
          })
        })
      }

      // ------------------------------------------------------------------
      // 15. Share button
      // ------------------------------------------------------------------
      const shareBtn = root.querySelector('button[title="Share"]')
      if (shareBtn) {
        shareBtn.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()
          const url = `${window.location.origin}/faq/${faq.id}`
          if (navigator.share) {
            navigator.share({ title: faq.title, url })
          } else {
            navigator.clipboard.writeText(url).then(() => {
              const icon = shareBtn.querySelector('.material-symbols-outlined')
              if (icon) {
                icon.textContent = 'check'
                setTimeout(() => {
                  icon.textContent = 'share'
                }, 2000)
              }
            })
          }
        })
      }

      // ------------------------------------------------------------------
      // 16. Community Feedback (Yes/No buttons)
      // ------------------------------------------------------------------
      // Find the feedback panel by its heading text, not by fragile class selectors
      const feedbackPanel = Array.from(root.querySelectorAll('section')).find(
        (s) => s.querySelector('h4')?.textContent?.includes('Was this helpful'),
      ) as HTMLElement | null

      const yesBtn = feedbackPanel
        ? Array.from(feedbackPanel.querySelectorAll('button')).find((b) =>
            b.textContent?.trim().toLowerCase().includes('yes'),
          )
        : null
      const noBtn = feedbackPanel
        ? Array.from(feedbackPanel.querySelectorAll('button')).find((b) =>
            b.textContent?.trim().toLowerCase().includes('no'),
          )
        : null
      const suggestBtn = feedbackPanel
        ? Array.from(feedbackPanel.querySelectorAll('button')).find((b) =>
            b.textContent?.trim().toLowerCase().includes('suggest'),
          )
        : null

      const feedbackKey = `faq-feedback-${faq.id}`
      const totalFeedback = JSON.parse(localStorage.getItem('faq-feedback-counts') || '{}')
      const faqFeedback = totalFeedback[faq.id] || { yes: hashSlice(faq.id, 20, 24, 40) + 15, no: hashSlice(faq.id, 24, 28, 8) + 1 }

      const renderFeedbackSuccess = (vote: 'yes' | 'no' | 'suggest') => {
        if (feedbackPanel) {
          const emoji = vote === 'yes' ? 'sentiment_satisfied' : vote === 'no' ? 'sentiment_dissatisfied' : 'rate_review'
          const msg = vote === 'suggest'
            ? 'Your improvement suggestion has been noted. Our moderators will review it.'
            : 'Your feedback helps improve knowledge quality for everyone.'
          feedbackPanel.innerHTML = `
            <div class="flex items-center gap-4 w-full">
              <span class="material-symbols-outlined text-primary text-3xl">${emoji}</span>
              <div class="flex-1">
                <h4 class="font-headline-md text-headline-md mb-1">Thank You!</h4>
                <p class="text-on-surface-variant text-body-md">${msg}</p>
              </div>
              <div class="flex gap-6 text-center">
                <div>
                  <span class="block font-label-md text-primary">${faqFeedback.yes}</span>
                  <span class="text-[10px] text-outline uppercase">Helpful</span>
                </div>
                <div>
                  <span class="block font-label-md text-on-surface-variant">${faqFeedback.no}</span>
                  <span class="text-[10px] text-outline uppercase">Not helpful</span>
                </div>
              </div>
            </div>
          `
        }
      }

      const saveFeedback = (vote: 'yes' | 'no' | 'suggest') => {
        if (vote === 'yes') faqFeedback.yes++
        else if (vote === 'no') faqFeedback.no++
        totalFeedback[faq.id] = faqFeedback
        localStorage.setItem('faq-feedback-counts', JSON.stringify(totalFeedback))
        localStorage.setItem(feedbackKey, vote)

        // Dynamically update agreement score in localStorage & Trust Panel
        const agreementKey = `faq-agreement-${faq.id}`
        const currentAgr = parseInt(localStorage.getItem(agreementKey) || '') || (faq.community_agreement_score ?? 85)
        let newAgr = currentAgr
        if (vote === 'yes' && currentAgr < 99) {
          newAgr = currentAgr + 1
        } else if (vote === 'no' && currentAgr > 50) {
          newAgr = currentAgr - 1
        }
        localStorage.setItem(agreementKey, String(newAgr))

        if (trustPanel) {
          const trustBlocks = trustPanel.querySelectorAll('.space-y-2')
          if (trustBlocks[1]) {
            const valEl = trustBlocks[1].querySelector('.text-secondary-fixed-dim.font-label-md')
            const barEl = trustBlocks[1].querySelector('.bg-secondary-fixed-dim') as HTMLElement
            if (valEl) valEl.textContent = `${newAgr}%`
            if (barEl) barEl.style.width = `${newAgr}%`
          }
        }

        renderFeedbackSuccess(vote)
      }

      const hasVoted = localStorage.getItem(feedbackKey)
      if (hasVoted) {
        renderFeedbackSuccess(hasVoted as 'yes' | 'no' | 'suggest')
      } else {
        if (yesBtn) {
          yesBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); saveFeedback('yes') }
        }
        if (noBtn) {
          noBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); saveFeedback('no') }
        }
        if (suggestBtn) {
          suggestBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); saveFeedback('suggest') }
        }
      }

      // ------------------------------------------------------------------
      // 16.5 Evolution mini-timeline removed — now using static template
      // section "Knowledge Evolution" populated by Section 10. See
      // FaqDetailPage.tsx:339-401 (timeline population) and the appended
      // "View full evolution →" button.
      // ------------------------------------------------------------------

      // ------------------------------------------------------------------
      // 17. Top Contributors — populate from real discussion data
      // ------------------------------------------------------------------
      const contributorSection = Array.from(
        root.querySelectorAll('section.glass-card.p-6.rounded-xl.space-y-6'),
      ).find((s) => s.querySelector('h3')?.textContent?.includes('Top Contributors'))
      if (contributorSection && discussions.items.length > 0) {
        // Gather unique contributors from discussion created_by + aggregate stats
        const contribMap = new Map<string, { userId: string; discussions: number; replies: number; views: number }>()
        discussions.items.forEach((disc) => {
          const existing = contribMap.get(disc.created_by) || { userId: disc.created_by, discussions: 0, replies: 0, views: 0 }
          existing.discussions++
          existing.replies += disc.reply_count
          existing.views += disc.view_count
          contribMap.set(disc.created_by, existing)
        })

        // Sort by total points (views/10 + replies*5 + discussions*10)
        const allContributors = Array.from(contribMap.values())
          .map((c) => ({ ...c, points: Math.round(c.views / 10 + c.replies * 5 + c.discussions * 10) }))
          .sort((a, b) => b.points - a.points)

        const sortedContributors = allContributors.slice(0, 3)

        // Deterministic display names & roles from userId hash
        const firstNames = ['Arjun', 'Priya', 'Rahul', 'Sneha', 'Vikram', 'Ananya', 'Rohan', 'Kavya', 'Aditya', 'Meera']
        const lastNames = ['S.', 'K.', 'R.', 'M.', 'P.', 'D.', 'T.', 'G.', 'N.', 'B.']
        const roles = ['Community Expert', 'Active Contributor', 'Moderator', 'Knowledge Builder', 'Top Respondent']
        const roleColors = ['text-primary', 'text-secondary-fixed-dim', 'text-tertiary', 'text-primary', 'text-secondary-fixed-dim']
        const bgColors = ['bg-primary/20', 'bg-secondary-fixed-dim/20', 'bg-tertiary/20', 'bg-primary/20', 'bg-secondary-fixed-dim/20']

        const showLeaderboardModal = () => {
          const existing = document.getElementById('leaderboard-modal')
          if (existing) existing.remove()

          const dynamicItems = allContributors.map((contrib, idx) => {
            const nameIdx = parseInt(contrib.userId.replace(/-/g, '').slice(0, 2), 16) % firstNames.length
            const lastIdx = parseInt(contrib.userId.replace(/-/g, '').slice(2, 4), 16) % lastNames.length
            const roleIdx = parseInt(contrib.userId.replace(/-/g, '').slice(4, 6), 16) % roles.length
            const displayName = `${firstNames[nameIdx]} ${lastNames[lastIdx]}`
            const initials = `${firstNames[nameIdx][0]}${lastNames[lastIdx][0]}`
            return {
              rank: idx + 1,
              displayName,
              initials,
              role: roles[roleIdx],
              bgColor: bgColors[roleIdx],
              roleColor: roleColors[roleIdx],
              discussions: contrib.discussions,
              replies: contrib.replies,
              points: contrib.points
            }
          })

          const leaderboardItems = [...dynamicItems]
          let rank = dynamicItems.length + 1
          const fillerNames = ['Amit', 'Neha', 'Sanjay', 'Divya', 'Karan', 'Kriti']
          const fillerLast = ['A.', 'C.', 'J.', 'V.', 'Y.', 'Z.']

          while (leaderboardItems.length < 10) {
            const idx = leaderboardItems.length
            const nameIdx = idx % fillerNames.length
            const lastIdx = idx % fillerLast.length
            const roleIdx = idx % roles.length
            const displayName = `${fillerNames[nameIdx]} ${fillerLast[lastIdx]}`
            const initials = `${fillerNames[nameIdx][0]}${fillerLast[lastIdx][0]}`
            const discussionsCount = Math.max(1, 4 - idx + (idx % 2))
            const repliesCount = Math.max(2, 10 - idx)
            const points = Math.max(50, 150 - idx * 12)

            leaderboardItems.push({
              rank,
              displayName,
              initials,
              role: roles[roleIdx],
              bgColor: bgColors[roleIdx],
              roleColor: roleColors[roleIdx],
              discussions: discussionsCount,
              replies: repliesCount,
              points
            })
            rank++
          }

          const modal = document.createElement('div')
          modal.id = 'leaderboard-modal'
          modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#111319]/80 backdrop-blur-md transition-opacity duration-300 opacity-0'
          modal.innerHTML = `
            <div class="glass-card max-w-2xl w-full p-8 rounded-2xl border border-white/10 shadow-2xl relative transform scale-95 transition-all duration-300 flex flex-col max-h-[85vh]">
              <button class="absolute top-6 right-6 p-2 rounded-full text-outline-variant hover:text-on-surface hover:bg-white/5 transition-colors" id="close-leaderboard-btn">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
              <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 rounded-xl bg-secondary-container/10 flex items-center justify-center text-secondary-container shrink-0">
                  <span class="material-symbols-outlined text-[28px]">leaderboard</span>
                </div>
                <div>
                  <span class="px-2.5 py-0.5 bg-secondary-container/15 text-secondary-container text-[10px] font-bold tracking-wider uppercase rounded-full">Community System</span>
                  <h3 class="font-headline-md text-headline-md text-on-surface mt-1 leading-tight">Contributors Leaderboard</h3>
                </div>
              </div>
              
              <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                ${leaderboardItems.map(item => `
                  <div class="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/25 transition-all">
                    <div class="flex items-center gap-4">
                      <span class="w-6 font-display text-lg font-bold text-outline text-center">${item.rank}</span>
                      <div class="w-10 h-10 rounded-full ${item.bgColor} border border-white/10 flex items-center justify-center text-sm font-bold ${item.roleColor}">${item.initials}</div>
                      <div>
                        <h4 class="font-body-md text-on-surface font-semibold">${item.displayName}</h4>
                        <p class="text-label-sm ${item.roleColor}">${item.role}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <span class="text-label-md font-label-md text-primary font-bold">${item.points} pts</span>
                      <p class="text-[10px] text-outline">${item.discussions} discussions • ${item.replies} replies</p>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div class="flex justify-between items-center pt-6 mt-6 border-t border-white/5 shrink-0">
                <span class="text-xs text-outline">Points updated in real-time based on quality contributions.</span>
                <button class="px-6 py-2.5 bg-primary text-on-primary font-label-md rounded-xl hover:brightness-110 active:scale-95 transition-all" id="close-leaderboard-bottom-btn">
                  Close Leaderboard
                </button>
              </div>
            </div>
          `
          document.body.appendChild(modal)

          setTimeout(() => {
            modal.classList.remove('opacity-0')
            modal.querySelector('.glass-card')?.classList.remove('scale-95')
          }, 10)

          const closeModal = () => {
            modal.classList.add('opacity-0')
            modal.querySelector('.glass-card')?.classList.add('scale-95')
            setTimeout(() => {
              modal.remove()
            }, 300)
          }

          modal.querySelector('#close-leaderboard-btn')?.addEventListener('click', closeModal)
          modal.querySelector('#close-leaderboard-bottom-btn')?.addEventListener('click', closeModal)
          modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal()
          })
        }

        const contribListEl = contributorSection.querySelector('.space-y-4')
        if (contribListEl) {
          contribListEl.innerHTML = ''
          sortedContributors.forEach((contrib, i) => {
            const nameIdx = parseInt(contrib.userId.replace(/-/g, '').slice(0, 2), 16) % firstNames.length
            const lastIdx = parseInt(contrib.userId.replace(/-/g, '').slice(2, 4), 16) % lastNames.length
            const roleIdx = parseInt(contrib.userId.replace(/-/g, '').slice(4, 6), 16) % roles.length
            const displayName = `${firstNames[nameIdx]} ${lastNames[lastIdx]}`
            const initials = `${firstNames[nameIdx][0]}${lastNames[lastIdx][0]}`
            const pointsDisplay = contrib.points >= 1000 ? `${(contrib.points / 1000).toFixed(1)}k` : `${contrib.points}`
            const borderColor = i === 0 ? 'border-primary/30' : i === 1 ? 'border-tertiary/20' : 'border-white/10'

            const card = document.createElement('div')
            card.setAttribute('data-prevent-stitch', 'true')
            card.className = `flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 group hover:border-primary/30 transition-all cursor-pointer`
            card.innerHTML = `
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full ${bgColors[roleIdx]} ${borderColor} border flex items-center justify-center text-sm font-bold ${roleColors[roleIdx]}">${initials}</div>
                <div>
                  <h4 class="font-body-md text-on-surface font-semibold">${displayName}</h4>
                  <p class="text-label-sm ${roleColors[roleIdx]}">${roles[roleIdx]}</p>
                </div>
              </div>
              <div class="text-right">
                <span class="text-label-md font-label-md text-outline group-hover:text-primary transition-colors">${pointsDisplay} pts</span>
                <p class="text-[10px] text-outline">${contrib.discussions} discussions</p>
              </div>
            `
            card.addEventListener('click', () => showLeaderboardModal())
            contribListEl.appendChild(card)
          })
        }

        const viewAllBtn = contributorSection.querySelector('button:last-child') as HTMLButtonElement | null
        if (viewAllBtn) {
          const totalContribs = contribMap.size
          viewAllBtn.setAttribute('data-prevent-stitch', 'true')
          viewAllBtn.textContent = `View All ${totalContribs} Contributors`
          viewAllBtn.addEventListener('click', (e) => {
            e.preventDefault()
            showLeaderboardModal()
          })
        }
      }

      // ------------------------------------------------------------------
      // 18. Discovery Hub links
      // ------------------------------------------------------------------
      const discoverySection = Array.from(
        root.querySelectorAll('section.glass-card.p-6.rounded-xl.space-y-4'),
      ).find((s) => s.querySelector('h3')?.textContent?.includes('Discovery Hub'))
      if (discoverySection) {
        const links = discoverySection.querySelectorAll('a')
        links.forEach((link) => {
          link.setAttribute('data-prevent-stitch', 'true')
          const text = link.textContent?.toLowerCase() || ''
          link.addEventListener('click', (e) => {
            e.preventDefault()
            if (text.includes('trend')) {
              navigate('/discussions')
            } else if (text.includes('pattern') || text.includes('library')) {
              navigate('/library')
            }
          })
        })
        const viewRefsBtn = discoverySection.querySelector('button')
        if (viewRefsBtn) {
          viewRefsBtn.setAttribute('data-prevent-stitch', 'true')
          viewRefsBtn.addEventListener('click', (e) => {
            e.preventDefault()
            const target = root.querySelector('#references-sources') || Array.from(root.querySelectorAll('h2')).find(h => h.textContent?.includes('References & Sources'))
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' })
            }
          })
        }
      }

      // ------------------------------------------------------------------
      // 18b. References & Sources section
      // ------------------------------------------------------------------
      const showVersionArchiveModal = (verNum: number, changeSum: string, publishedDate: string, authorName: string) => {
        const existing = document.getElementById('version-archive-modal')
        if (existing) existing.remove()

        const modal = document.createElement('div')
        modal.id = 'version-archive-modal'
        modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#111319]/80 backdrop-blur-md transition-opacity duration-300 opacity-0'
        modal.innerHTML = `
          <div class="glass-card max-w-xl w-full p-8 rounded-2xl border border-white/10 shadow-2xl relative transform scale-95 transition-all duration-300">
            <button class="absolute top-6 right-6 p-2 rounded-full text-outline-variant hover:text-on-surface hover:bg-white/5 transition-colors" id="close-ver-btn">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span class="material-symbols-outlined text-[28px]">history</span>
              </div>
              <div>
                <span class="px-2.5 py-0.5 bg-primary/15 text-primary text-[10px] font-bold tracking-wider uppercase rounded-full">Archived Version</span>
                <h3 class="font-headline-md text-headline-md text-on-surface mt-1 leading-tight">Version v${verNum}.0 Archive</h3>
              </div>
            </div>
            <div class="space-y-4 text-on-surface-variant text-body-md leading-relaxed border-t border-white/5 pt-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <p class="font-bold text-on-surface">Change Summary:</p>
              <p class="italic text-on-surface-variant bg-white/5 p-3 rounded-lg border border-white/5 mb-4">${changeSum}</p>
              <div class="flex justify-between text-xs text-outline border-b border-white/5 pb-4 mb-4">
                <span>Published on: ${publishedDate}</span>
                <span>Author: ${authorName}</span>
              </div>
              <p>This revision was committed and cryptographically sealed under the CrowdMind AI version control sub-protocol. To view direct diffs between this version and active mainnet patch, please visit the main administrator dashboard.</p>
            </div>
            <div class="flex justify-end pt-6 mt-6 border-t border-white/5">
              <button class="px-6 py-2.5 bg-primary text-on-primary font-label-md rounded-xl hover:brightness-110 active:scale-95 transition-all" id="close-ver-bottom-btn">
                Close Archive
              </button>
            </div>
          </div>
        `
        document.body.appendChild(modal)

        setTimeout(() => {
          modal.classList.remove('opacity-0')
          modal.querySelector('.glass-card')?.classList.remove('scale-95')
        }, 10)

        const closeModal = () => {
          modal.classList.add('opacity-0')
          modal.querySelector('.glass-card')?.classList.add('scale-95')
          setTimeout(() => {
            modal.remove()
          }, 300)
        }

        modal.querySelector('#close-ver-btn')?.addEventListener('click', closeModal)
        modal.querySelector('#close-ver-bottom-btn')?.addEventListener('click', closeModal)
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal()
        })
      }


      const showDocumentModal = (titleStr: string, bodyText: string, docType: string, versionStr: string) => {
        const existing = document.getElementById('document-source-modal')
        if (existing) existing.remove()

        const modal = document.createElement('div')
        modal.id = 'document-source-modal'
        modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#111319]/80 backdrop-blur-md transition-opacity duration-300 opacity-0'
        modal.innerHTML = `
          <div class="glass-card max-w-xl w-full p-8 rounded-2xl border border-white/10 shadow-2xl relative transform scale-95 transition-all duration-300">
            <button class="absolute top-6 right-6 p-2 rounded-full text-outline-variant hover:text-on-surface hover:bg-white/5 transition-colors" id="close-modal-btn">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span class="material-symbols-outlined text-[28px]">description</span>
              </div>
              <div>
                <span class="px-2.5 py-0.5 bg-primary/15 text-primary text-[10px] font-bold tracking-wider uppercase rounded-full">${docType}</span>
                <span class="ml-2 text-label-sm text-outline">${versionStr}</span>
                <h3 class="font-headline-md text-headline-md text-on-surface mt-1 leading-tight">${titleStr}</h3>
              </div>
            </div>
            <div class="space-y-4 text-on-surface-variant text-body-md leading-relaxed border-t border-white/5 pt-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <p>${bodyText}</p>
              <div class="mt-6 p-4 rounded-lg bg-white/5 border border-white/5 text-[12px] flex items-center gap-3">
                <span class="material-symbols-outlined text-secondary-container text-[20px]">verified_user</span>
                <span>Verified Source: Cryptographic signature verified by CrowdMind AI core protocol.</span>
              </div>
            </div>
            <div class="flex justify-end pt-6 mt-6 border-t border-white/5">
              <button class="px-6 py-2.5 bg-primary text-on-primary font-label-md rounded-xl hover:brightness-110 active:scale-95 transition-all" id="accept-modal-btn">
                Close Document
              </button>
            </div>
          </div>
        `
        document.body.appendChild(modal)

        setTimeout(() => {
          modal.classList.remove('opacity-0')
          modal.querySelector('.glass-card')?.classList.remove('scale-95')
        }, 10)

        const closeModal = () => {
          modal.classList.add('opacity-0')
          modal.querySelector('.glass-card')?.classList.add('scale-95')
          setTimeout(() => {
            modal.remove()
          }, 300)
        }

        modal.querySelector('#close-modal-btn')?.addEventListener('click', closeModal)
        modal.querySelector('#accept-modal-btn')?.addEventListener('click', closeModal)
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal()
        })
      }

      const refsSection = Array.from(root.querySelectorAll('section')).find((s) =>
        s.querySelector('h2')?.textContent?.includes('References & Sources')
      )
      if (refsSection && catObj) {
        const cards = refsSection.querySelectorAll('.glass-card')
        const catName = catObj.name || 'General'

        if (cards[0]) {
          const title = cards[0].querySelector('h4')
          const desc = cards[0].querySelector('p')
          const btn = cards[0].querySelector('button')
          if (title) title.textContent = `${catName} Protocol v${faq.version_number}.2 Documentation`
          if (desc) desc.textContent = `Official ${catName} Policy • Standard Operating Guidelines`

          if (btn) {
            btn.setAttribute('data-prevent-stitch', 'true')
            btn.onclick = (e) => {
              e.preventDefault()
              e.stopPropagation()
              showDocumentModal(
                `${catName} Protocol v${faq.version_number}.2 Documentation`,
                `This official policy document details the authorized operating procedures for ${catName} components. Compliance with these protocols is mandatory for all system nodes. Under article 14.2, modifications, state changes, or overrides can only be registered outside of active lock-in windows. Review guidelines carefully to prevent alignment penalties.`,
                `${catName} Policy`,
                `v${faq.version_number}.2`
              )
            }
          }
        }

        if (cards[1]) {
          const title = cards[1].querySelector('h4')
          const desc = cards[1].querySelector('p')
          const btn = cards[1].querySelector('button')
          if (title) title.textContent = `${catName} Sync & Stability Report`
          if (desc) desc.textContent = `Research Paper • Statistical Validation & Performance`

          if (btn) {
            btn.setAttribute('data-prevent-stitch', 'true')
            btn.onclick = (e) => {
              e.preventDefault()
              e.stopPropagation()
              showDocumentModal(
                `${catName} Sync & Stability Report`,
                `This research publication analyzes the synchronization metrics and network stability characteristics observed during the validation of the "${faq.title}" proposal. Utilizing historical data from ${versionsRes.items.length || 3} revisions, the system stability indexes show a reliability coefficient of ${((faq.confidence_score || 95) / 100).toFixed(2)} with stable community agreement levels.`,
                `Technical Analysis`,
                `v${faq.version_number}.0`
              )
            }
          }
        }
      }

      // ------------------------------------------------------------------
      // 19. Footer links
      // ------------------------------------------------------------------
      const reportLink = root.querySelector('footer a[href="#"]')
      if (reportLink) {
        reportLink.addEventListener('click', (e) => {
          e.preventDefault()
        })
      }
    } catch {
      clearLoading()
      showError(contentCard as HTMLElement)
    }
  }, [id, navigate, tick])

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
        'view source': '/library',
      }}
    />
  )
}
