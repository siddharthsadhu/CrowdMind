import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { PageFooter } from '@/components/PageFooter'

type Tab = 'account' | 'preferences' | 'security'

export default function UserSettingsPage() {
  const { name, email, role, signOut } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('account')
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(false)
  const [digestFreq, setDigestFreq] = useState<'daily' | 'weekly' | 'never'>('weekly')

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="stitch-page-root min-h-screen bg-background text-on-background flex flex-col">
      <header className="w-full py-6 px-6 md:px-12 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="font-headline-md text-xl font-bold text-primary">
          CrowdMind
        </button>
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => navigate('/home')} className="text-on-surface-variant hover:text-primary">
            ← Back to profile
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <h1 className="font-display text-3xl text-on-surface mb-2">Settings</h1>
        <p className="text-on-surface-variant mb-8">Manage your account, notifications, and security.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <nav className="flex md:flex-col gap-1 md:gap-2 overflow-x-auto">
              {([
                { id: 'account', label: 'Account', icon: 'person' },
                { id: 'preferences', label: 'Preferences', icon: 'tune' },
                { id: 'security', label: 'Security', icon: 'lock' },
              ] as { id: Tab; label: string; icon: string }[]).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                    tab === t.id
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-on-surface-variant hover:bg-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{t.icon}</span>
                  <span className="text-sm font-medium">{t.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <section className="md:col-span-3 space-y-6">
            {tab === 'account' && (
              <>
                <div className="rounded-xl border border-white/10 bg-surface p-6">
                  <h2 className="font-headline text-lg text-on-surface mb-4">Profile</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">
                        Display name
                      </label>
                      <p className="text-on-surface">{name}</p>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">
                        Email
                      </label>
                      <p className="text-on-surface">{email ?? '—'}</p>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">
                        Role
                      </label>
                      <p className="text-on-surface capitalize">{role}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-surface p-6">
                  <h2 className="font-headline text-lg text-on-surface mb-2">Sign out</h2>
                  <p className="text-on-surface-variant text-sm mb-4">
                    Sign out of CrowdMind on this device. You can sign back in anytime.
                  </p>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-error text-on-error font-semibold rounded-lg hover:brightness-110"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}

            {tab === 'preferences' && (
              <>
                <div className="rounded-xl border border-white/10 bg-surface p-6 space-y-4">
                  <h2 className="font-headline text-lg text-on-surface mb-2">Notifications</h2>
                  <label className="flex items-center justify-between gap-4 cursor-pointer">
                    <div>
                      <p className="text-on-surface font-medium">Email notifications</p>
                      <p className="text-on-surface-variant text-sm">Replies, mentions, and weekly digest.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNotif}
                      onChange={(e) => setEmailNotif(e.target.checked)}
                      className="w-5 h-5"
                    />
                  </label>
                  <label className="flex items-center justify-between gap-4 cursor-pointer">
                    <div>
                      <p className="text-on-surface font-medium">Push notifications</p>
                      <p className="text-on-surface-variant text-sm">Real-time alerts in your browser.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={pushNotif}
                      onChange={(e) => setPushNotif(e.target.checked)}
                      className="w-5 h-5"
                    />
                  </label>
                </div>
                <div className="rounded-xl border border-white/10 bg-surface p-6">
                  <h2 className="font-headline text-lg text-on-surface mb-4">Email digest</h2>
                  <div className="flex gap-2">
                    {(['daily', 'weekly', 'never'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setDigestFreq(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          digestFreq === f
                            ? 'bg-primary text-on-primary'
                            : 'border border-white/10 text-on-surface-variant hover:bg-white/5'
                        }`}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {tab === 'security' && (
              <div className="rounded-xl border border-white/10 bg-surface p-6">
                <h2 className="font-headline text-lg text-on-surface mb-2">Security</h2>
                <p className="text-on-surface-variant text-sm mb-4">
                  Authentication is handled by Clerk. Manage your password, two-factor authentication,
                  and active sessions from your Clerk account.
                </p>
                <a
                  href="https://accounts.crowdmind.dev/user"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-outline hover:bg-white/5 text-on-surface font-semibold rounded-lg"
                >
                  <span className="material-symbols-outlined text-base">open_in_new</span>
                  Open Clerk account
                </a>
              </div>
            )}
          </section>
        </div>
      </main>

      <PageFooter />
    </div>
  )
}
