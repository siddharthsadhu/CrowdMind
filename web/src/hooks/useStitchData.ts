import { useEffect, type DependencyList } from 'react'

/**
 * Runs an async data-loading function against the Stitch page DOM root.
 * Survives React StrictMode double-mount by using a cancellation flag
 * instead of a setTimeout/initialized-ref pattern (which gets cancelled
 * by the cleanup before it fires).
 */
export function useStitchData(
  fn: (root: HTMLElement) => void | Promise<void>,
  deps: DependencyList = [],
) {
  useEffect(() => {
    let cancelled = false
    const root = document.querySelector('.stitch-page-root') as HTMLElement | null
    if (!root) return

    const promise = Promise.resolve(fn(root))
    if (cancelled) return
    promise.catch((e) => {
      if (!cancelled) console.error('[useStitchData]', e)
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
