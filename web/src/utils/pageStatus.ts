export function showLoading(el: HTMLElement): () => void {
  const existing = el.querySelector('.cm-status')
  if (existing) existing.remove()
  const div = document.createElement('div')
  div.className = 'cm-status cm-loading'
  div.innerHTML = '<span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>'
  el.prepend(div)
  return () => div.remove()
}

export function showError(el: HTMLElement, msg = 'Failed to load') {
  const existing = el.querySelector('.cm-status')
  if (existing) existing.remove()
  if (!msg) return
  const div = document.createElement('div')
  div.className = 'cm-status cm-error'
  div.textContent = msg
  el.prepend(div)
}

export function showEmpty(el: HTMLElement, msg = 'Nothing here yet') {
  const existing = el.querySelector('.cm-status')
  if (existing) existing.remove()
  if (!msg) return
  const div = document.createElement('div')
  div.className = 'cm-status cm-empty'
  div.textContent = msg
  el.prepend(div)
}

export function clearStatus(el: HTMLElement) {
  el.querySelectorAll('.cm-status').forEach((s) => s.remove())
}
