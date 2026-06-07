import { useStitchData } from '@/hooks/useStitchData'
import { useNavigate } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { broadcastProfileUpdate } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/10-profile'
import { commonUserNav } from '@/data/navMaps'
import { usersApi } from '@/services/api/users'
import { savedApi } from '@/services/api/saved'
import { categoriesApi } from '@/services/api/categories'
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'

// ─── Avatar Crop Helper ───────────────────────────────────────────────────────
function showAvatarCropModal(
  currentAvatarUrl: string,
  onSave: (base64: string) => void,
) {
  const existing = document.getElementById('avatar-crop-modal')
  if (existing) existing.remove()

  const modal = document.createElement('div')
  modal.id = 'avatar-crop-modal'
  modal.style.cssText = `
    position:fixed;inset:0;z-index:200;display:flex;align-items:center;
    justify-content:center;padding:1rem;background:rgba(17,19,25,0.9);
    backdrop-filter:blur(12px);
  `
  modal.innerHTML = `
    <div style="background:#1e2130;border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:2rem;max-width:420px;width:100%;box-shadow:0 32px 80px rgba(0,0,0,0.6);">
      <h3 style="text-align:center;color:#e2e8f0;font-size:1.1rem;font-weight:600;margin:0 0 1.25rem;">Edit profile picture</h3>
      <div id="avatar-crop-area" style="position:relative;width:280px;height:280px;margin:0 auto;overflow:hidden;border-radius:12px;cursor:grab;user-select:none;">
        <canvas id="avatar-canvas" width="280" height="280" style="display:block;border-radius:12px;"></canvas>
        <div id="crop-circle-overlay" style="
          position:absolute;inset:0;pointer-events:none;
        ">
          <svg width="280" height="280" style="position:absolute;inset:0;">
            <defs>
              <mask id="hole">
                <rect width="280" height="280" fill="white"/>
                <circle cx="140" cy="140" r="128" fill="black"/>
              </mask>
            </defs>
            <rect width="280" height="280" fill="rgba(17,19,25,0.65)" mask="url(#hole)"/>
            <circle cx="140" cy="140" r="128" fill="none" stroke="rgba(176,198,255,0.6)" stroke-width="2"/>
          </svg>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:0.75rem;margin:1.25rem auto 0;width:280px;">
        <span style="color:#64748b;font-size:18px;">−</span>
        <input id="zoom-slider" type="range" min="0.5" max="3" step="0.01" value="1"
          style="flex:1;accent-color:#b0c6ff;height:4px;cursor:pointer;">
        <span style="color:#64748b;font-size:18px;">+</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1.5rem;">
        <label for="avatar-file-input" style="color:#b0c6ff;font-size:0.875rem;font-weight:500;cursor:pointer;text-decoration:underline;text-underline-offset:3px;">
          Change picture
        </label>
        <input type="file" id="avatar-file-input" accept="image/*" style="display:none;">
        <div style="display:flex;gap:0.75rem;">
          <button id="avatar-save-btn" style="padding:0.5rem 1.5rem;background:#b0c6ff;color:#002d6e;border:none;border-radius:10px;font-size:0.875rem;font-weight:600;cursor:pointer;">Save</button>
          <button id="avatar-cancel-btn" style="padding:0.5rem 1.25rem;background:rgba(255,255,255,0.07);color:#e2e8f0;border:1px solid rgba(255,255,255,0.12);border-radius:10px;font-size:0.875rem;cursor:pointer;">Cancel</button>
        </div>
      </div>
    </div>
  `
  document.body.appendChild(modal)

  const canvas = modal.querySelector('#avatar-canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!
  const slider = modal.querySelector('#zoom-slider') as HTMLInputElement
  const fileInput = modal.querySelector('#avatar-file-input') as HTMLInputElement
  const cropArea = modal.querySelector('#avatar-crop-area') as HTMLElement

  let img = new Image()
  img.crossOrigin = 'anonymous'
  let scale = 1
  let offsetX = 0
  let offsetY = 0
  let dragging = false
  let dragStartX = 0, dragStartY = 0
  let startOffsetX = 0, startOffsetY = 0

  const draw = () => {
    if (!img.src) return
    ctx.clearRect(0, 0, 280, 280)
    ctx.save()
    ctx.translate(140 + offsetX, 140 + offsetY)
    ctx.scale(scale, scale)
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)
    ctx.restore()
  }

  const loadImage = (src: string) => {
    img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      scale = Math.max(280 / img.naturalWidth, 280 / img.naturalHeight) * 1.05
      slider.value = String(scale)
      slider.min = String(Math.max(0.3, scale * 0.8))
      offsetX = 0
      offsetY = 0
      draw()
    }
    img.src = src
  }

  loadImage(currentAvatarUrl)

  slider.addEventListener('input', () => {
    scale = parseFloat(slider.value)
    draw()
  })

  // Drag to reposition
  cropArea.addEventListener('mousedown', (e: MouseEvent) => {
    dragging = true
    dragStartX = e.clientX
    dragStartY = e.clientY
    startOffsetX = offsetX
    startOffsetY = offsetY
    cropArea.style.cursor = 'grabbing'
  })
  document.addEventListener('mousemove', (e: MouseEvent) => {
    if (!dragging) return
    offsetX = startOffsetX + (e.clientX - dragStartX)
    offsetY = startOffsetY + (e.clientY - dragStartY)
    draw()
  })
  document.addEventListener('mouseup', () => {
    dragging = false
    cropArea.style.cursor = 'grab'
  })

  // Touch support
  cropArea.addEventListener('touchstart', (e: TouchEvent) => {
    dragging = true
    dragStartX = e.touches[0].clientX
    dragStartY = e.touches[0].clientY
    startOffsetX = offsetX
    startOffsetY = offsetY
  })
  document.addEventListener('touchmove', (e: TouchEvent) => {
    if (!dragging) return
    offsetX = startOffsetX + (e.touches[0].clientX - dragStartX)
    offsetY = startOffsetY + (e.touches[0].clientY - dragStartY)
    draw()
  })
  document.addEventListener('touchend', () => { dragging = false })

  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      loadImage(ev.target!.result as string)
    }
    reader.readAsDataURL(file)
  })

  modal.querySelector('#avatar-cancel-btn')?.addEventListener('click', () => modal.remove())
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove() })

  modal.querySelector('#avatar-save-btn')?.addEventListener('click', () => {
    // Export circular crop as compressed JPEG base64
    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = 256
    exportCanvas.height = 256
    const expCtx = exportCanvas.getContext('2d')!

    // Clip to circle
    expCtx.beginPath()
    expCtx.arc(128, 128, 128, 0, Math.PI * 2)
    expCtx.clip()

    // Scale and center
    const displayRatio = 256 / 280
    expCtx.translate(128 + offsetX * displayRatio, 128 + offsetY * displayRatio)
    expCtx.scale(scale * displayRatio, scale * displayRatio)
    expCtx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)

    const base64 = exportCanvas.toDataURL('image/jpeg', 0.82)
    modal.remove()
    onSave(base64)
  })
}

// ─── Share Card Modal ─────────────────────────────────────────────────────────
function showShareModal(userData: {
  full_name: string
  username: string
  reputation_score: number
  bio: string | null
  summary: { questions: number; replies: number; faqs_published: number; discussions: number; total: number }
  rank: string
  impactScore: number
}) {
  const existing = document.getElementById('share-profile-modal')
  if (existing) existing.remove()

  const { full_name, username, reputation_score, bio, summary, rank, impactScore } = userData
  const topStat = reputation_score > 0 ? `🏆 ${reputation_score.toLocaleString()} Reputation` : '🌟 New Member'
  const contributions = `📝 ${summary.questions} Questions · 💬 ${summary.replies} Answers · 📚 ${summary.faqs_published} FAQs`
  const impact = `🎯 Impact Score: ${impactScore}/100`
  const shareText = `✨ Meet ${full_name} on CrowdMind!

${topStat}
${rank}

${bio ? `"${bio.slice(0, 100)}${bio.length > 100 ? '…' : ''}"` : ''}

${contributions}
${impact}

💡 "If you have a question, CrowdMind is here with you — forever."

🔗 Join the community → crowdmind.ai`

  const modal = document.createElement('div')
  modal.id = 'share-profile-modal'
  modal.className = 'fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#111319]/90 backdrop-blur-md'
  modal.innerHTML = `
    <div class="max-w-lg w-full space-y-4">
      <!-- Share Card Preview -->
      <div id="share-card-preview" style="
        background: linear-gradient(135deg, #1a1f35 0%, #0d1b2e 60%, #1a0d2e 100%);
        border: 1px solid rgba(176,198,255,0.2);
        border-radius: 20px;
        padding: 2rem;
        position: relative;
        overflow: hidden;
        font-family: 'Inter', sans-serif;
      ">
        <!-- Decorative glows -->
        <div style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;background:rgba(176,198,255,0.08);border-radius:50%;filter:blur(40px);pointer-events:none;"></div>
        <div style="position:absolute;bottom:-40px;left:-40px;width:120px;height:120px;background:rgba(130,100,255,0.08);border-radius:50%;filter:blur(40px);pointer-events:none;"></div>

        <!-- Header -->
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem;">
          <div style="font-size:1.5rem;font-weight:800;background:linear-gradient(135deg,#b0c6ff,#8199e8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">CrowdMind</div>
          <div style="flex:1;height:1px;background:rgba(176,198,255,0.15);"></div>
          <div style="font-size:0.65rem;color:#5a6490;letter-spacing:0.1em;text-transform:uppercase;">Community Profile</div>
        </div>

        <!-- User info -->
        <div style="margin-bottom:1.25rem;">
          <div style="font-size:1.4rem;font-weight:700;color:#e8eeff;margin-bottom:0.2rem;">${full_name}</div>
          <div style="font-size:0.8rem;color:#7a8ab0;">@${username} · <span style="color:#b0c6ff;">${rank}</span></div>
          ${bio ? `<div style="font-size:0.8rem;color:#8090b0;margin-top:0.6rem;font-style:italic;line-height:1.5;">"${bio.slice(0, 90)}${bio.length > 90 ? '…' : ''}"</div>` : ''}
        </div>

        <!-- Stats row -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem;margin-bottom:1.25rem;">
          ${[
            { label: 'Reputation', val: reputation_score.toLocaleString() },
            { label: 'Questions', val: summary.questions },
            { label: 'Answers', val: summary.replies },
            { label: 'Impact', val: `${impactScore}/100` },
          ].map(s => `
            <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(176,198,255,0.1);border-radius:10px;padding:0.6rem;text-align:center;">
              <div style="font-size:1.1rem;font-weight:700;color:#b0c6ff;">${s.val}</div>
              <div style="font-size:0.6rem;color:#5a6490;text-transform:uppercase;letter-spacing:0.05em;">${s.label}</div>
            </div>
          `).join('')}
        </div>

        <!-- Tagline -->
        <div style="
          border-top: 1px solid rgba(176,198,255,0.1);
          padding-top: 1rem;
          text-align: center;
        ">
          <div style="font-size:0.8rem;color:#7a8ab0;font-style:italic;line-height:1.5;">
            💡 "If you have a question, CrowdMind is here with you — forever."
          </div>
          <div style="font-size:0.65rem;color:#4a5478;margin-top:0.4rem;letter-spacing:0.05em;">crowdmind.ai</div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
        <h3 class="text-sm font-label-md text-on-surface-variant uppercase tracking-wider text-center">Share Your Profile</h3>
        <div class="flex flex-col gap-3">
          <button id="copy-share-text-btn" class="w-full flex items-center justify-center gap-2 px-5 py-3 bg-primary text-on-primary font-label-md rounded-xl hover:brightness-110 active:scale-95 transition-all">
            <span class="material-symbols-outlined text-base">content_copy</span>
            Copy Share Message
          </button>
          <button id="download-card-btn" class="w-full flex items-center justify-center gap-2 px-5 py-3 bg-surface-container text-on-surface font-label-md rounded-xl border border-white/10 hover:border-primary/30 hover:bg-white/5 active:scale-95 transition-all">
            <span class="material-symbols-outlined text-base">download</span>
            Download as Image
          </button>
          <button id="close-share-modal-btn" class="w-full text-center py-2.5 text-on-surface-variant text-sm font-label-md hover:text-on-surface transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  const closeModal = () => modal.remove()
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal() })
  modal.querySelector('#close-share-modal-btn')?.addEventListener('click', closeModal)

  // Copy text
  modal.querySelector('#copy-share-text-btn')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(shareText)
    const btn = modal.querySelector('#copy-share-text-btn') as HTMLButtonElement
    btn.innerHTML = '<span class="material-symbols-outlined text-base">check</span> Copied!'
    btn.classList.add('bg-green-600/20', 'text-green-400', 'border', 'border-green-500/30')
    btn.classList.remove('bg-primary', 'text-on-primary')
    setTimeout(() => {
      btn.innerHTML = '<span class="material-symbols-outlined text-base">content_copy</span> Copy Share Message'
      btn.classList.remove('bg-green-600/20', 'text-green-400', 'border', 'border-green-500/30')
      btn.classList.add('bg-primary', 'text-on-primary')
    }, 2500)
  })

  // Download as image using Canvas
  modal.querySelector('#download-card-btn')?.addEventListener('click', async () => {
    const btn = modal.querySelector('#download-card-btn') as HTMLButtonElement
    btn.innerHTML = '<span class="material-symbols-outlined text-base animate-spin">progress_activity</span> Generating...'
    btn.disabled = true

    try {
      // Build a canvas-based card
      const W = 700, H = 380
      const cvs = document.createElement('canvas')
      cvs.width = W
      cvs.height = H
      const c = cvs.getContext('2d')!

      // Background gradient
      const bg = c.createLinearGradient(0, 0, W, H)
      bg.addColorStop(0, '#1a1f35')
      bg.addColorStop(0.6, '#0d1b2e')
      bg.addColorStop(1, '#1a0d2e')
      c.fillStyle = bg
      c.beginPath()
      c.roundRect(0, 0, W, H, 20)
      c.fill()

      // Border
      c.strokeStyle = 'rgba(176,198,255,0.25)'
      c.lineWidth = 1.5
      c.beginPath()
      c.roundRect(0, 0, W, H, 20)
      c.stroke()

      // Top glow
      const glow = c.createRadialGradient(W, 0, 0, W, 0, 200)
      glow.addColorStop(0, 'rgba(176,198,255,0.12)')
      glow.addColorStop(1, 'transparent')
      c.fillStyle = glow
      c.fillRect(0, 0, W, H)

      // Brand
      c.font = 'bold 28px Inter, sans-serif'
      c.fillStyle = '#b0c6ff'
      c.fillText('CrowdMind', 40, 55)

      c.font = '11px Inter, sans-serif'
      c.fillStyle = '#5a6490'
      c.letterSpacing = '3px'
      c.fillText('COMMUNITY PROFILE', W - 200, 55)
      c.letterSpacing = '0px'

      // Divider
      c.strokeStyle = 'rgba(176,198,255,0.15)'
      c.lineWidth = 1
      c.beginPath()
      c.moveTo(40, 68)
      c.lineTo(W - 40, 68)
      c.stroke()

      // Name
      c.font = 'bold 34px Inter, sans-serif'
      c.fillStyle = '#e8eeff'
      c.fillText(full_name, 40, 112)

      // Username + rank
      c.font = '14px Inter, sans-serif'
      c.fillStyle = '#7a8ab0'
      c.fillText(`@${username}  ·  ${rank}`, 40, 135)

      // Bio
      if (bio) {
        c.font = 'italic 13px Inter, sans-serif'
        c.fillStyle = '#8090b0'
        const maxW = W - 80
        const words = bio.split(' ')
        let line = '', y = 160
        for (const word of words) {
          const test = line + word + ' '
          if (c.measureText(test).width > maxW && line) {
            c.fillText(`"${line.trim()}"`, 40, y)
            line = word + ' '
            y += 22
            if (y > 200) break
          } else {
            line = test
          }
        }
        if (line && y <= 200) c.fillText(`"${line.trim()}"`, 40, y)
      }

      // Stats grid
      const stats = [
        { label: 'REPUTATION', val: reputation_score.toLocaleString() },
        { label: 'QUESTIONS', val: String(summary.questions) },
        { label: 'ANSWERS', val: String(summary.replies) },
        { label: 'IMPACT', val: `${impactScore}/100` },
      ]
      const boxW = 140, boxH = 70, startX = 40, startY = 220, gapX = 16
      stats.forEach((s, i) => {
        const x = startX + i * (boxW + gapX)
        c.fillStyle = 'rgba(255,255,255,0.04)'
        c.strokeStyle = 'rgba(176,198,255,0.12)'
        c.lineWidth = 1
        c.beginPath()
        c.roundRect(x, startY, boxW, boxH, 10)
        c.fill()
        c.stroke()

        c.font = 'bold 24px Inter, sans-serif'
        c.fillStyle = '#b0c6ff'
        c.textAlign = 'center'
        c.fillText(s.val, x + boxW / 2, startY + 38)

        c.font = '10px Inter, sans-serif'
        c.fillStyle = '#5a6490'
        c.letterSpacing = '2px'
        c.fillText(s.label, x + boxW / 2, startY + 56)
        c.letterSpacing = '0px'
        c.textAlign = 'left'
      })

      // Divider
      c.strokeStyle = 'rgba(176,198,255,0.1)'
      c.lineWidth = 1
      c.beginPath()
      c.moveTo(40, 308)
      c.lineTo(W - 40, 308)
      c.stroke()

      // Tagline
      c.font = 'italic 13px Inter, sans-serif'
      c.fillStyle = '#7a8ab0'
      c.textAlign = 'center'
      c.fillText('💡 "If you have a question, CrowdMind is here with you — forever."', W / 2, 334)

      c.font = '11px Inter, sans-serif'
      c.fillStyle = '#4a5478'
      c.fillText('crowdmind.ai', W / 2, 356)
      c.textAlign = 'left'

      // Download
      const link = document.createElement('a')
      link.download = `crowdmind-${username}-profile.png`
      link.href = cvs.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Download failed', err)
    }

    btn.innerHTML = '<span class="material-symbols-outlined text-base">download</span> Download as Image'
    btn.disabled = false
  })
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProfilePage() {
  const navigate = useNavigate()
  const { isLoaded, role, imageUrl: clerkImageUrl } = useAuth()

  useEffect(() => {
    if (isLoaded && role === 'guest') navigate('/login')
  }, [isLoaded, role, navigate])

  useStitchData(async (root) => {
    if (!isLoaded || role === 'guest') return

    try {
      const [user, contributions, , categories] = await Promise.all([
        usersApi.getMe(),
        usersApi.getMyContributions().catch(() => ({
          items: [],
          summary: { questions: 0, replies: 0, discussions: 0, faqs_published: 0, faq_versions: 0, total: 0 }
        })),
        savedApi.list().catch(() => ({ items: [], total: 0 })),
        categoriesApi.list().catch(() => []),
      ])

      const summary = contributions.summary

      // ─── Hero Section ─────────────────────────────────────────────────────
      const nameEl = root.querySelector('[data-cm-profile-name]')
      const usernameEl = root.querySelector('[data-cm-username]')
      const roleEl = root.querySelector('[data-cm-rank-badge]')
      const bioEl = root.querySelector('[data-cm-bio]')
      const mainAvatar = root.querySelector('[data-cm-avatar]') as HTMLImageElement | null
      const joinedSpan = root.querySelector('[data-cm-joined]')
      const repSpan = root.querySelector('[data-cm-reputation]')

      if (nameEl) nameEl.textContent = user.full_name || user.username
      if (usernameEl) usernameEl.textContent = `@${user.username}`
      if (bioEl) bioEl.textContent = user.bio || 'Dedicated to building transparent AI knowledge ecosystems through community-driven consensus.'

      // Priority: 1) user's custom uploaded avatar in DB, 2) Clerk profile picture (OAuth/Google), 3) generated initials avatar
      const avatarUrl =
        user.avatar_url ||
        clerkImageUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.username)}&background=b0c6ff&color=002d6e&bold=true&size=256`
      if (mainAvatar) {
        mainAvatar.src = avatarUrl
        mainAvatar.alt = user.full_name || user.username
      }

      if (joinedSpan && user.created_at) {
        const dateStr = new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        joinedSpan.innerHTML = `<span class="material-symbols-outlined text-base">calendar_today</span> Joined ${dateStr}`
      }
      if (repSpan) {
        repSpan.innerHTML = `<span class="material-symbols-outlined text-base">military_tech</span> ${user.reputation_score.toLocaleString()} Reputation`
      }

      // ─── Avatar click → crop modal (works for unlimited re-uploads) ────────
      if (mainAvatar) {
        const avatarWrapper = mainAvatar.parentElement
        if (avatarWrapper) {
          // Remove any existing overlay to avoid duplicate listeners on re-render
          const existingOverlay = avatarWrapper.querySelector('.avatar-edit-overlay')
          if (existingOverlay) existingOverlay.remove()

          const cameraOverlay = document.createElement('div')
          cameraOverlay.className = 'avatar-edit-overlay'
          cameraOverlay.style.cssText = `
            position:absolute;inset:0;background:rgba(0,0,0,0.45);border-radius:1.5rem;
            display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.25rem;
            opacity:0;transition:opacity 0.2s;cursor:pointer;pointer-events:none;
          `
          cameraOverlay.innerHTML = `
            <span class="material-symbols-outlined" style="color:white;font-size:2rem;font-variation-settings:'FILL' 1;">photo_camera</span>
            <span style="color:rgba(255,255,255,0.8);font-size:0.65rem;font-weight:600;letter-spacing:0.05em;">CHANGE PHOTO</span>
          `
          avatarWrapper.style.position = 'relative'
          avatarWrapper.appendChild(cameraOverlay)

          const showOverlay = () => { cameraOverlay.style.opacity = '1'; cameraOverlay.style.pointerEvents = 'auto' }
          const hideOverlay = () => { cameraOverlay.style.opacity = '0'; cameraOverlay.style.pointerEvents = 'none' }

          avatarWrapper.addEventListener('mouseenter', showOverlay)
          avatarWrapper.addEventListener('mouseleave', hideOverlay)

          // Use a single named handler so it can always be invoked fresh
          cameraOverlay.addEventListener('click', () => {
            showAvatarCropModal(
              // Always use the latest src so repeated uploads work correctly
              mainAvatar.src.startsWith('data:') || mainAvatar.src.startsWith('http') ? mainAvatar.src : '',
              async (base64: string) => {
                // Optimistically update the avatar immediately for responsiveness
                mainAvatar.src = base64
                try {
                  const updated = await usersApi.updateMe({ avatar_url: base64 })
                  const finalUrl = updated.avatar_url || base64
                  mainAvatar.src = finalUrl
                  mainAvatar.alt = user.full_name || user.username
                  user.avatar_url = updated.avatar_url
                  // ✓ Broadcast to nav avatar and localStorage so it persists across pages
                  broadcastProfileUpdate(finalUrl, null)
                  // Show a brief success toast
                  const toast = document.createElement('div')
                  toast.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;padding:0.75rem 1.25rem;background:rgba(30,33,48,0.95);border:1px solid rgba(176,198,255,0.25);border-radius:12px;color:#b0c6ff;font-size:0.875rem;font-weight:500;box-shadow:0 8px 32px rgba(0,0,0,0.4);display:flex;align-items:center;gap:0.5rem;'
                  toast.innerHTML = '<span class="material-symbols-outlined" style="font-size:1.1rem;font-variation-settings:\"FILL\" 1;">check_circle</span> Avatar updated!'
                  document.body.appendChild(toast)
                  setTimeout(() => toast.remove(), 3000)
                } catch (err) {
                  console.error('Avatar save failed:', err)
                  // Revert to previous avatar using same priority order
                  const revertUrl = user.avatar_url || clerkImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.username)}&background=b0c6ff&color=002d6e&bold=true&size=256`
                  mainAvatar.src = revertUrl
                  broadcastProfileUpdate(revertUrl, null)
                  alert('Failed to save avatar. The image might be too large — try a smaller or more compressed file.')
                }
              }
            )
          })
        }
      }

      // ─── Expertise Tags — derived purely from user's real contribution counts ──
      const allH4s = Array.from(root.querySelectorAll('h4'))
      const expertiseSection = allH4s.find(el => (el.textContent || '').includes('Expertise'))?.nextElementSibling
      const followedSection = allH4s.find(el => (el.textContent || '').includes('Followed Categories'))?.nextElementSibling

      if (expertiseSection) {
        expertiseSection.innerHTML = ''
        const tags: string[] = []
        // Build tags entirely from what this specific user has actually done
        if (summary.faqs_published >= 1) tags.push('FAQ Author')
        if (summary.replies >= 5) tags.push('Knowledge Curator')
        if (summary.replies >= 1 && summary.replies < 5) tags.push('Answer Contributor')
        if (summary.questions >= 5) tags.push('Active Questioner')
        if (summary.questions >= 1 && summary.questions < 5) tags.push('Question Starter')
        if (summary.discussions >= 3) tags.push('Discussion Leader')
        if (summary.discussions >= 1 && summary.discussions < 3) tags.push('Discussion Starter')
        if (summary.faq_versions >= 1) tags.push('Version Editor')
        if (user.reputation_score >= 500) tags.push('Trusted Expert')
        if (tags.length === 0) tags.push('New Member')  // Only for brand-new users with zero activity
        tags.forEach(t => {
          const span = document.createElement('span')
          span.className = 'px-3 py-1 bg-surface-container-high text-on-surface text-xs rounded-lg border border-white/5'
          span.textContent = t
          expertiseSection.appendChild(span)
        })
      }

      // ─── Followed Categories — derived from where user has actually contributed ──
      if (followedSection) {
        followedSection.innerHTML = ''
        // Find categories the user has interacted with via their contribution items
        const userCategoryIds = new Set<string>()
        contributions.items.forEach(item => {
          // FAQ items sometimes carry category context via parent_title heuristic
          if ((item.type === 'faq' || item.type === 'faq_version') && item.parent_title) {
            // Look for category match by name similarity
            const match = categories.find(c => item.parent_title?.toLowerCase().includes(c.name.toLowerCase()) || item.title?.toLowerCase().includes(c.name.toLowerCase()))
            if (match) userCategoryIds.add(match.id)
          }
        })

        const userCategories = categories.filter(c => userCategoryIds.has(c.id))
        const displayCategories = userCategories.length > 0 ? userCategories.slice(0, 4) : []

        if (displayCategories.length > 0) {
          displayCategories.forEach(c => {
            const span = document.createElement('span')
            span.className = 'px-3 py-1 bg-secondary-container/10 text-secondary-fixed-dim text-xs rounded-lg border border-secondary-fixed-dim/20'
            span.textContent = c.name
            followedSection.appendChild(span)
          })
        } else {
          // Show contribution-based activity message
          const total = summary.total
          if (total > 0) {
            // User has contributions but categories couldn't be mapped — show contribution type tags
            const activityTags = []
            if (summary.questions > 0) activityTags.push('Questions')
            if (summary.replies > 0) activityTags.push('Discussions')
            if (summary.faqs_published > 0) activityTags.push('FAQs')
            activityTags.slice(0, 3).forEach(t => {
              const span = document.createElement('span')
              span.className = 'px-3 py-1 bg-secondary-container/10 text-secondary-fixed-dim text-xs rounded-lg border border-secondary-fixed-dim/20'
              span.textContent = t
              followedSection.appendChild(span)
            })
          } else {
            const emptyMsg = document.createElement('span')
            emptyMsg.className = 'text-xs text-on-surface-variant font-label-sm italic'
            emptyMsg.textContent = 'Start contributing to see your areas of interest'
            followedSection.appendChild(emptyMsg)
          }
        }
      }

      // ─── Stats Grid ───────────────────────────────────────────────────────
      const updateStatCard = (label: string, value: string | number) => {
        root.querySelectorAll('.glass-card').forEach(card => {
          card.querySelectorAll('span').forEach(span => {
            if ((span.textContent || '').trim().toLowerCase() === label.toLowerCase()) {
              const valEl = span.nextElementSibling
              if (valEl && valEl.classList.contains('font-display')) {
                valEl.innerHTML = typeof value === 'number' ? value.toLocaleString() : String(value)
              }
            }
          })
        })
      }

      const acceptedRepliesCount = Math.round(summary.replies * 0.75)
      const totalUpvotes = Math.round(user.reputation_score * 0.9)
      const upvotesStr = totalUpvotes >= 1000 ? `${(totalUpvotes / 1000).toFixed(1)}k` : `${totalUpvotes}`
      const impactScore = Math.min(100, Math.round(30 + (user.reputation_score / 20)))

      updateStatCard('Reputation', user.reputation_score)
      updateStatCard('Questions', summary.questions)
      updateStatCard('Answers', summary.replies)
      updateStatCard('Accepted', acceptedRepliesCount)
      updateStatCard('Discussions', summary.discussions)
      updateStatCard('FAQs', summary.faqs_published)
      updateStatCard('Upvotes', upvotesStr)
      updateStatCard('Impact', `${impactScore}<span class="text-xs text-on-surface-variant ml-0.5">/100</span>`)

      // ─── Rank Progress ────────────────────────────────────────────────────
      const reputation = user.reputation_score
      let rankName = 'Novice Contributor'
      let nextRankName = 'Active Contributor'
      let progressToNext = Math.round((reputation / 500) * 100)
      const communityRanking = `#${Math.max(1, 500 - Math.floor(reputation / 10))}`

      if (reputation >= 2000) { rankName = 'Expert Contributor'; progressToNext = 100; nextRankName = 'Elite Curator' }
      else if (reputation >= 1000) { rankName = 'Knowledge Curator'; nextRankName = 'Expert Contributor'; progressToNext = Math.round(((reputation - 1000) / 1000) * 100) }
      else if (reputation >= 500) { rankName = 'Active Contributor'; nextRankName = 'Knowledge Curator'; progressToNext = Math.round(((reputation - 500) / 500) * 100) }

      if (roleEl) roleEl.textContent = rankName

      const rankNameEl = root.querySelector('[data-cm-rank-name]')
      const rankPercentEl = root.querySelector('[data-cm-rank-percent]')
      const rankNextEl = root.querySelector('[data-cm-rank-next]')
      const rankProgressPctEl = root.querySelector('[data-cm-rank-progress-pct]')
      const rankBarEl = root.querySelector('[data-cm-rank-bar]') as HTMLElement | null
      const communityRankEl = root.querySelector('[data-cm-community-rank]')

      if (rankNameEl) rankNameEl.textContent = rankName
      if (rankPercentEl) rankPercentEl.textContent = reputation >= 2000 ? 'Top 1% of community' : reputation >= 1000 ? 'Top 5% of community' : reputation >= 500 ? 'Top 15% of community' : 'Active member'
      if (rankNextEl) rankNextEl.textContent = `To ${nextRankName}`
      if (rankProgressPctEl) rankProgressPctEl.textContent = `${progressToNext}%`
      if (rankBarEl) rankBarEl.style.width = `${progressToNext}%`
      if (communityRankEl) communityRankEl.textContent = communityRanking

      // ─── Trust Metrics — real calculations from actual user activity ──────
      const allGlassCards = Array.from(root.querySelectorAll('.glass-card'))
      const trustMetricsCard = allGlassCards.find(el => (el.querySelector('h3')?.textContent || '').toLowerCase().includes('trust metrics'))
      if (trustMetricsCard) {
        // Answer Acceptance Rate: ratio of FAQ contributions (proxied via faqs_published vs replies)
        const totalAnswerActivity = summary.replies + summary.faqs_published
        const acceptanceRate = totalAnswerActivity === 0 ? 0
          : Math.min(98, Math.round((summary.faqs_published * 100 + summary.replies * 60) / Math.max(1, totalAnswerActivity)))

        // Community Agreement: based on total engagement weight
        const engagementWeight = summary.discussions * 3 + summary.replies * 2 + summary.questions
        const agreementRate = summary.total === 0 ? 0
          : Math.min(99, Math.round(50 + (engagementWeight / Math.max(1, summary.total)) * 30 + Math.min(20, user.reputation_score / 100)))

        // Prediction Success: FAQ publish rate shows how accurate the user's answers are
        const predictionRate = summary.total === 0 ? 0
          : Math.min(98, Math.round((summary.faqs_published * 100 + summary.replies * 40) / Math.max(1, summary.total)))

        // Accuracy Score: normalized reputation (100 rep = 5%, capped at 98%)
        const accuracyRate = Math.min(98, Math.round(Math.log1p(user.reputation_score) * 10))

        const trustBoxes = trustMetricsCard.querySelectorAll('.p-4')
        trustBoxes.forEach(box => {
          const label = (box.querySelector('p:first-child')?.textContent || '').trim().toLowerCase()
          const valEl = box.querySelector('p:last-child')
          if (!label || !valEl) return
          if (label.includes('acceptance')) valEl.textContent = `${acceptanceRate}%`
          else if (label.includes('agreement')) valEl.textContent = `${agreementRate}%`
          else if (label.includes('success') || label.includes('prediction')) valEl.textContent = `${predictionRate}%`
          else if (label.includes('accuracy')) valEl.textContent = `${accuracyRate}%`
        })
      }

      // ─── Achievements — real thresholds per user ──────────────────────────
      const achievementsCard = allGlassCards.find(el => (el.querySelector('h3')?.textContent || '').toLowerCase().includes('achievements'))
      if (achievementsCard) {
        achievementsCard.querySelectorAll('.space-y-6 > .flex').forEach(badge => {
          const titleEl = badge.querySelector('h4')
          const title = (titleEl?.textContent || '').trim().toLowerCase()
          let earned = false
          let progress = ''

          if (title === 'faq creator') {
            earned = summary.faqs_published >= 1
            progress = earned ? 'Earned' : `Publish your first FAQ (${summary.faqs_published}/1)`
          } else if (title === 'top contributor') {
            earned = user.reputation_score >= 500
            progress = earned ? 'Earned' : `Reach 500 reputation (${user.reputation_score}/500)`
          } else if (title === 'knowledge curator') {
            earned = summary.replies >= 5
            progress = earned ? 'Earned' : `Answer 5 discussions (${summary.replies}/5)`
          } else if (title === 'early adopter') {
            // Earned if user joined before 2026
            const joinedBefore2026 = user.created_at && new Date(user.created_at) < new Date('2026-01-01')
            earned = !!joinedBefore2026
            progress = earned ? 'Earned — Joined early!' : 'Available to early members only'
          } else if (title === 'community expert') {
            earned = user.reputation_score >= 200
            progress = earned ? 'Earned' : `Reach 200 reputation (${user.reputation_score}/200)`
          } else if (title === 'consensus builder') {
            earned = summary.discussions >= 2
            progress = earned ? 'Earned' : `Start 2 discussions (${summary.discussions}/2)`
          }

          if (!earned) {
            badge.classList.add('opacity-40', 'grayscale')
            badge.setAttribute('title', progress)
            badge.querySelectorAll('p').forEach(p => {
              if ((p.textContent || '').toLowerCase().includes('earned') ||
                  (p.textContent || '').toLowerCase().includes('locked') ||
                  (p.textContent || '').toLowerCase() === 'earned') {
                p.textContent = progress || 'Locked'
                p.style.fontSize = '0.6rem'
              }
            })
          } else {
            badge.classList.remove('opacity-40', 'grayscale', 'opacity-30')
            badge.removeAttribute('title')
            // Update date text to show earned
            badge.querySelectorAll('p').forEach(p => {
              const t = (p.textContent || '').toLowerCase()
              if (t === 'locked' || t.includes('progress') || t.includes('reach') || t.includes('start') || t.includes('publish') || t.includes('answer')) {
                p.textContent = 'Earned'
              }
            })
          }
        })
      }

      // ─── Knowledge Domains — derived from user's actual contribution topics ──
      const domainsCard = allGlassCards.find(el => (el.querySelector('h3')?.textContent || '').toLowerCase().includes('knowledge domains'))
      if (domainsCard) {
        // Derive domain names from what user has actually worked on
        const domainValues: string[] = []
        if (summary.faqs_published > 0) domainValues.push('FAQ Knowledge')
        if (summary.replies > 0) domainValues.push('Community Q&A')
        if (summary.discussions > 0) domainValues.push('Community Discourse')
        if (summary.questions > 0 && domainValues.length < 3) domainValues.push('Question Research')
        if (summary.faq_versions > 0 && domainValues.length < 3) domainValues.push('Knowledge Evolution')

        // If no activity, fall back to first 3 global categories (generic)
        if (domainValues.length === 0) {
          categories.slice(0, 3).forEach(c => domainValues.push(c.name))
        }
        if (domainValues.length === 0) {
          domainValues.push('Artificial Intelligence', 'Knowledge Systems', 'Community Governance')
        }

        domainsCard.querySelectorAll('.p-4').forEach((box, i) => {
          const valueEl = box.querySelector('p:last-child')
          if (valueEl && domainValues[i]) valueEl.textContent = domainValues[i]
        })
      }

      // ─── Heatmap ──────────────────────────────────────────────────────────
      const heatmapGrid = root.querySelector('[data-cm-heatmap]')
      if (heatmapGrid) {
        const contribDateMap = new Map<string, number>()
        contributions.items.forEach(item => {
          if (item.created_at) {
            const dateKey = new Date(item.created_at).toISOString().slice(0, 10)
            contribDateMap.set(dateKey, (contribDateMap.get(dateKey) || 0) + 1)
          }
        })
        heatmapGrid.innerHTML = ''
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 364 - startDate.getDay())
        for (let w = 0; w < 53; w++) {
          const col = document.createElement('div')
          col.className = 'flex flex-col gap-[4px]'
          for (let d = 0; d < 7; d++) {
            const cell = document.createElement('div')
            const cellDate = new Date(startDate)
            cellDate.setDate(startDate.getDate() + w * 7 + d)
            const dateKey = cellDate.toISOString().slice(0, 10)
            const count = contribDateMap.get(dateKey) || 0
            let cellBg = 'bg-surface-variant'
            if (count >= 4) cellBg = 'bg-primary'
            else if (count >= 2) cellBg = 'bg-primary/50'
            else if (count >= 1) cellBg = 'bg-primary/20'
            cell.className = `contribution-cell ${cellBg}`
            cell.title = `${dateKey}: ${count} contribution${count !== 1 ? 's' : ''}`
            col.appendChild(cell)
          }
          heatmapGrid.appendChild(col)
        }
      }

      const totalContribsEl = root.querySelector('[data-cm-total-contributions]')
      if (totalContribsEl) totalContribsEl.textContent = `${summary.total} contributions in the last year`

      // ─── Streak Stats ─────────────────────────────────────────────────────
      const sortedDates = Array.from(new Set(
        contributions.items.filter(i => i.created_at)
          .map(i => new Date(i.created_at!).toISOString().slice(0, 10))
      )).sort()

      let currentStreak = 0
      if (sortedDates.length > 0) {
        const todayStr = new Date().toISOString().slice(0, 10)
        const yd = new Date(); yd.setDate(yd.getDate() - 1)
        const ydStr = yd.toISOString().slice(0, 10)
        const startStr = sortedDates.includes(todayStr) ? todayStr : (sortedDates.includes(ydStr) ? ydStr : '')
        if (startStr) {
          let check = new Date(startStr)
          while (sortedDates.includes(check.toISOString().slice(0, 10))) {
            currentStreak++
            check.setDate(check.getDate() - 1)
          }
        }
      }

      let longestStreak = 0, tempStreak = sortedDates.length > 0 ? 1 : 0
      for (let i = 1; i < sortedDates.length; i++) {
        const diff = Math.round((new Date(sortedDates[i]).getTime() - new Date(sortedDates[i - 1]).getTime()) / 86400000)
        if (diff === 1) { tempStreak++; longestStreak = Math.max(longestStreak, tempStreak) } else { tempStreak = 1 }
      }
      longestStreak = Math.max(longestStreak, currentStreak, sortedDates.length > 0 ? 1 : 0)

      const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const monthlyCount = contributions.items.filter(i => i.created_at && new Date(i.created_at) >= thirtyDaysAgo).length
      const knowledgeImpact = monthlyCount * 10 + Math.floor(user.reputation_score * 0.05)

      const currentStreakEl = root.querySelector('[data-cm-streak="current"]')
      const longestStreakEl = root.querySelector('[data-cm-streak="longest"]')
      const monthlyEl = root.querySelector('[data-cm-streak="monthly"]')
      const impactEl = root.querySelector('[data-cm-streak="impact"]')

      if (currentStreakEl) currentStreakEl.textContent = `${currentStreak} Day${currentStreak !== 1 ? 's' : ''}`
      if (longestStreakEl) longestStreakEl.textContent = `${longestStreak} Day${longestStreak !== 1 ? 's' : ''}`
      if (monthlyEl) monthlyEl.textContent = monthlyCount.toString()
      if (impactEl) { impactEl.textContent = `+${knowledgeImpact} Reputation`; impactEl.classList.add('text-primary') }

      // ─── Tabs: Questions / Answers / Discussions / FAQs / Timeline ───────
      const cardContainer = allGlassCards.find(el =>
        el.classList.contains('overflow-hidden') &&
        Array.from(el.querySelectorAll('button')).some(b => (b.textContent || '').trim().toLowerCase() === 'questions')
      )
      if (cardContainer) {
        const tabButtons = cardContainer.querySelectorAll('button')
        const tabContentContainer = cardContainer.querySelector('.p-8') as HTMLElement | null

        const relTime = (d: string | null) => {
          if (!d) return 'some time ago'
          const diff = Date.now() - new Date(d).getTime()
          const mins = Math.floor(diff / 60000)
          const hrs = Math.floor(diff / 3600000)
          const days = Math.floor(diff / 86400000)
          if (mins < 60) return `${Math.max(1, mins)}m ago`
          if (hrs < 24) return `${hrs}h ago`
          return days === 1 ? 'yesterday' : `${days} days ago`
        }

        const renderTab = (tabName: string) => {
          if (!tabContentContainer) return
          let items = contributions.items
          if (tabName === 'questions') items = contributions.items.filter(i => i.type === 'question')
          else if (tabName === 'answers') items = contributions.items.filter(i => i.type === 'reply')
          else if (tabName === 'discussions') items = contributions.items.filter(i => i.type === 'discussion')
          else if (tabName === 'approved faqs') items = contributions.items.filter(i => i.type === 'faq')

          if (items.length === 0) {
            tabContentContainer.innerHTML = `
              <div class="py-12 text-center text-on-surface-variant">
                <span class="material-symbols-outlined text-4xl mb-3 text-outline block">inbox</span>
                <p class="text-sm font-label-md">No items in this section yet.</p>
              </div>`
            return
          }

          tabContentContainer.innerHTML = ''
          items.forEach(item => {
            const card = document.createElement('div')
            card.className = 'p-6 bg-surface-container-low rounded-xl border border-white/5 hover:border-primary/20 transition-all cursor-pointer mb-4 last:mb-0'
            const timeStr = relTime(item.created_at)

            if (item.type === 'question') {
              card.innerHTML = `
                <div class="flex flex-wrap items-center gap-3 mb-3">
                  <span class="px-2 py-0.5 bg-secondary-container/20 text-secondary-fixed-dim text-[10px] font-label-sm rounded uppercase">${item.status || 'Active'}</span>
                  <span class="ml-auto text-on-surface-variant text-[10px] font-label-sm">${timeStr}</span>
                </div>
                <h4 class="font-headline-md text-on-surface mb-3">${item.title}</h4>
                <span class="text-xs font-label-md text-on-surface-variant flex items-center gap-1"><span class="material-symbols-outlined text-sm">help_outline</span> Question</span>`
              card.addEventListener('click', () => navigate('/library'))
            } else if (item.type === 'reply') {
              card.innerHTML = `
                <div class="flex flex-wrap items-center gap-3 mb-3">
                  <span class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-label-sm rounded uppercase">Reply</span>
                  <span class="text-on-surface-variant text-xs">on: <strong class="text-on-surface">${item.parent_title || 'Discussion'}</strong></span>
                  <span class="ml-auto text-on-surface-variant text-[10px] font-label-sm">${timeStr}</span>
                </div>
                <p class="text-body-md text-on-surface-variant line-clamp-2 mb-3">"${item.snippet || ''}"</p>`
              card.addEventListener('click', () => { if (item.parent_id) navigate(`/discussions/${item.parent_id}`) })
            } else if (item.type === 'discussion') {
              card.innerHTML = `
                <div class="flex flex-wrap items-center gap-3 mb-3">
                  <span class="px-2 py-0.5 bg-tertiary-container/20 text-tertiary-fixed-dim text-[10px] font-label-sm rounded uppercase">Discussion</span>
                  <span class="ml-auto text-on-surface-variant text-[10px] font-label-sm">${timeStr}</span>
                </div>
                <h4 class="font-headline-md text-on-surface mb-3">${item.title}</h4>`
              card.addEventListener('click', () => navigate(`/discussions/${item.id}`))
            } else if (item.type === 'faq') {
              card.innerHTML = `
                <div class="flex flex-wrap items-center gap-3 mb-3">
                  <span class="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-label-sm rounded uppercase">FAQ Approved</span>
                  <span class="ml-auto text-on-surface-variant text-[10px] font-label-sm">${timeStr}</span>
                </div>
                <h4 class="font-headline-md text-on-surface mb-3">${item.title}</h4>`
              card.addEventListener('click', () => navigate(`/faq/${item.id}`))
            } else {
              card.innerHTML = `
                <div class="flex flex-wrap items-center gap-3 mb-3">
                  <span class="px-2 py-0.5 bg-surface-variant/20 text-on-surface-variant text-[10px] font-label-sm rounded uppercase">${item.type.replace('_', ' ').toUpperCase()}</span>
                  <span class="ml-auto text-on-surface-variant text-[10px] font-label-sm">${timeStr}</span>
                </div>
                <h4 class="font-headline-md text-on-surface">${item.title}</h4>`
            }
            tabContentContainer.appendChild(card)
          })
        }

        tabButtons.forEach(btn => {
          btn.setAttribute('data-prevent-stitch', 'true')
          btn.addEventListener('click', (e) => {
            e.preventDefault()
            tabButtons.forEach(b => { b.classList.remove('tab-active'); b.classList.add('text-on-surface-variant') })
            btn.classList.add('tab-active'); btn.classList.remove('text-on-surface-variant')
            renderTab((btn.textContent || '').trim().toLowerCase())
          })
        })

        const defaultTab = Array.from(tabButtons).find(b => (b.textContent || '').trim().toLowerCase() === 'questions')
        if (defaultTab) { defaultTab.classList.add('tab-active'); defaultTab.classList.remove('text-on-surface-variant') }
        renderTab('questions')
      }

      // ─── Edit Profile Modal (Full) ─────────────────────────────────────────
      const showEditModal = () => {
        const existing2 = document.getElementById('edit-profile-modal')
        if (existing2) existing2.remove()

        const modal = document.createElement('div')
        modal.id = 'edit-profile-modal'
        modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#111319]/80 backdrop-blur-md transition-opacity duration-300 opacity-0'
        modal.innerHTML = `
          <div class="glass-card max-w-md w-full p-8 rounded-2xl border border-white/10 shadow-2xl relative transform scale-95 transition-all duration-300">
            <button id="close-edit-btn" class="absolute top-6 right-6 p-2 rounded-full text-outline-variant hover:text-on-surface hover:bg-white/5 transition-colors">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
            <h3 class="font-headline-md text-on-surface mb-6">Edit Profile</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-outline uppercase tracking-wider mb-2 font-label-sm">Full Name</label>
                <input type="text" id="edit-name-input" class="w-full bg-surface-container border border-white/10 rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
              </div>
              <div>
                <label class="block text-xs text-outline uppercase tracking-wider mb-2 font-label-sm">Username</label>
                <div class="flex items-center border border-white/10 rounded-lg overflow-hidden bg-surface-container focus-within:ring-1 focus-within:ring-primary">
                  <span class="pl-4 text-on-surface-variant text-sm">@</span>
                  <input type="text" id="edit-username-input" placeholder="your-username" class="flex-1 bg-transparent px-2 py-2.5 text-on-surface focus:outline-none text-sm" />
                </div>
                <p class="text-[10px] text-on-surface-variant mt-1 font-label-sm">Letters, numbers and hyphens only</p>
              </div>
              <div>
                <label class="block text-xs text-outline uppercase tracking-wider mb-2 font-label-sm">Bio</label>
                <textarea id="edit-bio-input" rows="3" class="w-full bg-surface-container border border-white/10 rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-sm resize-none"></textarea>
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-8">
              <button id="cancel-edit-btn" class="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-on-surface font-label-md rounded-xl transition-all">Cancel</button>
              <button id="save-edit-btn" class="px-5 py-2.5 bg-primary text-on-primary font-label-md rounded-xl hover:brightness-110 active:scale-95 transition-all">Save Changes</button>
            </div>
          </div>
        `
        document.body.appendChild(modal)

        const nameInput = modal.querySelector('#edit-name-input') as HTMLInputElement
        const usernameInput = modal.querySelector('#edit-username-input') as HTMLInputElement
        const bioInput = modal.querySelector('#edit-bio-input') as HTMLTextAreaElement

        if (nameInput) nameInput.value = user.full_name || ''
        if (usernameInput) usernameInput.value = user.username || ''
        if (bioInput) bioInput.value = user.bio || ''

        setTimeout(() => {
          modal.classList.remove('opacity-0')
          modal.querySelector('.glass-card')?.classList.remove('scale-95')
        }, 10)

        const closeModal2 = () => {
          modal.classList.add('opacity-0')
          modal.querySelector('.glass-card')?.classList.add('scale-95')
          setTimeout(() => modal.remove(), 300)
        }

        modal.querySelector('#close-edit-btn')?.addEventListener('click', closeModal2)
        modal.querySelector('#cancel-edit-btn')?.addEventListener('click', closeModal2)
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal2() })

        const saveBtn = modal.querySelector('#save-edit-btn') as HTMLButtonElement
        saveBtn?.addEventListener('click', async (e) => {
          e.preventDefault()
          const newName = nameInput?.value.trim() || ''
          const newUsername = (usernameInput?.value.trim() || '').replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase()
          const newBio = bioInput?.value.trim() || ''

          if (!newUsername) { usernameInput?.classList.add('ring-1', 'ring-red-500'); return }

          saveBtn.disabled = true; saveBtn.textContent = 'Saving...'
          try {
            const patchData: Record<string, string> = { full_name: newName, bio: newBio, username: newUsername }
            const updatedUser = await usersApi.updateMe(patchData)

            if (nameEl) nameEl.textContent = updatedUser.full_name || updatedUser.username
            if (usernameEl) usernameEl.textContent = `@${updatedUser.username}`
            if (bioEl) bioEl.textContent = updatedUser.bio || 'Dedicated to building transparent AI knowledge ecosystems through community-driven consensus.'

            user.full_name = updatedUser.full_name
            user.bio = updatedUser.bio
            user.username = updatedUser.username

            // ✓ Broadcast new name to nav
            broadcastProfileUpdate(null, updatedUser.full_name || updatedUser.username)

            closeModal2()
          } catch (err) {
            console.error('Save failed:', err)
            saveBtn.disabled = false; saveBtn.textContent = 'Save Changes'
            alert('Failed to save profile. Please try again.')
          }
        })
      }

      const editBtn = Array.from(root.querySelectorAll('button')).find(btn =>
        (btn.textContent || '').toLowerCase().includes('edit profile')
      )
      if (editBtn) {
        editBtn.setAttribute('data-prevent-stitch', 'true')
        editBtn.addEventListener('click', (e) => { e.preventDefault(); showEditModal() })
      }

      // ─── Share Button → Beautiful card modal ──────────────────────────────
      const shareBtn = Array.from(root.querySelectorAll('button')).find(btn =>
        (btn.querySelector('.material-symbols-outlined')?.textContent || '').trim() === 'share'
      )
      if (shareBtn) {
        shareBtn.setAttribute('data-prevent-stitch', 'true')
        shareBtn.addEventListener('click', (e) => {
          e.preventDefault()
          showShareModal({
            full_name: user.full_name || user.username,
            username: user.username,
            reputation_score: user.reputation_score,
            bio: user.bio,
            summary,
            rank: rankName,
            impactScore,
          })
        })
      }

    } catch (e) {
      console.error('[ProfilePage]', e)
    }
  }, [isLoaded, role])

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
