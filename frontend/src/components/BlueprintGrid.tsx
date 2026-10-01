/**
 * Faint drafting-table grid — the reference lines under an engineering
 * drawing, not decoration. Sits behind the hero headline on the dark ink
 * background.
 */
export default function BlueprintGrid() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(122, 143, 255, 0.16) 1px, transparent 1px),
          linear-gradient(90deg, rgba(122, 143, 255, 0.16) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse 90% 70% at 20% 30%, black 40%, transparent 85%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 20% 30%, black 40%, transparent 85%)',
      }}
    />
  )
}
