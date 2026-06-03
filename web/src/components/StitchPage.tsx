import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

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
  const { name, role, isLoaded } = useAuth()
  const q = searchParams.get('q')

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
            
            // Configure avatar
            avatarImg.style.cursor = 'pointer'
            avatarImg.onclick = () => {
              navigate('/home')
            }
            avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=b0c6ff&color=002d6e&bold=true&size=128`
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
  }, [bodyHtml, navMap, navigate, q, isLoaded, name, role])

  return (
    <div className="stitch-page-root min-h-screen bg-background text-on-background">
      {pageStyles ? <style dangerouslySetInnerHTML={{ __html: pageStyles }} /> : null}
      <div ref={rootRef} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </div>
  )
}
