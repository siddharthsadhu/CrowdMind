import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

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
  }, [bodyHtml, navMap, navigate, q])

  return (
    <div className="stitch-page-root min-h-screen bg-background text-on-background">
      {pageStyles ? <style dangerouslySetInnerHTML={{ __html: pageStyles }} /> : null}
      <div ref={rootRef} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </div>
  )
}
