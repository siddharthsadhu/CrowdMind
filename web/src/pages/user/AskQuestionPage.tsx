import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/05-ask'
import { commonUserNav } from '@/data/navMaps'

export default function AskQuestionPage() {
  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Ask a Question"
      navMap={{ ...commonUserNav, submit: '/analysis/new', analyze: '/analysis/new', continue: '/analysis/new' }}
    />
  )
}
