import { useStitchData } from '@/hooks/useStitchData'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/05-ask'
import { commonUserNav } from '@/data/navMaps'
import { questionsApi } from '@/services/api/questions'
import { categoriesApi } from '@/services/api/categories'

export default function AskQuestionPage() {
  const navigate = useNavigate()

  useStitchData(async (root) => {
    const titleInput = root.querySelector('textarea[placeholder*="change my team"]') as HTMLTextAreaElement | null
    const descInput = root.querySelector('textarea[placeholder*="Describe your situation"]') as HTMLTextAreaElement | null
    const catWrapper = root.querySelector('.space-y-4 .flex-wrap.gap-3') as HTMLElement | null
    const submitBtn = Array.from(root.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Submit Question',
    )
    const analysisSection = root.querySelector('.glass-card .space-y-8 + section')

    let selectedCategory: string | null = null

    if (catWrapper) {
      try {
        const cats = await categoriesApi.list()
        catWrapper.innerHTML = ''
        cats.forEach((cat, idx) => {
          const btn = document.createElement('button')
          btn.className = 'px-6 py-2 rounded-full border border-outline-variant hover:border-primary/50 text-on-surface-variant font-label-md transition-all active:scale-95'
          btn.textContent = cat.name
          btn.addEventListener('click', (e) => {
            e.preventDefault()
            catWrapper.querySelectorAll('button').forEach((b) => {
              b.className = 'px-6 py-2 rounded-full border border-outline-variant hover:border-primary/50 text-on-surface-variant font-label-md transition-all active:scale-95'
            })
            btn.className = 'px-6 py-2 rounded-full border border-primary bg-primary/10 text-primary font-label-md transition-all active:scale-95'
            selectedCategory = cat.id
          })
          catWrapper.appendChild(btn)

          if (idx === 0) {
            btn.click()
          }
        })
      } catch (err) {
        console.error('Failed to load categories', err)
      }
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        const title = titleInput?.value?.trim()
        if (!title || title.length < 10) return

        submitBtn.textContent = 'Submitting...'
        submitBtn.setAttribute('disabled', 'true')

        try {
          const q = await questionsApi.create({
            title,
            description: descInput?.value?.trim() || undefined,
            category_id: selectedCategory || undefined,
          })
          navigate(`/analysis/${q.id}`)
        } catch {
          submitBtn.textContent = 'Submit Question'
          submitBtn.removeAttribute('disabled')
        }
      })
    }

    if (analysisSection) {
      questionsApi.list({ page_size: '3' }).then((res) => {
        const similar = analysisSection.querySelector('.space-y-4:first-child .glass-card')
        if (similar && res.items.length > 0) {
          const q = res.items[0]
          similar.querySelector('h4')!.textContent = q.title
          similar.querySelector('p')!.textContent = q.description ?? ''
        }
      })
    }
  }, [navigate])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Ask a Question"
      navMap={{ ...commonUserNav, submit: '/analysis/new', analyze: '/analysis/new', continue: '/analysis/new' }}
    />
  )
}
