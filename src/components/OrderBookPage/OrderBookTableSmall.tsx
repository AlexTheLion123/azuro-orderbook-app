import { useTheme } from '@/app/ThemeContext'
import { CustomMarketOutcome } from '@/contexts'
import { useFixDisableReason, useGameMarkets, useOrderBookV2 } from '@/hooks'
import { formatOdds } from '@/utils'
import { useDetailedBetslip, useGame } from '@azuro-org/sdk'
import { MarketOutcome, getGameStatus } from '@azuro-org/toolkit'
import clsx from 'clsx'
import Loader from '../Loader'

type OrderBookTableSmallProps = {
  outcomeSelected: MarketOutcome | CustomMarketOutcome
  game: NonNullable<ReturnType<typeof useGame>['game']>
  isGameInLive: boolean
}

export default function OrderBookTableSmall({
  game,
  isGameInLive,
  outcomeSelected,
}: OrderBookTableSmallProps) {
  const { changeBatchBetAmount } = useDetailedBetslip()

  const { loading, markets } = useGameMarkets({
    gameId: game.gameId,
    gameStatus: getGameStatus({
      graphStatus: game.status,
      startsAt: Number(game.startsAt),
      isGameInLive: isGameInLive,
    }),
  })

  useFixDisableReason(outcomeSelected)

  const { data: bets, isFetching } = useOrderBookV2({
    conditionId: outcomeSelected.conditionId,
    outcomeId: outcomeSelected.outcomeId,
  })
  const { theme } = useTheme()

  return (
    <>
      <div className="grid xl:grid-cols-2 grid-cols-1">
        {bets && !!bets?.length ? (
          bets.map(({ betAmount, odds }, index) => {
            if (isFetching || loading) {
              return <Loader key={index} />
            } else {
              return (
                <div
                  key={index}
                  className={clsx(
                    'cursor-pointer rounded-lg grid grid-cols-2 p-0.5 text-light px-3',
                    theme === 'dark'
                      ? 'hover:bg-slate-500'
                      : 'hover:bg-slate-200'
                  )}
                  onClick={() => {
                    changeBatchBetAmount(outcomeSelected, betAmount)
                  }}
                >
                  <span
                    className={clsx(
                      theme === 'light' ? 'text-[#1f842a]' : 'text-[#54D09E]'
                    )}
                  >
                    {`${formatOdds(odds).toFixed(2)}¢`}
                  </span>
                  <span className="">
                    $
                    {Number(parseFloat(betAmount).toFixed(2)).toLocaleString(
                      'en'
                    )}
                  </span>
                </div>
              )
            }
          })
        ) : (
          <div className={clsx('h-7')}>No orderbook data</div>
        )}
      </div>
    </>
  )
}
