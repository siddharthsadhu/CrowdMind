import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useClerk } from '@clerk/clerk-react'

const screens = [
  { n: '01', label: 'Landing', path: '/' },
  { n: '02', label: 'FAQ Repository', path: '/library' },
  { n: '03', label: 'FAQ Detail', path: '/faq/1' },
  { n: '04', label: 'Login', path: '/login' },
  { n: '05', label: 'Ask Question', path: '/ask' },
  { n: '06', label: 'AI Analysis', path: '/analysis/new' },
  { n: '07', label: 'Discussions', path: '/discussions' },
  { n: '08', label: 'Thread', path: '/discussions/d1' },
  { n: '09', label: 'Create Discussion', path: '/discussions/new' },
  { n: '10', label: 'Profile', path: '/home' },
  { n: '11', label: 'Notifications', path: '/notifications' },
  { n: '12', label: 'Saved Knowledge', path: '/saved' },
  { n: '13', label: 'Contributions', path: '/contributions' },
  { n: '14', label: 'Evolution', path: '/evolution' },
  { n: '15', label: 'Mission Control', path: '/admin' },
  { n: '16', label: 'FAQ Mgmt', path: '/admin/faq' },
  { n: '21', label: 'FAQ Review', path: '/admin/faq-review/1024' },
  { n: '17', label: 'Moderation', path: '/admin/moderation' },
  { n: '18', label: 'Analytics', path: '/admin/analytics' },
  { n: '19', label: 'Report', path: '/admin/reports/r1' },
  { n: '20', label: 'Settings', path: '/admin/settings' },
]

export function ScreenIndex() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { role, signOut } = useAuth()
  const clerk = useClerk()

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-[family-name:var(--font-label)] text-xs">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="glass-panel rounded-lg px-3 py-2 text-primary shadow-lg"
      >
        Screens {open ? '▾' : '▸'}
      </button>
      {open && (
        <div className="glass-panel mt-2 max-h-[70vh] w-56 overflow-y-auto rounded-lg p-2 shadow-2xl custom-scrollbar">
          <p className="mb-2 px-2 text-[10px] text-outline uppercase">Role: {role}</p>
          <div className="mb-2 flex gap-1 px-1">
            <button
              type="button"
              className="flex-1 rounded bg-primary-container/30 py-1 text-[10px] text-primary"
              onClick={() => clerk.openSignIn()}
            >
              Sign In
            </button>
            <button type="button" className="rounded px-2 py-1 text-[10px] text-outline" onClick={signOut}>
              Out
            </button>
          </div>
          {screens.map((s) => (
            <Link
              key={s.path}
              to={s.path}
              onClick={() => setOpen(false)}
              className={`block rounded px-2 py-1.5 hover:bg-white/5 ${
                location.pathname === s.path ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <span className="text-outline">{s.n}</span> {s.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
