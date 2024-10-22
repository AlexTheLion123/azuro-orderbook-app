import { useTheme } from '@/app/ThemeContext'
import { IconProps } from './props'

const ThemeIcon = ({ props }: { props?: Readonly<IconProps> }) => {
  const { theme, toggleTheme } = useTheme()
  const isLightMode = theme === 'light'

  return (
    <label className="ui-switch">
      <input type="checkbox" checked={!isLightMode} onChange={toggleTheme} />
      <div className="slider">
        <div className="circle"></div>
      </div>
    </label>
  )
}

export default ThemeIcon
