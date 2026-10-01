import { useEffect, useState } from 'react'

/** Tracks which of the given section ids is currently nearest the top of the viewport. */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '')
  const key = ids.join('|')

  useEffect(() => {
    const ordered = key.split('|').filter(Boolean)
    setActive(ordered[0] ?? '')
    if (typeof IntersectionObserver === 'undefined') return

    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id)
          else visible.delete(e.target.id)
        }
        const first = ordered.find((id) => visible.has(id))
        if (first) setActive(first)
      },
      { rootMargin: '-10% 0px -70% 0px' },
    )
    for (const id of ordered) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [key])

  return active
}
