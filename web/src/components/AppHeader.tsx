import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Icon } from './Icon'
import { useAuth } from '@/context/AuthContext'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-base transition-colors pb-1 border-b-2 ${
    isActive
      ? 'text-primary border-primary'
      : 'text-on-surface-variant border-transparent hover:text-on-surface'
  }`

export function AppHeader({ variant = 'app' }: { variant?: 'app' | 'minimal' }) {
  const { role, name, signOut } = useAuth()
  const navigate = useNavigate()
  const isAdmin = role === 'admin'

  if (variant === 'minimal') return null

  return (
    <header className="fixed top-0 left-0 z-50 flex h-20 w-full items-center justify-between border-b border-white/10 bg-surface/70 px-4 backdrop-blur-xl md:px-12">
      <div className="flex items-center gap-8 md:gap-12">
        <Link to={role === 'guest' ? '/library' : '/home'} className="font-[family-name:var(--font-headline)] text-2xl font-bold tracking-tighter text-primary">
          CrowdMind AI
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/library" className={navLinkClass}>
            FAQs
          </NavLink>
          <NavLink to="/discussions" className={navLinkClass}>
            Discussions
          </NavLink>
          {(role === 'user' || isAdmin) && (
            <NavLink to="/ask" className={navLinkClass}>
              Ask Question
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </nav>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative hidden sm:block">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline" />
          <input
            type="text"
            placeholder="Global search..."
            className="w-48 rounded-lg border border-outline-variant bg-surface-container-low py-2 pr-4 pl-10 text-sm focus:ring-1 focus:ring-secondary-fixed-dim focus:outline-none md:w-64"
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate('/search?q=' + encodeURIComponent((e.target as HTMLInputElement).value))
            }}
          />
        </div>
        {(role === 'user' || isAdmin) && (
          <Link to="/notifications" className="text-on-surface-variant transition-all hover:text-primary">
            <Icon name="notifications" />
          </Link>
        )}
        {role === 'guest' ? (
          <Link
            to="/"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary transition-all hover:brightness-110"
          >
            Sign In
          </Link>
        ) : (
          <Link to="/home" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-sm font-bold text-on-primary-container">
              {name.charAt(0).toUpperCase()}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                signOut()
                navigate('/')
              }}
              className="hidden text-xs text-outline hover:text-primary md:block"
            >
              Sign out
            </button>
          </Link>
        )}
      </div>
    </header>
  )
}
