import { getIconComponent } from './sports/utils'

export const IconGradient = () => (
  <defs>
    <linearGradient id="football-gradient" x2="0%" y2="50%" x1="100%" y1="50%">
      <stop offset="12.88%" stopColor="#658eff" />
      <stop offset="50.05%" stopColor="#B37ED3" />
      <stop offset="88.76%" stopColor="#c2d2ff" />
    </linearGradient>
  </defs>
)

type SportIconProps = {
  sportId?: string | number
  gradient?: string
  width?: string
  height?: string
  color?: string
  className?: string
}

const SportIcon = ({ sportId = '', ...props }: Readonly<SportIconProps>) => {
  const Icon = getIconComponent(sportId)
  return (
    <Icon {...props}>
      <IconGradient />
    </Icon>
  )
}

export default SportIcon
