import katex from 'katex'
import { useMemo } from 'react'

interface FormulaProps {
  latex: string
  displayMode?: boolean
  className?: string
}

/** Renders a LaTeX string via KaTeX. Falls back to the raw source if it fails to parse. */
export default function Formula({ latex, displayMode = false, className }: FormulaProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, { throwOnError: false, displayMode })
    } catch {
      return latex
    }
  }, [latex, displayMode])

  // eslint-disable-next-line react/no-danger
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
