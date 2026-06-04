import { useStitchData } from '@/hooks/useStitchData'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/20-settings'
import { commonAdminNav } from '@/data/navMaps'
import { usersApi, UserResponse } from '@/services/api/users'

export default function SettingsPage() {
  const navigate = useNavigate()

  useStitchData(async (root) => {
    let currentUser: UserResponse | null = null
    try {
      currentUser = await usersApi.getMe()
    } catch (err) {
      console.error('Failed to load user info:', err)
    }

    // 1. Inputs Selection & Population
    const labels = Array.from(root.querySelectorAll('label'))

    const nameLabel = labels.find((l) => (l.textContent ?? '').includes('Full Name'))
    const nameInput = nameLabel?.nextElementSibling as HTMLInputElement | null

    const usernameLabel = labels.find((l) => (l.textContent ?? '').includes('Username'))
    const usernameInput = usernameLabel?.nextElementSibling as HTMLInputElement | null

    const bioLabel = labels.find((l) => (l.textContent ?? '').includes('Bio'))
    const bioInput = bioLabel?.nextElementSibling as HTMLTextAreaElement | null

    if (currentUser) {
      if (nameInput) {
        nameInput.value = currentUser.full_name || currentUser.username || ''
      }
      if (usernameInput) {
        usernameInput.value = currentUser.username.startsWith('@')
          ? currentUser.username
          : `@${currentUser.username}`
        usernameInput.disabled = true
      }
      if (bioInput) {
        bioInput.value = currentUser.bio || ''
      }

      // Set avatar urls in the header and profile
      if (currentUser.avatar_url) {
        const profileAvatar = root.querySelector('img[alt="Avatar"]') as HTMLImageElement | null
        if (profileAvatar) {
          profileAvatar.src = currentUser.avatar_url
        }
        const headerAvatar = root.querySelector('header img[alt="User"]') as HTMLImageElement | null
        if (headerAvatar) {
          headerAvatar.src = currentUser.avatar_url
        }
      }
    }

    // 2. Tabs Switch Wiring
    const tabButtons = root.querySelectorAll('#settings-tabs .tab-btn')
    const tabContents = root.querySelectorAll('.tab-content')

    tabButtons.forEach((btn) => {
      btn.removeAttribute('onclick')
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        const targetTab = btn.getAttribute('data-tab')
        if (!targetTab) return

        tabButtons.forEach((b) => {
          b.className =
            'tab-btn flex items-center gap-3 px-6 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 font-label-md transition-all duration-200'
        })
        btn.className =
          'tab-btn flex items-center gap-3 px-6 py-3 text-primary border-r-2 border-primary bg-primary/5 font-label-md transition-all duration-200'

        tabContents.forEach((content) => {
          content.classList.remove('active')
        })

        const targetContent = root.querySelector(`#${targetTab}`)
        if (targetContent) {
          targetContent.classList.add('active')
        }
      })
    })

    // 3. Toasts & Unsaved State Visual Controls
    const unsavedToast = root.querySelector('#unsaved-toast') as HTMLElement | null
    const successToast = root.querySelector('#success-toast') as HTMLElement | null

    const showUnsavedToast = () => {
      if (unsavedToast) {
        unsavedToast.style.transform = 'translateX(0)'
      }
    }

    const hideUnsavedToast = () => {
      if (unsavedToast) {
        unsavedToast.style.transform = 'translateX(150%)'
      }
    }

    const showSuccessToast = () => {
      if (successToast) {
        successToast.style.transform = 'translateX(0)'
        setTimeout(() => {
          successToast.style.transform = 'translateX(150%)'
        }, 3000)
      }
    }

    if (nameInput) {
      nameInput.removeAttribute('oninput')
      nameInput.addEventListener('input', showUnsavedToast)
    }
    if (bioInput) {
      bioInput.removeAttribute('oninput')
      bioInput.addEventListener('input', showUnsavedToast)
    }

    // 4. Save Buttons Configuration & Call integration
    const saveBtn = root.querySelector('#save-btn') as HTMLButtonElement | null
    const toastSaveBtn = root.querySelector('#unsaved-toast button') as HTMLButtonElement | null

    const handleSave = async (e: Event) => {
      e.preventDefault()
      e.stopPropagation()

      const nameVal = nameInput?.value.trim() || ''
      const bioVal = bioInput?.value.trim() || ''

      try {
        if (saveBtn) saveBtn.disabled = true
        if (toastSaveBtn) toastSaveBtn.disabled = true

        const updated = await usersApi.updateMe({
          full_name: nameVal,
          bio: bioVal,
        })

        // Cache update local state copy
        if (currentUser) {
          currentUser.full_name = updated.full_name
          currentUser.bio = updated.bio
        }

        hideUnsavedToast()
        showSuccessToast()
      } catch (err) {
        console.error('Failed to save settings:', err)
        alert('Failed to save settings. Please try again.')
      } finally {
        if (saveBtn) saveBtn.disabled = false
        if (toastSaveBtn) toastSaveBtn.disabled = false
      }
    }

    if (saveBtn) {
      saveBtn.removeAttribute('onclick')
      const newSaveBtn = saveBtn.cloneNode(true) as HTMLButtonElement
      saveBtn.parentNode?.replaceChild(newSaveBtn, saveBtn)
      newSaveBtn.addEventListener('click', handleSave)
    }

    if (toastSaveBtn) {
      toastSaveBtn.removeAttribute('onclick')
      const newToastSaveBtn = toastSaveBtn.cloneNode(true) as HTMLButtonElement
      toastSaveBtn.parentNode?.replaceChild(newToastSaveBtn, toastSaveBtn)
      newToastSaveBtn.addEventListener('click', handleSave)
    }

    // 5. Settings Reset Action
    const resetBtn = root.querySelector('footer button:not(#save-btn)') as HTMLButtonElement | null
    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault()
        if (currentUser) {
          if (nameInput) {
            nameInput.value = currentUser.full_name || currentUser.username || ''
          }
          if (bioInput) {
            bioInput.value = currentUser.bio || ''
          }
          hideUnsavedToast()
        }
      })
    }

    // 6. Range Input Settings Description Label Helper
    const aiRange = root.querySelector('#ai-range') as HTMLInputElement | null
    const aiLabel = root.querySelector('#ai-label') as HTMLElement | null
    if (aiRange && aiLabel) {
      const updateAiLabel = () => {
        const val = parseInt(aiRange.value, 10)
        if (val < 33) {
          aiLabel.textContent = 'Precise'
        } else if (val < 66) {
          aiLabel.textContent = 'Balanced'
        } else {
          aiLabel.textContent = 'Exploratory'
        }
      }
      aiRange.addEventListener('input', updateAiLabel)
      updateAiLabel()
    }
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

