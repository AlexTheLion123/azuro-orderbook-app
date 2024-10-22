'use client'
import { useTheme } from '@/app/ThemeContext'
import { GameInfo, GameMarkets } from '@/components'
import BreadCrumbBackButton from '@/components/Button/BackButton'
import { LoadingGameInfo } from '@/components/Loading'
import { GameInfoNotFound } from '@/components/NotFound'
import { BetSuccessNoti } from '@/components/Noti'
import Skeleton, {
  SkeletonArray,
  makeSkeletonArray,
} from '@/components/Skeleton'
import { ExploreContext } from '@/contexts'
import { useGameMarkets } from '@/hooks'
import { useGame, useGameStatus } from '@azuro-org/sdk'
import type { GameQuery, GameStatus } from '@azuro-org/toolkit'
import clsx from 'clsx'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useContext } from 'react'

export type MarketsProps = {
  gameId: string
  gameStatus: GameStatus
}

const Markets: React.FC<MarketsProps> = ({ gameId, gameStatus }) => {
  const { loading, markets } = useGameMarkets({
    gameId,
    gameStatus,
  })

  const { outcomeSelected, setOutcomeSelected } = useContext(ExploreContext)

  if (loading) {
    return (
      <div className="space-y-6">
        {makeSkeletonArray(3).map((key) => (
          <div key={key}>
            <Skeleton className="!w-[70px] !h-[20px]" />
            <div className="flex gap-4 mt-2 flex-col sm:flex-row sm:h-auto h-[200px]">
              <SkeletonArray
                length={2}
                className="flex-1 !h-[80px] rounded-xl"
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!markets) {
    return null
  }

  return (
    <>
      <GameMarkets
        markets={markets}
        onSelectOutcome={(outcome) => {
          setOutcomeSelected(outcome)
        }}
      />
    </>
  )
}

type ContentProps = {
  game: GameQuery['games'][0]
  isGameInLive: boolean
}

const Content: React.FC<ContentProps> = ({ game, isGameInLive }) => {
  const router = useRouter()
  const { status: gameStatus } = useGameStatus({
    startsAt: +game.startsAt,
    graphStatus: game.status,
    isGameExistInLive: isGameInLive,
  })

  const handleBack = useCallback(() => {
    router.push('/')
  }, [router])
  const { theme } = useTheme()

  return (
    <div className="flex flex-col gap-2 px-4 h-full overflow-hidden">
      <BetSuccessNoti />
      <div
        className={clsx(
          `cursor-pointer rounded-lg p-3`,
          theme === 'dark'
            ? 'bg-[#232931]'
            : 'bg-white border border-gray-300 border-1'
        )}
        onClick={handleBack}
      >
        <BreadCrumbBackButton
          sport={game.sport}
          leagueSlug={game.league.slug}
        />
      </div>
      <div
        className={clsx(
          `rounded-lg h-full bg-[#252A31] overflow-y-auto overflow-x-hidden`,
          theme === 'dark'
            ? 'bg-[#232931]'
            : 'bg-gray-200 border border-gray-300 border-1'
        )}
      >
        <div
          className={clsx(
            'bg-gradient-to-r from-blue-600 via-gray-400 to-blue-600 rounded-t-lg py-3',
            theme === 'dark' ? 'text-black' : 'text-white'
          )}
        >
          <GameInfo game={game} />
        </div>
        <div className="p-3 rounded-lg h-full flex flex-col items-center">
          <Markets gameId={game.gameId} gameStatus={gameStatus} />
        </div>
      </div>
    </div>
  )
}

export default function Game() {
  const params = useParams()
  const { loading, game, isGameInLive } = useGame({
    gameId: params.id as string,
  })

  if (loading) {
    return <LoadingGameInfo />
  }

  if (!game) {
    return <GameInfoNotFound />
  }

  return <Content game={game} isGameInLive={isGameInLive} />
}
