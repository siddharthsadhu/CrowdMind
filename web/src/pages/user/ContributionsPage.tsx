import { useStitchData } from '@/hooks/useStitchData'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/13-contributions'
import { commonUserNav } from '@/data/navMaps'
import { usersApi, ContributionItem } from '@/services/api/users'
import { showLoading, showError, showEmpty } from '@/utils/pageStatus'

const TYPE_LABEL: Record<ContributionItem['type'], string> = {
  question: 'QUESTION',
  reply: 'REPLY',
  discussion: 'DISCUSSION',
  faq: 'FAQ',
  faq_version: 'FAQ VERSION',
}

const TYPE_ICON: Record<ContributionItem['type'], string> = {
  question: 'help',
  reply: 'reply',
  discussion: 'forum',
  faq: 'verified',
  faq_version: 'history',
}

const TYPE_COLOR: Record<ContributionItem['type'], string> = {
  question: 'text-primary',
  reply: 'text-secondary-fixed-dim',
  discussion: 'text-tertiary-fixed-dim',
  faq: 'text-primary',
  faq_version: 'text-on-surface-variant',
}

export default function ContributionsPage() {
  const navigate = useNavigate()

  useStitchData(async (root) => {
    const feed = root.querySelector('.space-y-4')
    if (!feed) return

    const clearLoading = showLoading(feed as HTMLElement)

    try {
      const res = await usersApi.getMyContributions()
      clearLoading()

      // Update summary cards (if present) — find the 5 stat cards by their labels
      const summary = res.summary
      const labelToValue: Record<string, number> = {
        'questions': summary.questions,
        'replies': summary.replies,
        'discussions': summary.discussions,
        'published faqs': summary.faqs_published,
        'faq versions': summary.faq_versions,
      }
      Object.entries(labelToValue).forEach(([label, val]) => {
        const card = Array.from(root.querySelectorAll('.glass-card')).find(c =>
          (c.textContent ?? '').toLowerCase().includes(label)
        )
        const valEl = card?.querySelector('.text-headline-md, .font-headline-md')
        if (valEl) valEl.textContent = val.toString()
      })

      if (res.items.length === 0) {
        showEmpty(feed as HTMLElement)
        return
      }

      const template = feed.querySelector('.glass-card') as HTMLElement | null
      if (!template) return

      feed.innerHTML = ''

      res.items.forEach((item) => {
        const card = template.cloneNode(true) as HTMLElement
        const titleEl = card.querySelector('h4')
        const snippetEl = card.querySelector('p.font-body-md, p.text-body-md, p')
        const statusEl = card.querySelector('.text-primary.font-bold, .text-secondary-fixed-dim.font-bold, .text-on-surface-variant.font-bold')
        const iconEl = card.querySelector('.material-symbols-outlined')
        const dateEl = Array.from(card.querySelectorAll('span')).find(s => s.textContent?.match(/\d/))

        if (titleEl) titleEl.textContent = item.title
        if (snippetEl) {
          const text = item.snippet ?? ''
          snippetEl.textContent = text.length > 160 ? text.slice(0, 160) + '...' : text
        }
        if (statusEl) statusEl.textContent = item.status ?? TYPE_LABEL[item.type]
        if (iconEl) {
          iconEl.textContent = TYPE_ICON[item.type]
          iconEl.classList.add(TYPE_COLOR[item.type])
        }
        if (dateEl && item.created_at) {
          dateEl.textContent = new Date(item.created_at).toLocaleDateString()
        }

        // Make card clickable
        card.classList.add('cursor-pointer', 'hover:opacity-90', 'transition-opacity')
        card.onclick = (e) => {
          e.preventDefault()
          if (item.url) navigate(item.url)
        }

        feed.appendChild(card)
      })
    } catch {
      clearLoading()
      showError(feed as HTMLElement)
    }
  }, [navigate])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | My Contributions"
      navMap={{ ...commonUserNav, profile: '/home', view: '/faq/1' }}
    />
  )
}
