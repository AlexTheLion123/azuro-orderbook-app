'use client'

import { useTheme } from '@/app/ThemeContext'
import { ExploreContext } from '@/contexts'
import { SportIcon } from '@/icons'
import clsx from 'clsx'
import { use, useEffect } from 'react'

type ButtonProps = {
  sportId?: string
  title: string
  count: number
  isSelected: boolean
  onClick: () => void
}
const Button: React.FC<ButtonProps> = (props) => {
  const { sportId, title, count, isSelected, onClick } = props
  const { theme } = useTheme()

  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-1 cursor-pointer whitespace-nowrap lg:w-full lg:justify-between w-full rounded-lg xl:hover:border xl:hover:border-gray-300',
        isSelected &&
          theme === 'dark' &&
          'bg-gradient-to-l from-[#6581ff]  to-[#c2d2ff] rounded-md',
        isSelected &&
          theme === 'light' &&
          'bg-gradient-to-l from-blue-500 to-blue-700 text-white',
        !isSelected && theme === 'light' && 'text-[#1d1717] bg-gray-100',
        !isSelected && theme === 'dark' && 'bg-[#FFFFFF0D]',
        'p-2 max-lg:m-0.5'
      )}
    >
      <div className="flex flex-row">
        {Boolean(sportId) ? (
          <SportIcon sportId={sportId} className="lg:pr-1" />
        ) : (
          <span className="invisible">&nbsp;&nbsp;</span>
        )}
        <span
          className={clsx(
            theme === 'dark' && 'font-medium',
            theme === 'light' && 'lg:font-semibold font-normal'
          )}
        >
          {title}
        </span>
      </div>
      <span
        className={clsx(
          'p-1 px-2 rounded-md  text-xs max-xl:hidden font-bold',
          theme === 'dark' && 'bg-slate-400 text-gray-800',
          theme === 'light' && 'white'
        )}
      >
        {count}
      </span>
    </button>
  )
}

export default function AllSportsTag() {
  const { categories, sportSlug, filterGames, filterLeague } =
    use(ExploreContext)
  const handleClick = (sportSlug: string) => {
    filterGames(sportSlug)
  }

  useEffect(() => {
    handleClick('boxing')
  }, [])

  useEffect(() => {
    const sport = categories
      .flatMap((category) => category.sports ?? [])
      .find((sport) => sport?.slug === sportSlug)
    const defaultLeague = sport?.defaultLeagueSlug
    if (defaultLeague) {
      filterLeague(defaultLeague)
    }
  }, [sportSlug])

  return (
    <div className="flex items-center pb-2 gap-4 w-full">
      <div
        className={clsx(
          'flex max-lg:hidden lg:flex-col relative items-center snap-x snap-mandatory overflow-x-auto w-[100%]'
          // 'no-scrollbar'
        )}
      >
        <h1 className="text-left font-bold text-xl w-full pl-2 pt-2">
          Categories
        </h1>
        {categories?.map((category, index) => {
          if (!category) return null
          return (
            <div className="flex lg:block w-full" key={index}>
              <div className="w-full px-3 py-4 font-bold text-lg max-lg:hidden capitalize">
                {category.sports && category.name}
              </div>
              <div className="flex flex-col gap-1">
                {category.sports?.map((item) => {
                  if (!item) return null // Skip undefined items

                  const { sportId, name, games, slug } = item
                  const isSelected = sportSlug === slug

                  return (
                    <Button
                      key={sportId}
                      sportId={sportId}
                      title={name}
                      count={games?.length ?? 0}
                      isSelected={isSelected}
                      onClick={() => handleClick(slug)}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
