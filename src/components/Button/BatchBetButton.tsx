'use client'
import {
  dispatchEvent,
  openBetSuccessNoti,
  showNotification,
} from '@/components/Noti'
import { ExploreContext } from '@/contexts'
import { EVENT } from '@/utils'
import {
  useBaseBetslip,
  useBetTokenBalance,
  useChain,
  useDetailedBetslip,
  usePrepareBet,
} from '@azuro-org/sdk'
import clsx from 'clsx'
import { useContext, useEffect, useMemo } from 'react'
import type { Address } from 'viem'
import classes from './styles/BetButton.module.css'

export type BetButtonProps = {
  totalBetAmount: number
  setIsLoading?: (isLoading: boolean) => void
}

const BatchBetButton = (props: Readonly<BetButtonProps>) => {
  const { setIsLoading, totalBetAmount } = props
  const { appChain, isRightNetwork } = useChain()
  const { items, removeItem } = useBaseBetslip()

  // const { outcomeSelected, setOutcomeSelected } = useContext(ExploreContext)
  const { setOutcomeSelected } = useContext(ExploreContext)

  const {
    batchBetAmounts,
    odds,
    totalOdds,
    maxBet,
    minBet,
    selectedFreeBet,
    freeBets,
    statuses,
    disableReason,
    changeBetAmount,
    changeBatchBetAmount,
    changeBatch,
    selectFreeBet,
    isLiveBet,
    isBatch,
    isStatusesFetching,
    isOddsFetching,
    isFreeBetsFetching,
    isBetAllowed,
  } = useDetailedBetslip()
  const { loading: isBalanceFetching, balance } = useBetTokenBalance()

  const data = useMemo(
    () => ({
      betAmount: String(totalBetAmount),
      slippage: 10,
      affiliate: process.env.NEXT_PUBLIC_AFFILIATE_ADDRESS as Address,
      selections: items,
      odds: odds,
      totalOdds,
      onSuccess: () => {
        if (!items) return
        openBetSuccessNoti({
          sportId: 1,
          title1: 'hi',
          title2: 'sigh',
          title3: 'bye',
          betNumber: 'why',
        })
        dispatchEvent(EVENT.apolloBetslip, {})
        dispatchEvent(EVENT.apolloGameMarkets, {})
        setOutcomeSelected(null)
        items.map((item) => removeItem(item))
      },
      onError: () => {
        showNotification({
          status: 'error',
          title: 'Bet Failed',
          description:
            'Your bet has not been placed successfully. Please try again.',
        })
      },
    }),
    [batchBetAmounts, totalOdds, removeItem]
  )

  const {
    submit,
    approveTx,
    betTx,
    isRelayerFeeLoading,
    isAllowanceLoading,
    isApproveRequired,
  } = usePrepareBet(data)

  const isPending = useMemo(
    () => approveTx.isPending || betTx.isPending,
    [approveTx, betTx]
  )
  const isProcessing = useMemo(
    () => approveTx.isProcessing || betTx.isProcessing,
    [approveTx, betTx]
  )

  useEffect(() => {
    setIsLoading?.(isProcessing || isPending)
  }, [isProcessing, isPending, setIsLoading])

  const isEnoughBalance = useMemo(() => {
    if (isBalanceFetching || !+totalBetAmount) return true
    return +balance! > +totalBetAmount
  }, [isBalanceFetching, balance, totalBetAmount])

  const isLoading = useMemo(
    () =>
      isOddsFetching ||
      isBalanceFetching ||
      isStatusesFetching ||
      isAllowanceLoading ||
      isPending ||
      isProcessing ||
      isRelayerFeeLoading,
    [
      isOddsFetching,
      isBalanceFetching,
      isStatusesFetching,
      isAllowanceLoading,
      isPending,
      isProcessing,
      isRelayerFeeLoading,
    ]
  )

  const isDisabled = useMemo(
    () =>
      isLoading ||
      !isBetAllowed ||
      !isEnoughBalance ||
      Number(totalBetAmount) <= 0,
    [isLoading, isBetAllowed, isEnoughBalance, totalBetAmount]
  )

  const title = useMemo(() => {
    if (isPending) return 'Waiting for approval'
    if (isProcessing) return 'Processing...'
    if (isLoading) return 'Loading...'
    if (isApproveRequired) return 'Approve'
    return 'Place Bet'
  }, [isPending, isProcessing, isLoading, isApproveRequired])

  if (!isRightNetwork) {
    return (
      <div className="mt-6 p-4 text-center text-sm bg-gradient-to-r from-blue-300 to-blue-400 rounded-2xl">
        Switch network to <b>{appChain.name}</b>
      </div>
    )
  }

  return (
    <div className="my-1">
      {!isEnoughBalance && (
        <div className="text-red-500 text-center font-semibold">
          Not enough balance.
        </div>
      )}
      <button
        className={clsx(
          'w-full py-5 text-white font-semibold text-center rounded-xl transition',
          {
            [classes['bet-button-gradient']]: true,
            'opacity-50 cursor-not-allowed': isDisabled,
          }
        )}
        disabled={isDisabled}
        onClick={submit}
      >
        {title}
      </button>
    </div>
  )
}

export default BatchBetButton
