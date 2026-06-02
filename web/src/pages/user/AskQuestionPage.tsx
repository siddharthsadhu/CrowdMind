import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/05-ask'
import { commonUserNav } from '@/data/navMaps'
import { questionsApi } from '@/services/api/questions'

export default function AskQuestionPage() {
  const navigate = useNavigate()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const timer = setTimeout(() => {
      const root = document.querySelector('.stitch-page-root')
      if (!root) return

      const titleInput = root.querySelector('textarea[placeholder*="change my team"]') as HTMLTextAreaElement | null
      const descInput = root.querySelector('textarea[placeholder*="Describe your situation"]') as HTMLTextAreaElement | null
      const categoryBtns = root.querySelectorAll('.glass-card button') as NodeListOf<HTMLButtonElement>
      const submitBtn = Array.from(root.querySelectorAll('button')).find(
        (b) => b.textContent?.trim() === 'Submit Question',
      )
      const analysisSection = root.querySelector('.glass-card .space-y-8 + section')

      let selectedCategory: string | null = null

      const categoryMap: Record<string, string> = {
        Internship: 'internship',
        'Team Formation': 'team-formation',
        NOC: 'noc',
        ViBe: 'vibe',
        Rosetta: 'rosetta',
      }

      categoryBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          categoryBtns.forEach((b) => {
            b.className =
              'px-6 py-2 rounded-full border border-outline-variant hover:border-primary/50 text-on-surface-variant font-label-md transition-all active:scale-95'
          })
          btn.className =
            'px-6 py-2 rounded-full border border-primary bg-primary/10 text-primary font-label-md transition-all active:scale-95'
          selectedCategory = categoryMap[btn.textContent?.trim() ?? ''] ?? null
        })
      })

      if (submitBtn) {
        submitBtn.addEventListener('click', async (e) => {
          e.preventDefault()
          const title = titleInput?.value?.trim()
          if (!title || title.length < 5) return

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
    }, 100)

    return () => clearTimeout(timer)
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
