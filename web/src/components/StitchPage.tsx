import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { PageFooter } from './PageFooter'
import { usersApi } from '@/services/api/users'
import { notificationsApi } from '@/services/api/notifications'
import { commonAdminNav } from '@/data/navMaps'

const avatarAlts = ['user profile menu', 'user avatar', 'user profile', 'profile pic', 'user', 'admin profile', 'researcher profile']

// ─── Global profile sync helpers ───────────────────────────────────────────────
const CUSTOM_AVATAR_KEY = 'cm_custom_avatar_url'
const CUSTOM_NAME_KEY = 'cm_custom_name'

export const PROFILE_UPDATED_EVENT = 'cm:profile-updated'

/** Call this after a successful profile update to sync the nav everywhere instantly */
export function broadcastProfileUpdate(avatarUrl: string | null, name: string | null) {
  if (avatarUrl) {
    localStorage.setItem(CUSTOM_AVATAR_KEY, avatarUrl)
  }
  if (name) {
    localStorage.setItem(CUSTOM_NAME_KEY, name)
  }
  window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT, { detail: { avatarUrl, name } }))
}

export function getStoredAvatar(): string | null {
  return localStorage.getItem(CUSTOM_AVATAR_KEY)
}

export function getStoredName(): string | null {
  return localStorage.getItem(CUSTOM_NAME_KEY)
}

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
  const { name, email, imageUrl, role, isLoaded, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)
  
  // Track the custom profile state — starts from localStorage so it persists across nav
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(() => getStoredAvatar())
  const [customName, setCustomName] = useState<string | null>(() => getStoredName())
  const [unreadCount, setUnreadCount] = useState(0)
  
  const q = searchParams.get('q')

  const effectiveNavMap = useMemo(() => {
    if (role === 'admin') {
      return { ...navMap, ...commonAdminNav }
    }
    return navMap
  }, [role, navMap])

  // Poll notifications
  useEffect(() => {
    if (!isLoaded || role === 'guest') {
      setUnreadCount(0)
      return
    }

    const fetchUnread = () => {
      notificationsApi.list({ filter: 'unread', page_size: '100' })
        .then((res) => {
          setUnreadCount(res.items.filter(n => !n.read).length)
        })
        .catch((err) => {
          console.error('[StitchPage] Failed to fetch unread notifications:', err)
        })
    }

    fetchUnread()
    const interval = setInterval(fetchUnread, 8000)

    const handler = () => fetchUnread()
    window.addEventListener('cm:notifications-updated', handler)

    return () => {
      clearInterval(interval)
      window.removeEventListener('cm:notifications-updated', handler)
    }
  }, [isLoaded, role])

  // Listen for profile updates broadcast from ProfilePage (or any other page)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ avatarUrl: string | null; name: string | null }>).detail
      if (detail.avatarUrl !== undefined && detail.avatarUrl !== null) setCustomAvatarUrl(detail.avatarUrl)
      if (detail.name !== undefined && detail.name !== null) setCustomName(detail.name)
    }
    window.addEventListener(PROFILE_UPDATED_EVENT, handler)
    return () => window.removeEventListener(PROFILE_UPDATED_EVENT, handler)
  }, [])

  // Sync database profile on load
  useEffect(() => {
    if (isLoaded && role !== 'guest') {
      usersApi.getMe()
        .then((user) => {
          if (user) {
            const dbAvatar = user.avatar_url
            const dbName = user.full_name || user.username
            if (dbAvatar) {
              setCustomAvatarUrl(dbAvatar)
              localStorage.setItem(CUSTOM_AVATAR_KEY, dbAvatar)
            } else {
              setCustomAvatarUrl(null)
              localStorage.removeItem(CUSTOM_AVATAR_KEY)
            }
            if (dbName) {
              setCustomName(dbName)
              localStorage.setItem(CUSTOM_NAME_KEY, dbName)
            } else {
              setCustomName(null)
              localStorage.removeItem(CUSTOM_NAME_KEY)
            }
          }
        })
        .catch((err) => {
          console.error('[StitchPage] Failed to fetch current user profile for sync:', err)
        })
    }
  }, [isLoaded, role])

  const effectiveName = customName || name

  // The effective avatar URL: custom uploaded > Clerk OAuth > generated initials
  const effectiveAvatarUrl = customAvatarUrl ||
    imageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(effectiveName)}&background=b0c6ff&color=002d6e&bold=true&size=64`

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
        if (el.getAttribute('data-prevent-stitch') === 'true') {
          return
        }
        const text = (el.textContent ?? '').trim().toLowerCase()
        const sortedEntries = Object.entries(effectiveNavMap).sort((a, b) => b[0].length - a[0].length)
        for (const [needle, path] of sortedEntries) {
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
        // Wire the logo element to navigate to the homepage on click
        const logoEl = Array.from(header.querySelectorAll('span, a')).find((el) => {
          const t = el.textContent?.trim().toLowerCase() || ''
          return t === 'crowdmind' || t === 'crowdmind ai'
        }) as HTMLElement | null
        if (logoEl) {
          logoEl.style.cursor = 'pointer'
          logoEl.addEventListener('click', (e) => {
            e.preventDefault()
            navigate('/')
          })
        }

        // Remove search wrapper/input in header entirely
        const headerSearchInput = header.querySelector(
          'input[placeholder*="search" i], input[placeholder*="Search" i]',
        ) as HTMLInputElement | null
        if (headerSearchInput) {
          const wrapper = headerSearchInput.parentElement
          if (wrapper) {
            wrapper.remove()
          }
        }

        // 1. Find static avatar
        const avatarImg = Array.from(header.querySelectorAll<HTMLImageElement>('img')).find(
          (img) => avatarAlts.some((a) => (img.alt ?? '').toLowerCase().includes(a)),
        )

        // Find the right cluster container
        const rightCluster = Array.from(
          header.querySelectorAll<HTMLElement>('div.flex.items-center.gap-4'),
        ).find((el) => (avatarImg && el.contains(avatarImg)) || el.querySelector('input[placeholder*="search" i]'))

        if (role !== 'guest') {
          // Hide the static avatar container if it exists
          if (avatarImg) {
            const avatarContainer = avatarImg.parentElement as HTMLElement | null
            if (avatarContainer) {
              avatarContainer.style.display = 'none'
            }
          }

          // Create or find our portal element inside the right cluster (or header)
          let portalEl = header.querySelector('.cm-user-menu-portal') as HTMLElement | null
          if (!portalEl) {
            portalEl = document.createElement('div')
            portalEl.className = 'cm-user-menu-portal flex items-center z-[60]'
            
            if (avatarImg && avatarImg.parentElement) {
              avatarImg.parentElement.parentElement?.insertBefore(portalEl, avatarImg.parentElement)
            } else if (rightCluster) {
              rightCluster.appendChild(portalEl)
            } else {
              header.appendChild(portalEl)
            }
          }
          setPortalTarget(portalEl)
        } else {
          // Remove guest/user menu portal if present
          const existingPortal = header.querySelector('.cm-user-menu-portal')
          if (existingPortal) {
            existingPortal.remove()
          }
          setPortalTarget(null)

          if (avatarImg) {
            const avatarContainer = avatarImg.parentElement as HTMLElement | null
            if (avatarContainer) {
              avatarContainer.style.display = ''
            }
          }
        }

        // 3. For guests, append Sign In / Sign Up buttons; for signed-in users, remove them
        if (role === 'guest') {
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

            // Insert next to the search bar area
            const searchWrapper = header.querySelector('.cm-nav-search')
            if (searchWrapper?.parentElement) {
              searchWrapper.parentElement.appendChild(authContainer)
            } else {
              const lastFlex = header.querySelector('div.flex.items-center.gap-4')
              if (lastFlex) lastFlex.appendChild(authContainer)
            }
          }
        } else {
          // Remove guest buttons
          const existingAuth = header.querySelector('.cm-auth-buttons')
          if (existingAuth) existingAuth.remove()
        }

        // Dynamic notifications bell badge & redirect
        const notifIcon = Array.from(header.querySelectorAll('.material-symbols-outlined')).find(el =>
          el.textContent?.trim() === 'notifications'
        ) as HTMLElement | null

        if (notifIcon) {
          const triggerEl = (notifIcon.closest('button, a') || notifIcon) as HTMLElement
          triggerEl.style.position = 'relative'
          triggerEl.style.cursor = 'pointer'
          
          if (!triggerEl.dataset.cmWiredNotif) {
            triggerEl.dataset.cmWiredNotif = '1'
            triggerEl.addEventListener('click', (e) => {
              e.preventDefault()
              navigate('/notifications')
            })
          }

          let badge = triggerEl.querySelector('.cm-nav-notif-badge') as HTMLElement | null
          if (!badge) {
            badge = document.createElement('span')
            badge.className = 'cm-nav-notif-badge absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-background'
            triggerEl.appendChild(badge)
          }
          if (role !== 'guest' && unreadCount > 0) {
            badge.style.display = 'block'
          } else {
            badge.style.display = 'none'
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
  }, [bodyHtml, effectiveNavMap, navigate, q, isLoaded, name, role, imageUrl, unreadCount])

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
    localStorage.removeItem(CUSTOM_AVATAR_KEY)
    localStorage.removeItem(CUSTOM_NAME_KEY)
    localStorage.removeItem('saved-faqs')
    localStorage.removeItem('faq-feedback-counts')
    setCustomAvatarUrl(null)
    setCustomName(null)
    navigate('/')
  }

  return (
    <div className="stitch-page-root min-h-screen bg-background text-on-background">
      {stylesElement}
      {bodyElement}
      <PageFooter />

      {/* Floating User Menu Button - portal-mounted INSIDE the navbar right-side cluster */}
      {isLoaded && role !== 'guest' && portalTarget && createPortal(
        <div className="relative flex items-center">
          <button
            onClick={handleAvatarClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-transparent border border-transparent rounded-full hover:bg-white/5 hover:border-white/10 transition-colors text-on-surface cursor-pointer"
            data-testid="user-menu-trigger"
          >
            <img
              src={effectiveAvatarUrl}
              alt={effectiveName}
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-on-surface hidden sm:inline">{effectiveName}</span>
            <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-[58]"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container border border-white/10 rounded-xl shadow-2xl z-[59] overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-sm font-medium text-on-surface">{effectiveName}</p>
                  <p className="text-xs text-on-surface-variant truncate">{email ?? ''}</p>
                  <p className="text-[10px] uppercase tracking-wider text-primary mt-1">{role}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/home') }}
                    className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-white/5 flex items-center gap-3 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">person</span>
                    My Profile
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/contributions') }}
                    className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-white/5 flex items-center gap-3 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">edit_note</span>
                    My Contributions
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/saved') }}
                    className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-white/5 flex items-center gap-3 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">bookmark</span>
                    Saved Knowledge
                  </button>
                  {role === 'admin' && (
                    <button
                      onClick={() => { setMenuOpen(false); navigate('/admin') }}
                      className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-white/5 flex items-center gap-3 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                      Admin Console
                    </button>
                  )}
                  {role === 'user' && (
                    <button
                      onClick={() => { setMenuOpen(false); navigate('/settings') }}
                      className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-white/5 flex items-center gap-3 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">settings</span>
                      Settings
                    </button>
                  )}
                  {role === 'admin' && (
                    <button
                      onClick={() => { setMenuOpen(false); navigate('/admin/settings') }}
                      className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-white/5 flex items-center gap-3 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">settings</span>
                      Settings
                    </button>
                  )}
                </div>
                <div className="border-t border-white/5 py-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 flex items-center gap-3 cursor-pointer"
                    data-testid="signout-btn"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>,
        portalTarget
      )}
    </div>
  )
}
