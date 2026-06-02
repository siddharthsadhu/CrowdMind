import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/09-create-discussion'
import { commonUserNav } from '@/data/navMaps'
import { discussionsApi } from '@/services/api/discussions'

export default function CreateDiscussionPage() {
  const navigate = useNavigate()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const timer = setTimeout(() => {
      const root = document.querySelector('.stitch-page-root')
      if (!root) return

      const titleInput = root.querySelector('input[placeholder*="What topic"]') as HTMLInputElement | null
      const descTextarea = root.querySelector('textarea[placeholder*="Provide context"]') as HTMLTextAreaElement | null
      const submitBtn = Array.from(root.querySelectorAll('button')).find(
        (b) => b.textContent?.trim() === 'Publish Discussion',
      )

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
            })
            navigate(`/discussions/${disc.id}`)
          } catch {
            submitBtn.textContent = 'Publish Discussion'
            submitBtn.removeAttribute('disabled')
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
      title="CrowdMind | Create Discussion"
      navMap={{
        ...commonUserNav,
        publish: '/discussions/d1',
        submit: '/discussions/d1',
        cancel: '/discussions',
      }}
    />
  )
}
