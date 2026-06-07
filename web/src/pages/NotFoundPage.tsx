import { useNavigate } from 'react-router-dom'
import { PageFooter } from '@/components/PageFooter'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="stitch-page-root min-h-screen bg-background text-on-background flex flex-col">
      <header className="w-full py-6 px-6 md:px-12 border-b border-white/5">
        <button
          onClick={() => navigate('/')}
          className="font-headline-md text-xl font-bold text-primary"
        >
          CrowdMind
        </button>
      </header>
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <p className="font-label-md text-primary tracking-widest text-xs mb-4">ERROR 404</p>
          <h1 className="font-display text-5xl md:text-6xl text-on-surface mb-4 tracking-tight">
            Page not found
          </h1>
          <p className="text-on-surface-variant text-body-lg mb-8 leading-relaxed">
            The page you are looking for does not exist or has been moved. Check the URL or head back
            to the homepage.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-primary text-on-primary font-semibold rounded-lg hover:brightness-110 transition-all"
            >
              Go home
            </button>
            <button
              onClick={() => navigate('/library')}
              className="px-6 py-3 border border-outline hover:bg-white/5 text-on-surface font-semibold rounded-lg transition-all"
            >
              Browse library
            </button>
          </div>
        </div>
      </main>
      <PageFooter />
    </div>
  )
}
