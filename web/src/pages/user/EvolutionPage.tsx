import { useState, useEffect, useRef, useCallback } from 'react'
import { useStitchData } from '@/hooks/useStitchData'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/14-evolution'
import { commonUserNav } from '@/data/navMaps'
import { evolutionApi, FaqTimelineResponse, EvolutionEventResponse, VersionDiffResponse } from '@/services/api/evolution'
import { faqsApi, PublishedFaqResponse } from '@/services/api/faqs'
import { useAuth } from '@/context/AuthContext'

const EVENT_META: Record<string, { label: string; color: string; icon: string }> = {
  FAQ_PUBLISHED: { label: 'PUBLISHED', color: 'border-primary', icon: 'auto_awesome' },
  FAQ_UPDATED: { label: 'UPDATED', color: 'border-secondary-fixed-dim', icon: 'edit_note' },
  FAQ_ROLLBACK: { label: 'ROLLBACK', color: 'border-tertiary', icon: 'settings_backup_restore' },
  DISCUSSION_SYNTHESIZED: { label: 'SYNTHESIZED', color: 'border-secondary-fixed-dim', icon: 'auto_awesome' },
  CONSENSUS_RECORDED: { label: 'CONSENSUS', color: 'border-tertiary', icon: 'groups' },
  CANDIDATE_GENERATED: { label: 'CANDIDATE', color: 'border-outline', icon: 'inventory_2' },
  CANDIDATE_APPROVED: { label: 'APPROVED', color: 'border-primary', icon: 'verified' },
  CANDIDATE_REJECTED: { label: 'REJECTED', color: 'border-error', icon: 'block' },
}

function getEventMeta(t: string) {
  return EVENT_META[t] || { label: t, color: 'border-outline', icon: 'event_note' }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return iso.slice(0, 10) }
}

function timeAgo(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days < 1) return 'today'
    if (days < 7) return `${days}d ago`
    if (days < 30) return `${Math.floor(days / 7)}w ago`
    if (days < 365) return `${Math.floor(days / 30)}mo ago`
    return `${Math.floor(days / 365)}y ago`
  } catch { return '' }
}

function escapeHtml(s: string): string {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export default function EvolutionPage() {
  const { role } = useAuth()
  const isAdmin = role === 'admin'
  const [faqs, setFaqs] = useState<PublishedFaqResponse[]>([])
  const [selectedFaqId, setSelectedFaqId] = useState<string>('')
  const [timeline, setTimeline] = useState<FaqTimelineResponse | null>(null)
  const diffFromRef = useRef<number | ''>('')
  const diffToRef = useRef<number | ''>('')
  const [, setDiffVersion] = useState(0)  // bump to force re-render of diff panel
  const dataRef = useRef<{
    root: HTMLElement
    selector: HTMLSelectElement | null
    timelineList: HTMLElement | null
    timelineEmpty: HTMLElement | null
    timelineLine: HTMLElement | null
    insights: HTMLElement | null
    diffFromSel: HTMLSelectElement | null
    diffToSel: HTMLSelectElement | null
    rollbackBtn: HTMLButtonElement | null
  } | null>(null)

  useEffect(() => {
    faqsApi.list({ page_size: '50' })
      .then((res) => setFaqs(res.items || []))
      .catch((err) => console.error('[EvolutionPage] failed to load FAQs:', err))
  }, [])

  const loadTimeline = useCallback(async (faqId: string) => {
    if (!faqId) { setTimeline(null); return }
    try {
      const tl = await evolutionApi.getTimeline(faqId)
      setTimeline(tl)
      if (tl.timeline.length >= 2) {
        diffFromRef.current = tl.timeline[tl.timeline.length - 1].version_number
        diffToRef.current = tl.timeline[0].version_number
      } else {
        diffFromRef.current = ''
        diffToRef.current = ''
      }
      setDiffVersion((v) => v + 1)
    } catch (err) {
      console.error('[EvolutionPage] failed to load timeline:', err)
      setTimeline(null)
    }
  }, [])

  useEffect(() => {
    if (selectedFaqId) loadTimeline(selectedFaqId)
  }, [selectedFaqId, loadTimeline])

  useStitchData((root) => {
    const d = {
      root,
      selector: root.querySelector('[data-cm-faq-selector]') as HTMLSelectElement | null,
      timelineList: root.querySelector('[data-cm-timeline-list]') as HTMLElement | null,
      timelineEmpty: root.querySelector('[data-cm-timeline-empty]') as HTMLElement | null,
      timelineLine: root.querySelector('[data-cm-timeline-line]') as HTMLElement | null,
      insights: root.querySelector('[data-cm-insights]') as HTMLElement | null,
      diffFromSel: root.querySelector('[data-cm-diff-from]') as HTMLSelectElement | null,
      diffToSel: root.querySelector('[data-cm-diff-to]') as HTMLSelectElement | null,
      rollbackBtn: root.querySelector('[data-cm-rollback]') as HTMLButtonElement | null,
    }
    dataRef.current = d

    // Q8=B: Public sees simple timeline + summary badge only.
    // Admin sees full diffs + rollback + audit. Hide admin-only sections for non-admins.
    if (!isAdmin) {
      const diffSection = root.querySelector('[data-cm-diff-section]') as HTMLElement | null
      if (diffSection) diffSection.classList.add('hidden')
      if (d.insights) {
        const insightsCard = d.insights.closest('aside')
        if (insightsCard) insightsCard.classList.add('hidden')
      }
      if (d.rollbackBtn) d.rollbackBtn.classList.add('hidden')
    } else {
      // Admin: show admin badge in header
      const headerEl = root.querySelector('header')
      if (headerEl && !headerEl.querySelector('[data-cm-admin-badge]')) {
        const badge = document.createElement('span')
        badge.setAttribute('data-cm-admin-badge', 'true')
        badge.className = 'ml-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-bold ring-1 ring-tertiary/20'
        badge.innerHTML = '<span class="material-symbols-outlined text-[12px]">shield_person</span> ADMIN VIEW'
        const h1 = headerEl.querySelector('h1')
        if (h1) h1.appendChild(badge)
      }
    }

    if (d.selector) {
      d.selector.onchange = (e) => {
        const v = (e.target as HTMLSelectElement).value
        setSelectedFaqId(v)
      }
    }

    const refreshBtn = root.querySelector('[data-cm-refresh]') as HTMLButtonElement | null
    if (refreshBtn) {
      refreshBtn.onclick = () => {
        if (selectedFaqId) loadTimeline(selectedFaqId)
      }
    }
  }, [selectedFaqId, loadTimeline, isAdmin])

  useEffect(() => {
    const d = dataRef.current
    if (!d || !timeline) return
    renderTimeline(d, timeline)
    renderInsights(d, timeline.events)
    renderDiffSelectors(d, timeline, diffFromRef, diffToRef, () => setDiffVersion((v) => v + 1))
    renderMetrics(d, timeline)
  }, [timeline])

  useEffect(() => {
    const d = dataRef.current
    if (!d || !timeline) return
    // Q8=B: public users don't see diff body
    if (!isAdmin) return
    if (diffFromRef.current && diffToRef.current && diffFromRef.current !== diffToRef.current) {
      const fromVer = timeline.timeline.find((t) => t.version_number === diffFromRef.current)
      const toVer = timeline.timeline.find((t) => t.version_number === diffToRef.current)
      if (fromVer && toVer) {
        evolutionApi
          .getDiff(timeline.faq_id, fromVer.version_number, toVer.version_number)
          .then((dResp) => renderDiff(d, dResp, fromVer, toVer))
          .catch((err) => console.error('[EvolutionPage] diff failed:', err))
      }
    } else {
      const fp = d.root.querySelector('[data-cm-diff-from-body]') as HTMLElement | null
      const tp = d.root.querySelector('[data-cm-diff-to-body]') as HTMLElement | null
      if (fp) fp.innerHTML = '<div class="text-on-surface-variant italic">Select two different versions to compare.</div>'
      if (tp) tp.innerHTML = ''
      const cap = d.root.querySelector('[data-cm-diff-caption]')
      if (cap) cap.textContent = 'Select two versions to compare.'
    }
  }, [timeline, isAdmin, /* diffVersion changes trigger via setDiffVersion */])

  useEffect(() => {
    if (faqs.length === 0) return
    const d = dataRef.current
    if (!d?.selector) return
    const sel = d.selector
    sel.innerHTML = '<option value="">Select a knowledge artifact…</option>'
    faqs.forEach((f) => {
      const opt = document.createElement('option')
      opt.value = f.id
      opt.textContent = `${f.title} (v${f.version_number})`
      if (f.id === selectedFaqId) opt.selected = true
      sel.appendChild(opt)
    })
  }, [faqs, selectedFaqId])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="Evolution"
      navMap={commonUserNav}
    />
  )
}

function renderTimeline(
  d: { timelineList: HTMLElement | null; timelineEmpty: HTMLElement | null; timelineLine: HTMLElement | null },
  timeline: FaqTimelineResponse,
) {
  if (!d.timelineList || !d.timelineEmpty || !d.timelineLine) return
  d.timelineList.innerHTML = ''
  d.timelineList.classList.remove('hidden')
  d.timelineEmpty.classList.add('hidden')
  d.timelineLine.classList.remove('hidden')

  const ordered = [...timeline.timeline].sort((a, b) => b.version_number - a.version_number)
  ordered.forEach((entry, idx) => {
    const isCurrent = entry.is_current
    const isLatest = idx === 0
    const sizeClass = isCurrent ? 'h-16 w-16' : isLatest ? 'h-12 w-12' : 'h-10 w-10'
    const iconSize = isCurrent ? 'text-[32px]' : isLatest ? 'text-[24px]' : 'text-[20px]'
    const icon = isCurrent ? 'auto_awesome' : isLatest ? 'deployed_code' : 'history'
    const iconBg = isCurrent
      ? 'bg-secondary-container text-on-secondary-container animate-pulse'
      : isLatest
        ? 'bg-primary text-on-primary'
        : 'bg-surface-container-high text-outline border-2 border-outline-variant'
    const cardPad = isCurrent ? 'p-6' : 'p-4'
    const cardRadius = isCurrent ? 'rounded-2xl' : 'rounded-xl'
    const cardBorder = isCurrent
      ? 'border-secondary-container/50'
      : isLatest ? 'border-primary/50' : ''
    const cardWidth = isCurrent ? 'max-w-sm' : 'max-w-xs'
    const opacity = !isCurrent && !isLatest ? 'opacity-60' : ''

    const card = document.createElement('div')
    card.className = `relative z-10 w-full ${idx < ordered.length - 1 ? 'mb-12' : ''}`
    card.innerHTML = `
      <div class="flex flex-col items-center">
        <div class="${sizeClass} rounded-full flex items-center justify-center ${iconBg} ${isCurrent ? 'node-glow border-4 border-surface ring-2 ring-secondary-container/20' : ''}">
          <span class="material-symbols-outlined ${iconSize}" ${isCurrent || isLatest ? 'data-weight="fill"' : ''}>${icon}</span>
        </div>
        <div class="mt-4 glass-card ${cardPad} ${cardRadius} ${cardBorder} w-full ${cardWidth} text-center ${opacity}">
          <div class="flex justify-between items-center mb-${isCurrent ? '2' : '1'}">
            <span class="${isCurrent ? 'text-secondary-fixed-dim' : isLatest ? 'text-primary' : 'text-on-surface-variant'} font-label-md">VERSION ${entry.version_number}.0</span>
            <span class="text-[10px] text-outline">${formatDate(entry.created_at)}</span>
          </div>
          <h4 class="font-headline-md text-on-surface mb-${isCurrent ? '2' : '1'}">${escapeHtml(entry.change_summary || entry.title)}</h4>
          <p class="text-[11px] text-outline">${timeAgo(entry.created_at)}</p>
        </div>
      </div>
    `
    d.timelineList!.appendChild(card)
  })
}

function renderInsights(
  d: { insights: HTMLElement | null },
  events: EvolutionEventResponse[],
) {
  if (!d.insights) return
  d.insights.innerHTML = ''
  if (events.length === 0) {
    d.insights.innerHTML = `<div class="text-on-surface-variant font-body-md text-center py-6">No evolution events yet for this FAQ.</div>`
    return
  }
  events.slice(0, 4).forEach((ev) => {
    const meta = getEventMeta(ev.event_type)
    const div = document.createElement('div')
    div.className = `border-l-2 ${meta.color} pl-4`
    div.innerHTML = `
      <p class="text-label-sm mb-1 uppercase tracking-wider flex items-center gap-1">
        <span class="material-symbols-outlined text-[14px]">${meta.icon}</span>
        ${meta.label}
      </p>
      <p class="font-body-md text-[14px] text-on-surface-variant leading-relaxed">${escapeHtml(ev.description || 'Evolution event recorded')}</p>
      <p class="text-label-sm text-outline mt-1">${timeAgo(ev.created_at)}</p>
    `
    d.insights!.appendChild(div)
  })
}

function renderMetrics(
  d: { root: HTMLElement },
  timeline: FaqTimelineResponse,
) {
  const accuracyEl = d.root.querySelector('[data-cm-metric-accuracy]')
  const accuracyRing = d.root.querySelector('[data-cm-metric-accuracy-ring]')
  const agreementEl = d.root.querySelector('[data-cm-metric-agreement]')
  const agreementDelta = d.root.querySelector('[data-cm-metric-agreement-delta]')
  const frequencyEl = d.root.querySelector('[data-cm-metric-frequency]')
  const stabilityBar = d.root.querySelector('[data-cm-metric-stability-bar]')
  const stabilityScore = d.root.querySelector('[data-cm-metric-stability-score]')
  const stabilityBadge = d.root.querySelector('[data-cm-metric-stability-badge]')

  const updates = timeline.events.filter((e) => e.event_type === 'FAQ_UPDATED').length
  const total = timeline.events.length
  const stability = total === 0 ? 100 : Math.max(0, 100 - updates * 15)
  const stabilityStatus = stability >= 80 ? 'STABLE' : stability >= 50 ? 'EVOLVING' : 'VOLATILE'
  const stabilityColor = stability >= 80 ? 'bg-primary/10 text-primary ring-primary/20' :
                        stability >= 50 ? 'bg-secondary/10 text-secondary-fixed-dim ring-secondary/20' :
                        'bg-tertiary/10 text-tertiary ring-tertiary/20'

  if (accuracyEl) accuracyEl.textContent = `${Math.min(100, 70 + timeline.current_version * 5)}%`
  if (accuracyRing) {
    const dash = Math.min(100, 70 + timeline.current_version * 5)
    accuracyRing.setAttribute('stroke-dasharray', `${dash}, 100`)
  }
  if (agreementEl) agreementEl.textContent = '—'
  if (agreementDelta) agreementDelta.textContent = '—'
  if (frequencyEl) frequencyEl.innerHTML = `${total} <span class="text-label-sm text-on-surface-variant">events</span>`
  if (stabilityBar) (stabilityBar as HTMLElement).style.width = `${stability}%`
  if (stabilityScore) stabilityScore.textContent = `${stability}% Score`
  if (stabilityBadge) {
    stabilityBadge.className = `flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ring-1 ${stabilityColor}`
    stabilityBadge.innerHTML = `<span class="h-1.5 w-1.5 rounded-full ${stability >= 80 ? 'bg-primary' : stability >= 50 ? 'bg-secondary-fixed-dim' : 'bg-tertiary'} ${stability >= 80 ? 'animate-pulse' : ''}"></span>${stabilityStatus}`
  }
}

function renderDiffSelectors(
  d: { diffFromSel: HTMLSelectElement | null; diffToSel: HTMLSelectElement | null; rollbackBtn: HTMLButtonElement | null },
  timeline: FaqTimelineResponse,
  fromRef: React.MutableRefObject<number | ''>,
  toRef: React.MutableRefObject<number | ''>,
  onChange: () => void,
) {
  if (!d.diffFromSel || !d.diffToSel) return
  d.diffFromSel.innerHTML = '<option value="">…</option>'
  d.diffToSel.innerHTML = '<option value="">…</option>'
  const ordered = [...timeline.timeline].sort((a, b) => a.version_number - b.version_number)
  ordered.forEach((v) => {
    const opt1 = document.createElement('option')
    opt1.value = String(v.version_number)
    opt1.textContent = `v${v.version_number}.0`
    if (fromRef.current === v.version_number) opt1.selected = true
    const opt2 = opt1.cloneNode(true) as HTMLOptionElement
    if (toRef.current === v.version_number) opt2.selected = true
    d.diffFromSel!.appendChild(opt1)
    d.diffToSel!.appendChild(opt2)
  })
  d.diffFromSel.onchange = (e) => {
    const raw = (e.target as HTMLSelectElement).value
    fromRef.current = raw ? Number(raw) : ''
    if (d.rollbackBtn) d.rollbackBtn.disabled = !fromRef.current || !toRef.current || fromRef.current === toRef.current
    onChange()
  }
  d.diffToSel.onchange = (e) => {
    const raw = (e.target as HTMLSelectElement).value
    toRef.current = raw ? Number(raw) : ''
    if (d.rollbackBtn) d.rollbackBtn.disabled = !fromRef.current || !toRef.current || fromRef.current === toRef.current
    onChange()
  }
  if (d.rollbackBtn) {
    d.rollbackBtn.disabled = !fromRef.current || !toRef.current || fromRef.current === toRef.current
  }
}

function renderDiff(
  d: { root: HTMLElement },
  diff: VersionDiffResponse,
  fromVer: { version_number: number; title: string },
  toVer: { version_number: number; title: string },
) {
  const fromLabel = d.root.querySelector('[data-cm-diff-from-label]')
  const toLabel = d.root.querySelector('[data-cm-diff-to-label]')
  const fromTitle = d.root.querySelector('[data-cm-diff-from-title]')
  const toTitle = d.root.querySelector('[data-cm-diff-to-title]')
  const fromBody = d.root.querySelector('[data-cm-diff-from-body]')
  const toBody = d.root.querySelector('[data-cm-diff-to-body]')
  const caption = d.root.querySelector('[data-cm-diff-caption]')

  if (fromLabel) fromLabel.textContent = `v${fromVer.version_number}.0 · Legacy`
  if (toLabel) toLabel.textContent = `v${toVer.version_number}.0 · Active`
  if (fromTitle) fromTitle.textContent = fromVer.title
  if (toTitle) toTitle.textContent = toVer.title
  if (caption) caption.textContent = `Comparing v${fromVer.version_number}.0 → v${toVer.version_number}.0 · +${diff.additions} lines, -${diff.deletions} lines`

  if (!fromBody || !toBody) return
  let fromHtml = ''
  let toHtml = ''
  diff.diff.forEach((dOp) => {
    if (dOp.op === 'equal') return
    if (dOp.before && dOp.before.length) {
      dOp.before.forEach((line) => {
        fromHtml += `<div class="bg-error/15 text-error px-2 py-1 rounded line-through opacity-80">- ${escapeHtml(line) || ' '}</div>`
      })
    }
    if (dOp.after && dOp.after.length) {
      dOp.after.forEach((line) => {
        toHtml += `<div class="bg-primary/15 text-primary px-2 py-1 rounded">+ ${escapeHtml(line) || ' '}</div>`
      })
    }
  })
  if (!fromHtml) fromHtml = '<div class="text-on-surface-variant italic">No removed content.</div>'
  if (!toHtml) toHtml = '<div class="text-on-surface-variant italic">No additions.</div>'
  fromBody.innerHTML = fromHtml
  toBody.innerHTML = toHtml
}
