'use client'
import { useTheme } from '@/app/ThemeContext'
import { OutcomeButton } from '@/components/Button'
import { useAddEvent, useOrderBook } from '@/hooks'
import { InfoIcon } from '@/icons'
import { EVENT } from '@/utils'
import { BetType, usePrematchBets } from '@azuro-org/sdk'
import type { GameMarkets, MarketOutcome } from '@azuro-org/toolkit'
import clsx from 'clsx'
import { useCallback } from 'react'
import type { Address } from 'viem'
import { useAccount } from 'wagmi'

export type MarketProps = {
  name: string
  outcomes: MarketOutcome[]
  onSelectOutcome: (outcome: MarketOutcome) => void
  checkIsBetPlaced: (outcome: MarketOutcome) => boolean
  description: string
  className?: string
}

const Market: React.FC<Readonly<MarketProps>> = ({
  name,
  outcomes,
  onSelectOutcome,
  checkIsBetPlaced,
  description,
  className,
}) => {
  const conditionId = outcomes[0].conditionId

  const { totalAmount, refetchBets } = useOrderBook({
    conditionId,
    outcomes,
  })
  useAddEvent(EVENT.apolloGameMarkets, () => {
    refetchBets()
  })
  const { theme } = useTheme()

  return (
    <div
      className={clsx(
        theme === 'light'
          ? 'bg-gray-100 border border-blue-200 rounded-lg'
          : 'bg-gray-500 border border-blue-200 rounded-lg',
        className
      )}
    >
      <div className="flex items-center justify-between p-2">
        <span className="flex space-x-2 items-center">
          <span className="text-gray-800">{name}</span>
          <span className="cursor-pointer tooltip-container">
            <div className="tooltip-text text-wrap">
              {description || 'No description available for this event'}
            </div>
            <InfoIcon />
          </span>
        </span>
        <span className="text-[12px] text-appGray-600 font-normal ml-2">
          {totalAmount > 0 ? `$${totalAmount.toFixed(2)}` : '$0'}
        </span>
      </div>
      <div
        className={clsx(
          `flex gap-6 flex-row p-1 rounded-b-lg`,
          theme === 'dark'
            ? 'bg-[#343131]'
            : 'bg-white border border-gray-400 border-1'
        )}
      >
        {outcomes.map((outcome, index) => (
          <OutcomeButton
            index={index}
            key={outcome.outcomeId}
            text={outcome.selectionName}
            outcome={outcome}
            onSelectOutcome={() => onSelectOutcome(outcome)}
            isPlaced={checkIsBetPlaced(outcome)}
          />
        ))}
      </div>
      <div></div>
    </div>
  )
}

type GameMarketsProps = {
  markets: GameMarkets
  onSelectOutcome: (outcome: MarketOutcome) => void
}

export function GameMarkets(props: Readonly<GameMarketsProps>) {
  const { address } = useAccount()
  const { bets } = usePrematchBets({
    filter: {
      type: BetType.Accepted,
      bettor: address as Address,
    },
  })

  const { markets } = props

  const checkIsBetPlaced = useCallback(
    (outcome: MarketOutcome) => {
      if (bets.length === 0) {
        return false
      }

      return bets.some(
        (bet) =>
          bet.outcomes[0].outcomeId === outcome.outcomeId &&
          bet.outcomes[0].conditionId === outcome.conditionId
      )
    },
    [bets]
  )

  return (
    <div
      className={clsx(
        `grid sm:grid-cols-[minmax(200px,_500px)_minmax(200px,_500px)] grid-cols-[minmax(200px,_400px)] gap-x-12 gap-y-4`
      )}
    >
      {markets.map(({ name, outcomeRows, description }) => {
        return outcomeRows.map((outcomes) => (
          <Market
            key={`${name}-${outcomes[0].selectionName}`}
            name={name}
            outcomes={outcomes.map((outcome) => ({
              ...outcome,
              marketName: name,
            }))}
            onSelectOutcome={props.onSelectOutcome}
            checkIsBetPlaced={checkIsBetPlaced}
            description={description}
            className=""
          />
        ))
      })}
    </div>
  )
}
