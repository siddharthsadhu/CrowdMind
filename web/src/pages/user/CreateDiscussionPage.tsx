import { useStitchData } from '@/hooks/useStitchData'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/09-create-discussion'
import { commonUserNav } from '@/data/navMaps'
import { discussionsApi } from '@/services/api/discussions'
import { questionsApi } from '@/services/api/questions'

export default function CreateDiscussionPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const questionId = searchParams.get('question_id')

  useStitchData(async (root) => {
    const titleInput = root.querySelector('input[placeholder*="What topic"]') as HTMLInputElement | null
    const descTextarea = root.querySelector('textarea[placeholder*="Provide context"]') as HTMLTextAreaElement | null
    const submitBtn = Array.from(root.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Publish Discussion',
    )

    if (questionId) {
      try {
        const q = await questionsApi.getById(questionId)
        if (titleInput) titleInput.value = q.title
        if (descTextarea) descTextarea.value = q.description || ''
      } catch (err) {
        console.error('Failed to fetch question details', err)
      }
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        const title = titleInput?.value?.trim()
        if (!title || title.length < 5) return

        submitBtn.textContent = 'Publishing...'
        submitBtn.setAttribute('disabled', 'true')

        try {
          const disc = await discussionsApi.create({
            title,
            description: descTextarea?.value?.trim() || undefined,
            question_id: questionId || undefined,
          })
          navigate(`/discussions/${disc.id}`)
        } catch {
          submitBtn.textContent = 'Publish Discussion'
          submitBtn.removeAttribute('disabled')
        }
      })
    }
  }, [navigate, questionId])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Create Discussion"
      navMap={{
        ...commonUserNav,
        publish: '/discussions',
        submit: '/discussions',
        cancel: '/discussions',
      }}
    />
  )
}
