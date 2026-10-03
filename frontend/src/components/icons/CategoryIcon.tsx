import { theme } from '../../styles/theme'
import IconBadge from './IconBadge'
import { BeamIcon, BoltIcon, OrbitIcon, DropletIcon, CubeIcon } from './Icons'

const CATEGORY_ICON: Record<string, { Icon: typeof BeamIcon; color: string }> = {
  'Mechanics of solids': { Icon: BeamIcon, color: theme.colors.spectrum.coral },
  'Machine elements & design': { Icon: BoltIcon, color: theme.colors.spectrum.violet },
  'Dynamics & control': { Icon: OrbitIcon, color: theme.colors.spectrum.cyan },
  'Thermal & fluids': { Icon: DropletIcon, color: theme.colors.spectrum.sun },
  'Design & manufacturing': { Icon: CubeIcon, color: theme.colors.spectrum.leaf },
}

const FALLBACK = { Icon: BeamIcon, color: theme.colors.spectrum.coral }

interface CategoryIconProps {
  category: string
  size?: number
}

/** Colored icon badge for a course category — reused on cards and course headers. */
export default function CategoryIcon({ category, size = 40 }: CategoryIconProps) {
  const { Icon, color } = CATEGORY_ICON[category] ?? FALLBACK
  return (
    <IconBadge color={color} size={size}>
      <Icon style={{ width: '100%', height: '100%' }} />
    </IconBadge>
  )
}
