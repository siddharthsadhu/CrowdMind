import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/26-methodology'
import { commonUserNav } from '@/data/navMaps'
import { useAuth } from '@/context/AuthContext'
import { useStitchData } from '@/hooks/useStitchData'

export default function MethodologyPage() {
  const navigate = useNavigate()
  const { role } = useAuth()

  useStitchData((root) => {
    const exploreBtn = root.querySelector('.cm-cta-explore') as HTMLButtonElement | null
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => navigate('/library'))
    }
    const joinBtn = root.querySelector('.cm-cta-join') as HTMLButtonElement | null
    if (joinBtn) {
      joinBtn.addEventListener('click', () => {
        navigate(role === 'guest' ? '/register' : '/home')
      })
    }
    const evoBtn = root.querySelector('.cm-cta-evolution') as HTMLButtonElement | null
    if (evoBtn) {
      evoBtn.addEventListener('click', () => navigate('/evolution'))
    }
  }, [navigate, role])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | How It Works"
      navMap={{
        ...commonUserNav,
        'explore faqs': '/library',
        'view all': '/library',
        'learn more': '/evolution',
        features: '/methodology',
        integrations: '/methodology',
        leaderboard: '/',
        contributors: '/',
        api: '/',
        'help center': '/',
      }}
    />
  )
}
