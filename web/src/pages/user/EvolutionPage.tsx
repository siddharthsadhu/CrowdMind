import { useStitchData } from '@/hooks/useStitchData'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/14-evolution'
import { commonUserNav } from '@/data/navMaps'
import { faqsApi } from '@/services/api/faqs'
import { showLoading, showError, showEmpty } from '@/utils/pageStatus'

export default function EvolutionPage() {
  const navigate = useNavigate()

  useStitchData(async (root) => {
    const timeline = root.querySelector('.space-y-4 .flex.flex-col.md\\:flex-row')
    if (!timeline) return

    const parent = timeline.parentElement
    if (!parent) return

    const clearLoading = showLoading(parent as HTMLElement)

    try {
      const res = await faqsApi.list({ page_size: '3' })
      clearLoading()

      if (res.items.length === 0) {
        showEmpty(parent as HTMLElement)
        return
      }

      for (let i = 0; i < Math.min(res.items.length, 3); i++) {
        const faq = res.items[i]
        const titleEl = root.querySelectorAll('.font-headline-md.text-on-surface')
        if (titleEl[i]) titleEl[i].textContent = faq.title
      }
    } catch {
      clearLoading()
      showError(parent as HTMLElement)
    }
  }, [navigate])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Knowledge Evolution"
      navMap={{ ...commonUserNav, 'view faq': '/faq/2', timeline: '/library' }}
    />
  )
}
