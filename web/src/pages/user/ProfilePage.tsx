import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/10-profile'
import { commonUserNav } from '@/data/navMaps'
import { usersApi } from '@/services/api/users'

export default function ProfilePage() {
  const navigate = useNavigate()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const timer = setTimeout(async () => {
      const root = document.querySelector('.stitch-page-root')
      if (!root) return

      try {
        const user = await usersApi.getMe()
        const nameEl = root.querySelector('.font-display.text-display')
        const roleEl = root.querySelector('.bg-primary\\/10.text-primary.font-label-sm')
        const emailEl = root.querySelector('.text-on-surface-variant .font-body-md')

        if (nameEl) nameEl.textContent = user.full_name || user.username
        if (roleEl) roleEl.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1)
        if (emailEl) emailEl.textContent = user.email

        const mainAvatar = root.querySelector('img[alt="Alex Rivera"]') as HTMLImageElement | null
        if (mainAvatar) {
          mainAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.username)}&background=b0c6ff&color=002d6e&bold=true&size=256`
          mainAvatar.alt = user.full_name || user.username
        }
      } catch {
        // keep static
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | User Profile"
      navMap={{
        ...commonUserNav,
        'saved knowledge': '/saved',
        contributions: '/contributions',
        'my contributions': '/contributions',
        evolution: '/evolution',
      }}
    />
  )
}
