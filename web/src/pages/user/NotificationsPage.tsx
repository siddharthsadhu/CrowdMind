import { useStitchData } from '@/hooks/useStitchData'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/11-notifications'
import { commonUserNav } from '@/data/navMaps'
import { notificationsApi } from '@/services/api/notifications'

type Filter = 'all' | 'unread' | 'archived'

export default function NotificationsPage() {
  const navigate = useNavigate()
  let currentFilter: Filter = 'all'

  useStitchData(async (root) => {
    const loadNotifications = async (filter: Filter = currentFilter) => {
      currentFilter = filter
      try {
        const res = await notificationsApi.list({ page_size: '50', filter })
        const container = root.querySelector('.space-y-10')
        if (container) {
          container.innerHTML = ''
          
          // Update unread count badges in sidebar
          const unreadCount = res.items.filter(n => !n.read).length
          const unreadValEl = Array.from(root.querySelectorAll('.glass-card')).find(c => 
            c.querySelector('span')?.textContent?.includes('Unread')
          )?.querySelector('.text-headline-md')
          
          if (unreadValEl) {
            unreadValEl.textContent = unreadCount.toString()
          }

          if (res.items.length === 0) {
            container.innerHTML = `
              <div class="glass-card p-8 rounded-xl text-center border border-white/5">
                <span class="material-symbols-outlined text-[48px] text-on-surface-variant mb-2">notifications_off</span>
                <p class="text-on-surface-variant font-body-md">No notifications found.</p>
              </div>
            `
            return
          }

          res.items.forEach((n) => {
            const card = document.createElement('div')
            const priorityClass = n.type === 'faq' ? 'priority-high' : n.type === 'discussion' ? 'priority-medium' : 'priority-info'
            const opacityClass = n.read ? 'opacity-60 hover:opacity-100' : ''
            
            card.className = `glass-card p-5 rounded-xl flex items-start gap-4 ${priorityClass} ${opacityClass} cursor-pointer transition-all`
            
            let icon = 'info'
            let typeLabel = 'INFO'
            let badgeColor = 'bg-primary-container/20 text-primary-fixed-dim border-primary-container/20'
            if (n.type === 'faq') {
              icon = 'verified'
              typeLabel = 'FAQ'
              badgeColor = 'bg-secondary-container/20 text-secondary-fixed-dim border-secondary-container/20'
            } else if (n.type === 'discussion' || n.type === 'reply') {
              icon = 'forum'
              typeLabel = 'DISCUSSION'
              badgeColor = 'bg-tertiary-container/20 text-tertiary-fixed-dim border-tertiary-container/20'
            } else if (n.type === 'reputation') {
              icon = 'trending_up'
              typeLabel = 'REPUTATION'
            } else if (n.type === 'badge') {
              icon = 'military_tech'
              typeLabel = 'BADGE'
            }

            const dateStr = n.created_at ? new Date(n.created_at).toLocaleDateString() : 'Just now'

            card.innerHTML = `
              <div class="pt-1"><input class="w-4 h-4 rounded border-outline-variant bg-transparent text-primary focus:ring-primary/50 cm-select-notif" type="checkbox" data-id="${n.id}"></div>
              <div class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-primary">${icon}</span>
              </div>
              <div class="flex-grow">
                <div class="flex justify-between items-start mb-1">
                  <h3 class="font-body-lg text-on-surface font-semibold ${n.read ? 'font-normal' : 'font-bold'}">${n.title}</h3>
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${badgeColor} border">${typeLabel}</span>
                    <span class="font-label-sm text-label-sm text-on-surface-variant">${dateStr}</span>
                  </div>
                </div>
                <p class="font-body-md text-body-md text-on-surface-variant">${n.body ?? ''}</p>
                ${!n.read ? `<button class="font-label-sm text-label-sm text-primary flex items-center gap-1 hover:underline mt-2 cm-mark-read-btn">Mark as read</button>` : ''}
              </div>
            `

            card.addEventListener('click', async (e) => {
              if ((e.target as HTMLElement).classList.contains('cm-select-notif')) return
              
              if (!n.read) {
                try {
                  await notificationsApi.markRead(n.id)
                  loadNotifications()
                } catch (err) {
                  console.error(err)
                }
              }
            })

            const markReadBtn = card.querySelector('.cm-mark-read-btn')
            markReadBtn?.addEventListener('click', async (e) => {
              e.stopPropagation()
              try {
                await notificationsApi.markRead(n.id)
                loadNotifications()
              } catch (err) {
                console.error(err)
              }
            })

            container.appendChild(card)
          })
        }
      } catch (err) {
        console.error(err)
      }
    }

    // Mark All Read Button
    const markAllBtn = Array.from(root.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Mark All As Read',
    )
    if (markAllBtn) {
      const newMarkAllBtn = markAllBtn.cloneNode(true) as HTMLButtonElement
      markAllBtn.parentNode?.replaceChild(newMarkAllBtn, markAllBtn)
      newMarkAllBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        try {
          await notificationsApi.markAllRead()
          loadNotifications()
        } catch (err) {
          console.error(err)
        }
      })
    }

    // Batch Mark Read Button (drafts icon)
    const draftsIconBtn = root.querySelector('button[title="Mark Read"]')
    if (draftsIconBtn) {
      draftsIconBtn.addEventListener('click', async () => {
        const checkedBoxes = Array.from(root.querySelectorAll('.cm-select-notif:checked')) as HTMLInputElement[]
        const ids = checkedBoxes.map(cb => cb.getAttribute('data-id')).filter(Boolean) as string[]
        if (ids.length > 0) {
          try {
            await Promise.all(ids.map(id => notificationsApi.markRead(id)))
            loadNotifications()
          } catch (err) {
            console.error(err)
          }
        }
      })
    }

    // Master Checkbox
    const masterCheckbox = root.querySelector('.flex.items-center.gap-3.bg-surface-container-low input[type="checkbox"]') as HTMLInputElement | null
    if (masterCheckbox) {
      masterCheckbox.addEventListener('change', () => {
        const checkboxes = Array.from(root.querySelectorAll('.cm-select-notif')) as HTMLInputElement[]
        checkboxes.forEach(cb => {
          cb.checked = masterCheckbox.checked
        })
      })
    }

    // Archive button (single notification)
    const archiveBtn = root.querySelector('button[title="Archive"]') as HTMLButtonElement | null
    if (archiveBtn) {
      const newArchiveBtn = archiveBtn.cloneNode(true) as HTMLButtonElement
      archiveBtn.parentNode?.replaceChild(newArchiveBtn, archiveBtn)
      newArchiveBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        e.stopPropagation()
        const checkedBoxes = Array.from(root.querySelectorAll('.cm-select-notif:checked')) as HTMLInputElement[]
        const ids = checkedBoxes.map(cb => cb.getAttribute('data-id')).filter(Boolean) as string[]
        if (ids.length === 0) {
          alert('Select notifications to archive first')
          return
        }
        try {
          await Promise.all(ids.map(id => notificationsApi.archive(id)))
          loadNotifications()
        } catch (err) {
          console.error(err)
        }
      })
    }

    // Delete button (single notification)
    const deleteBtn = root.querySelector('button[title="Delete"]') as HTMLButtonElement | null
    if (deleteBtn) {
      const newDeleteBtn = deleteBtn.cloneNode(true) as HTMLButtonElement
      deleteBtn.parentNode?.replaceChild(newDeleteBtn, deleteBtn)
      newDeleteBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        e.stopPropagation()
        const checkedBoxes = Array.from(root.querySelectorAll('.cm-select-notif:checked')) as HTMLInputElement[]
        const ids = checkedBoxes.map(cb => cb.getAttribute('data-id')).filter(Boolean) as string[]
        if (ids.length === 0) {
          alert('Select notifications to delete first')
          return
        }
        if (!confirm(`Delete ${ids.length} notification(s)?`)) return
        try {
          await Promise.all(ids.map(id => notificationsApi.delete(id)))
          loadNotifications()
        } catch (err) {
          console.error(err)
        }
      })
    }

    // Filter tabs (All / Unread / Archived)
    const tabs = Array.from(root.querySelectorAll('button.rounded-full'))
    const tabMap: Record<string, Filter> = {
      'all': 'all',
      'unread': 'unread',
      'archived': 'archived',
    }
    tabs.forEach((tab) => {
      const txt = (tab.textContent ?? '').trim().toLowerCase()
      const f = tabMap[txt]
      if (!f) return
      const newTab = tab.cloneNode(true) as HTMLButtonElement
      tab.parentNode?.replaceChild(newTab, tab)
      newTab.addEventListener('click', (e) => {
        e.preventDefault()
        loadNotifications(f)
      })
    })

    loadNotifications()
  }, [navigate])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Notifications"
      navMap={commonUserNav}
    />
  )
}
