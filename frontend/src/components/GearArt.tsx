/** Builds an SVG path for a toothed gear centred on (cx, cy). R = tip radius, r = root radius, n = tooth count. */
export function gearPath(cx: number, cy: number, R: number, r: number, n: number): string {
  const step = (Math.PI * 2) / n
  const p = (rad: number, a: number) => `${(cx + rad * Math.cos(a)).toFixed(1)} ${(cy + rad * Math.sin(a)).toFixed(1)}`
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = i * step
    d += `${i === 0 ? 'M' : 'L'}${p(r, a)} L${p(R, a + step * 0.12)} L${p(R, a + step * 0.42)} L${p(r, a + step * 0.54)} `
  }
  return `${d}Z`
}

/** Decorative meshed-gears illustration for the home hero. */
export function HeroGears() {
  return (
    <svg
      aria-hidden
      width="720"
      height="620"
      viewBox="0 0 720 620"
      fill="none"
      style={{ position: 'absolute', right: -40, top: 0 }}
    >
      <defs>
        <radialGradient id="gear-white" cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.55" stopColor="#DCE3FF" />
          <stop offset="1" stopColor="#8FA4FF" />
        </radialGradient>
        <radialGradient id="gear-lime" cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#F2FFC2" />
          <stop offset="0.6" stopColor="#C8F04B" />
          <stop offset="1" stopColor="#8DB21C" />
        </radialGradient>
        <linearGradient id="gear-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2C3D7A" />
          <stop offset="1" stopColor="#0E1A3D" />
        </linearGradient>
        <filter id="gear-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="24" stdDeviation="22" floodColor="#0A1A6B" floodOpacity="0.55" />
        </filter>
      </defs>
      <g filter="url(#gear-shadow)">
        <path d={gearPath(330, 290, 190, 158, 18)} fill="url(#gear-white)" />
        <circle cx="330" cy="290" r="62" fill="#2B4FE3" />
        <circle cx="330" cy="290" r="30" fill="#0E1A3D" />
        <path d={gearPath(530, 440, 96, 78, 12)} fill="url(#gear-lime)" />
        <circle cx="530" cy="440" r="30" fill="#0E1A3D" />
        <circle cx="530" cy="440" r="11" fill="#C8F04B" />
        <path d={gearPath(560, 150, 70, 56, 10)} fill="url(#gear-dark)" />
        <circle cx="560" cy="150" r="22" fill="#2B4FE3" />
      </g>
    </svg>
  )
}
