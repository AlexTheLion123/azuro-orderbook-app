'use client'
import { useTheme } from '@/app/ThemeContext'
import { ExploreContext } from '@/contexts'
import clsx from 'clsx'
import React, { use, useMemo } from 'react'

type ButtonProps = {
  // sportId?: string
  title: string
  count: number
  isSelected: boolean
  onClick: () => void
}

// TODO create component for this to use with AllSportsTag
const Button: React.FC<ButtonProps> = (props) => {
  const { title, isSelected, onClick, count } = props
  const { theme } = useTheme()

  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-2 p-2 cursor-pointer font-bold whitespace-nowrap rounded-md mr-1',
        theme === 'dark' &&
          isSelected &&
          'bg-gradient-to-l from-[#658eff]  to-[#5e64eb]',
        //theme === 'dark' && !isSelected,
        isSelected &&
          theme === 'light' &&
          'bg-gradient-to-l from-blue-500 to-blue-700 text-white',
        !isSelected && theme === 'light' && 'text-[#1d1717] bg-gray-200',
        !isSelected && theme === 'dark' && 'bg-[#FFFFFF0D]'
      )}
    >
      <span>{title}</span>
      <span
        className={clsx(
          'px-2 py-1 rounded-md text-[10px] max-lg:hidden',
          theme === 'dark' && 'bg-slate-400 text-gray-800',
          theme === 'light' && 'white'
        )}
      >
        {count}
      </span>
    </button>
  )
}

export default function LeaguesTag() {
  const { navigation, filterLeague, sportSlug, leagueSlug } =
    use(ExploreContext)

  const handleClick = (leagueSlug: string) => {
    filterLeague(leagueSlug)
  }

  const leagues = useMemo(() => {
    if (!navigation) {
      return []
    }
    return navigation.flatMap((sport) => {
      if (sport.slug !== sportSlug) {
        return []
      } else {
        return sport.countries.flatMap((country) => country.leagues)
      }
    })
  }, [navigation, sportSlug])

  return (
    <div className="flex items-center flex-wrap overflow-auto">
      {/* <div className="capitalize text-[21px] font-bold">{sportSlug}</div> */}
      <div
        className={clsx(
          'flex relative max-w-[100%] items-center snap-x snap-mandatory overflow-x-auto'
          // 'scrollbar'
        )}
      >
        {/* <Button
          title="All leagues"
          isSelected={!leagueSlug}
          onClick={() => handleClick('')}
          count={leagues.length}
        /> */}
        {leagues.map((league) => {
          return (
            <Button
              key={league.id}
              title={league.name}
              isSelected={league.slug === leagueSlug}
              onClick={() => handleClick(league.slug)}
              count={league.games?.length || 0}
            />
          )
        })}
      </div>
    </div>
  )
}
