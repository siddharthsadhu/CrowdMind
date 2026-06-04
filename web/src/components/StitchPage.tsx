import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { PageFooter } from './PageFooter'

const avatarAlts = ['user profile menu', 'user avatar', 'user profile', 'profile pic', 'user', 'admin profile', 'researcher profile']

export type StitchPageProps = {
  bodyHtml: string
  pageStyles?: string
  title: string
  navMap?: Record<string, string>
}

export function StitchPage({ bodyHtml, pageStyles = '', title, navMap = {} }: StitchPageProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { name, email, role, isLoaded, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const q = searchParams.get('q')

  // Memoize the body element so React re-renders (e.g. when auth loads) don't
  // re-apply dangerouslySetInnerHTML and wipe the page's DOM mutations.
  const bodyElement = useMemo(
    () => <div ref={rootRef} dangerouslySetInnerHTML={{ __html: bodyHtml }} />,
    [bodyHtml],
  )
  const stylesElement = useMemo(
    () => (pageStyles ? <style dangerouslySetInnerHTML={{ __html: pageStyles }} /> : null),
    [pageStyles],
  )

  useEffect(() => {
    document.title = title
  }, [title])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const wire = (el: Element) => {
      el.addEventListener('click', (e) => {
        const text = (el.textContent ?? '').trim().toLowerCase()
        for (const [needle, path] of Object.entries(navMap)) {
          if (text.includes(needle.toLowerCase())) {
            e.preventDefault()
            navigate(path)
            return
          }
        }
      })
    }

    root.querySelectorAll('a[href]').forEach(wire)
    root.querySelectorAll('button').forEach(wire)

    /* Wire header/nav and role-aware navigation */
    if (isLoaded) {
      const header = root.querySelector('header, nav')
      if (header) {
        // 1. Hide/show settings/notifications buttons based on auth state
        const buttons = header.querySelectorAll('button')
        buttons.forEach((btn) => {
          const text = (btn.textContent ?? '').trim().toLowerCase()
          if (text.includes('notifications') || text.includes('settings')) {
            if (role === 'guest') {
              (btn as HTMLElement).style.display = 'none'
            } else {
              (btn as HTMLElement).style.display = 'inline-block'
            }
          }
        })

        // 2. Find the avatar img in the header
        const avatarImg = Array.from(header.querySelectorAll<HTMLImageElement>('img')).find(
          (img) => avatarAlts.some((a) => (img.alt ?? '').toLowerCase().includes(a)),
        )

        if (avatarImg) {
          const avatarContainer = avatarImg.parentElement as HTMLElement
          if (role === 'guest') {
            // Hide avatar
            if (avatarContainer) {
              avatarContainer.style.display = 'none'
            }

            // Append Guest login buttons if they don't exist
            if (!header.querySelector('.cm-auth-buttons')) {
              const authContainer = document.createElement('div')
              authContainer.className = 'cm-auth-buttons flex items-center gap-4 ml-2'

              const signInLink = document.createElement('a')
              signInLink.className = 'text-on-surface-variant font-medium hover:text-primary transition-all duration-200 text-sm cursor-pointer'
              signInLink.textContent = 'Sign In'
              signInLink.addEventListener('click', (e) => {
                e.preventDefault()
                navigate('/login')
              })

              const signUpBtn = document.createElement('button')
              signUpBtn.className = 'px-4 py-2 bg-primary text-on-primary hover:brightness-110 transition-all font-semibold rounded-lg text-sm active:scale-95 cursor-pointer'
              signUpBtn.textContent = 'Sign Up'
              signUpBtn.addEventListener('click', (e) => {
                e.preventDefault()
                navigate('/register')
              })

              authContainer.appendChild(signInLink)
              authContainer.appendChild(signUpBtn)

              const parentFlex = avatarContainer?.parentElement
              if (parentFlex) {
                parentFlex.appendChild(authContainer)
              }
            }
          } else {
            // Signed in user
            if (avatarContainer) {
              avatarContainer.style.display = 'flex'
            }

            // Remove guest buttons
            const existingAuth = header.querySelector('.cm-auth-buttons')
            if (existingAuth) {
              existingAuth.remove()
            }

            // Configure avatar with real user data
            avatarImg.style.cursor = 'pointer'
            avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=b0c6ff&color=002d6e&bold=true&size=128`
            avatarImg.alt = name
          }
        }
      }
    }

    if (q) {
      const searchInput = root.querySelector(
        'input[placeholder*="search" i], input[placeholder*="Search" i]',
      ) as HTMLInputElement | null
      if (searchInput) {
        searchInput.value = q
        searchInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
    }

    // --- Header search: Enter to navigate ---
    root.querySelectorAll('header input[type="text"], header input[type="search"]').forEach((input) => {
      const inp = input as HTMLInputElement
      if (inp.dataset.cmSearchWired) return
      inp.dataset.cmSearchWired = '1'
      inp.addEventListener('keydown', (e) => {
        const ke = e as KeyboardEvent
        if (ke.key === 'Enter') {
          ke.preventDefault()
          const val = inp.value.trim()
          if (val.length === 0) return
          // Decide target: if on a discussion or ask page, search discussions; else search library
          const path = window.location.pathname
          if (path.startsWith('/discussions') || path.includes('discussion')) {
            navigate(`/discussions?q=${encodeURIComponent(val)}`)
          } else if (path === '/ask' || path === '/') {
            navigate(`/library?q=${encodeURIComponent(val)}`)
          } else {
            navigate(`/library?q=${encodeURIComponent(val)}`)
          }
        }
      })
    })

    root.querySelectorAll('header input[type="text"]').forEach((input) => {
      const wrapper = input.parentElement
      if (!wrapper) return
      const icon = wrapper.querySelector(':scope > .material-symbols-outlined')
      if (!icon || icon.textContent?.trim() !== 'search') return
      wrapper.classList.add('cm-nav-search')
      icon.classList.add('cm-nav-search-icon')
      input.classList.add('w-full')
      if (!input.className.includes('pl-10')) input.classList.add('pl-10')
    })

    const nodes = root.querySelectorAll('.knowledge-node')
    nodes.forEach((node, index) => {
      const el = node as HTMLElement
      el.style.opacity = '0'
      el.style.transform = 'translateY(10px)'
      setTimeout(() => {
        el.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 200 + index * 150)
    })

    // Hide the broken footer in the Stitch HTML - we render our own
    root.querySelectorAll('footer').forEach((f) => {
      (f as HTMLElement).style.display = 'none'
    })
  }, [bodyHtml, navMap, navigate, q, isLoaded, name, role])

  // --- Real User Menu (Logout, Profile, Settings, Saved) ---
  const handleAvatarClick = () => {
    if (role === 'guest') {
      navigate('/login')
    } else {
      setMenuOpen((v) => !v)
    }
  }

  const handleSignOut = async () => {
    setMenuOpen(false)
    await signOut()
    navigate('/')
  }

  return (
    <div className="stitch-page-root min-h-screen bg-background text-on-background">
      {stylesElement}
      {bodyElement}
      <PageFooter />

      {/* Floating User Menu Button - replaces broken avatar click */}
      {isLoaded && role !== 'guest' && (
        <div className="fixed top-3 right-24 z-[60]">
          <button
            onClick={handleAvatarClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface-container/80 border border-white/10 rounded-full hover:bg-surface-container-high transition-colors"
            data-testid="user-menu-trigger"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=b0c6ff&color=002d6e&bold=true&size=64`}
              alt={name}
              className="w-7 h-7 rounded-full"
            />
            <span className="text-sm font-medium text-on-surface hidden sm:inline">{name}</span>
            <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-[58]"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-surface-container border border-white/10 rounded-xl shadow-2xl z-[59] overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-sm font-medium text-on-surface">{name}</p>
                  <p className="text-xs text-on-surface-variant truncate">{email ?? ''}</p>
                  <p className="text-[10px] uppercase tracking-wider text-primary mt-1">{role}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/home') }}
                    className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-white/5 flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-lg">person</span>
                    My Profile
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/contributions') }}
                    className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-white/5 flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-lg">edit_note</span>
                    My Contributions
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/saved') }}
                    className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-white/5 flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-lg">bookmark</span>
                    Saved Knowledge
                  </button>
                  {role === 'admin' && (
                    <button
                      onClick={() => { setMenuOpen(false); navigate('/admin') }}
                      className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-white/5 flex items-center gap-3"
                    >
                      <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                      Admin Console
                    </button>
                  )}
                  {role === 'user' && (
                    <button
                      onClick={() => { setMenuOpen(false); navigate('/settings') }}
                      className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-white/5 flex items-center gap-3"
                    >
                      <span className="material-symbols-outlined text-lg">settings</span>
                      Settings
                    </button>
                  )}
                  {role === 'admin' && (
                    <button
                      onClick={() => { setMenuOpen(false); navigate('/admin/settings') }}
                      className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-white/5 flex items-center gap-3"
                    >
                      <span className="material-symbols-outlined text-lg">settings</span>
                      Settings
                    </button>
                  )}
                </div>
                <div className="border-t border-white/5 py-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 flex items-center gap-3"
                    data-testid="signout-btn"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
