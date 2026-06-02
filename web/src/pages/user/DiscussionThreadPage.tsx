import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/08-thread'
import { commonUserNav } from '@/data/navMaps'
import { discussionsApi } from '@/services/api/discussions'
import { repliesApi } from '@/services/api/replies'

export default function DiscussionThreadPage() {
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
        const disc = await discussionsApi.getById(id)
        document.title = `CrowdMind | ${disc.title}`

        const titleEl = root.querySelector('h1')
        const catEl = root.querySelector('.bg-secondary-container\\/10')
        const viewsEl = root.querySelector('.flex.items-center.gap-1.font-label-md span + span')
        const authorEl = root.querySelector('.font-label-md.text-label-md.text-on-surface-variant')

        if (titleEl) titleEl.textContent = disc.title
        if (catEl) catEl.textContent = disc.status ?? 'General'
        if (viewsEl && viewsEl.parentElement) {
          viewsEl.parentElement.innerHTML = `<span class="material-symbols-outlined text-[18px]">visibility</span> ${disc.view_count} views`
        }
        if (authorEl) authorEl.textContent = disc.created_by?.slice(0, 8) ?? 'Anonymous'

        const replies = await repliesApi.listByDiscussion(id)
        const replyFeed = root.querySelector('.md\\:col-span-8.space-y-gutter')
        if (replyFeed && replies.items.length > 0) {
          const template = replyFeed.querySelector('section.glass-card.rounded-xl.border')
          if (template) {
            template.querySelector('.font-headline-md.text-headline-md')!.textContent =
              replies.items[0].content?.slice(0, 80) ?? ''
          }
        }
      } catch {
        // keep static content
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [id, navigate])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Discussion Thread"
      navMap={{
        ...commonUserNav,
        back: '/discussions',
        'all discussions': '/discussions',
      }}
    />
  )
}
