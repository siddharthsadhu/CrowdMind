import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/20-settings'
import { commonAdminNav } from '@/data/navMaps'
import { usersApi } from '@/services/api/users'

export default function SettingsPage() {
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
        const nameInput = root.querySelector('input[placeholder*="Your name"]') as HTMLInputElement | null
        const emailEl = root.querySelector('input[placeholder*="email"]') as HTMLInputElement | null

        if (nameInput) nameInput.value = user.full_name || user.username
        if (emailEl) emailEl.value = user.email
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
      title="CrowdMind | Settings"
      navMap={commonAdminNav}
    />
  )
}
