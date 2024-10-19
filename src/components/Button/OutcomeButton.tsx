'use client'
import { BETS_AMOUNT_DECIMALS } from '@/constants'
import Icons from '@/icons'
import { compareOutcome, formatOdds } from '@/utils'
import {
  useBaseBetslip,
  useDetailedBetslip,
  useSelection,
} from '@azuro-org/sdk'
import { type MarketOutcome } from '@azuro-org/toolkit'
import clsx from 'clsx'
import { useMemo } from 'react'

export type OutcomeProps = {
  className?: string
  text: string
  outcome: MarketOutcome
  index: number
  onSelectOutcome: () => void
  isPlaced?: boolean
  textAbove?: boolean
}

export default function OutcomeButton(props: Readonly<OutcomeProps>) {
  const {
    className = '',
    text,
    outcome,
    index,
    onSelectOutcome,
    isPlaced = true,
  } = props

  const { addItem, items } = useBaseBetslip()
  const { changeBatchBetAmount } = useDetailedBetslip()
  const { odds, isLocked, isOddsFetching } = useSelection({
    selection: outcome,
    initialOdds: outcome.odds,
    initialStatus: outcome.status,
  })

  const formattedOdds = useMemo(() => {
    return odds ? formatOdds(odds) : odds
  }, [odds])

  const buttonClassName = clsx(
    `flex flex-col bg-white/70 transition rounded-3xl cursor-pointer w-full disabled:cursor-not-allowed disabled:opacity-50 ${className}`,
    {
      'bg-appGray-100': true,
    }
  )
  const priceClassName = clsx('font-medium rounded-full font-bold w-full', {
    'text-button-LightGreen': index === 0,
    'text-button-red': index === 1,
  })
  const handleClick = () => {
    if (!items.some((i) => compareOutcome(i, outcome))) {
      addItem(outcome)
      changeBatchBetAmount(outcome, BETS_AMOUNT_DECIMALS)
    }
    onSelectOutcome()
  }

  return (
    <div className="group p-[1px] rounded-3xl flex-1 relative">
      <button
        className={clsx([isPlaced && 'border-pink border'], buttonClassName, {
          'gradient-border-mask': !isPlaced,
        })}
        onClick={handleClick}
        disabled={isLocked}
      >
        {isPlaced && (
          <div className="absolute right-5 -top-4 rounded-full px-2 py-1 flex items-center bg-pink gap-1">
            <Icons name="judgeOutline" />
            <div>Bet placed</div>
          </div>
        )}
        <div className="flex justify-between w-full text-sm gap-2">
          {text && (
            <div>
              <div className="font-semibold">{text}</div>
            </div>
          )}
          <p className={priceClassName}>
            {isOddsFetching ? '--' : `${formattedOdds.toFixed(2)}¢`}
          </p>
        </div>
      </button>
    </div>
  )
}
