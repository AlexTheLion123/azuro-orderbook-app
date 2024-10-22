'use client'
import { BetButton } from '@/components/Button'
import Skeleton from '@/components/Skeleton'
import { ExploreContext } from '@/contexts'
import { useAddEvent, useBetslip } from '@/hooks'
import { EVENT, compareOutcome, formatNumber, formatOdds } from '@/utils'
import { useQuery as useQueryApollo } from '@apollo/client'
import {
  useApolloClients,
  useBaseBetslip,
  useBetTokenBalance,
  useDetailedBetslip,
  useLiveBetFee,
} from '@azuro-org/sdk'
import type { MarketOutcome } from '@azuro-org/toolkit'
import { PrematchBetsDocument } from '@azuro-org/toolkit'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { use, useContext, useState } from 'react'
import { useAccount } from 'wagmi'
import Loader from '../Loader'
import BetslipCard from './BetslipCard'
import { errorPerDisableReason } from './errors'

export type BetslipContentProps = {
  outcomeRowSelected?: MarketOutcome[]
  isFetching?: boolean
}

export function BetslipContent({
  outcomeRowSelected,
  isFetching,
}: Readonly<BetslipContentProps>) {
  const account = useAccount()
  const { items, removeItem } = useBaseBetslip()
  const {
    batchBetAmounts,
    odds,
    statuses,
    disableReason,
    isStatusesFetching,
    isOddsFetching,
    isLiveBet,
    changeBatchBetAmount,
  } = useDetailedBetslip()
  const { betTokenSymbol } = use(ExploreContext)
  const [isLoading, setIsLoading] = useState(false)

  const isLoadingBet = isLoading

  const { formattedRelayerFeeAmount, loading: isRelayerFeeLoading } =
    useLiveBetFee({
      enabled: isLiveBet,
    })
  const { outcomeSelected } = useContext(ExploreContext)
  const key = `${outcomeSelected?.conditionId}-${outcomeSelected?.outcomeId}`
  const betAmount = batchBetAmounts[key] || '0'
  let totalOdds = odds[key] || 0
  const _originalOdds = totalOdds
  totalOdds = formatOdds(totalOdds)
  const { loading: isBalanceFetching, balance } = useBetTokenBalance()

  const { openConnectModal } = useConnectModal()

  const _outcomeRowSelected =
    outcomeSelected &&
    items.find((item) => compareOutcome(item, outcomeSelected))
  const { prematchClient } = useApolloClients()

  const {
    game: { gameId },
    conditionId,
    outcomeId,
  } = _outcomeRowSelected ?? {
    game: { gameId: '', sportId: '' },
    conditionId: '',
    outcomeId: '',
  }

  const { data: betsData, refetch } = useQueryApollo(PrematchBetsDocument, {
    variables: {
      where: {
        _conditions_: { conditionId },
      },
      first: 1000,
    },
    client: prematchClient,
  })

  useAddEvent(EVENT.apolloBetslip, refetch)

  if (!_outcomeRowSelected) return null

  return (
    <div className="col-span-12 sm:col-span-4 p-4 mb-4 rounded-md w-full max-h-[90vh] overflow-auto ">
      {items.length ? (
        <>
          <BetslipCard
            key={`${gameId}-${conditionId}-${outcomeId}`}
            item={_outcomeRowSelected}
            status={statuses[conditionId]}
            odds={odds?.[`${conditionId}-${outcomeId}`]}
            isStatusesFetching={isStatusesFetching}
            onRemove={() => removeItem(_outcomeRowSelected)}
            outcomeRowSelected={outcomeRowSelected}
            betsData={betsData}
          />

          <div className="flex items-center mt-4 mb-2">
            <div className="flex-1">Bet Amount</div>
            {isBalanceFetching ? (
              <Loader />
            ) : (
              balance !== undefined && (
                <div className="px-2 bg-appGray-50 py-1 rounded-xl">
                  Wallet balance: {formatNumber(+balance, 2)} {betTokenSymbol}
                </div>
              )
            )}
          </div>
          <div className="flex mt-2 px-2 py-2 items-center justify-between border-appGray-100 border rounded-lg h-[56px]">
            <input
              type="number"
              className="text-[#B58EEA] bg-transparent border-none outline-none focus:ring-0 resize-none w-full text-right px-2 input-no-arrow"
              value={batchBetAmounts[`${conditionId}-${outcomeId}`]}
              onChange={(event) => {
                if (event.target.value.length > 16) {
                  return
                }
                changeBatchBetAmount(
                  _outcomeRowSelected,
                  Number(event.target.value) < 0 ? '0' : event.target.value
                )
              }}
              max={16}
              placeholder="Enter Bet amount"
              disabled={isLoadingBet}
            />
            <p>{betTokenSymbol}</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-md text-white text-opacity-80">Price:</span>
            <span className="text-md font-semibold">
              {isOddsFetching || isFetching ? (
                <Skeleton className="!w-[50px] !h-[21px]" />
              ) : (
                <>{+betAmount <= 0 ? 0 : totalOdds.toFixed(2)}¢</>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-md text-white text-opacity-80">
              Possible win:
            </span>
            <span className="text-md font-semibold text-[#54D09E]">
              {isOddsFetching || isFetching ? (
                <Skeleton className="!w-[50px] !h-[21px]" />
              ) : (
                <>
                  {Number(betAmount) < 0 ? (
                    <>0 {betTokenSymbol}</>
                  ) : (
                    <>
                      {(+betAmount * _originalOdds || 0).toFixed(2)}{' '}
                      {betTokenSymbol}
                    </>
                  )}
                </>
              )}
            </span>
          </div>

          {Boolean(isRelayerFeeLoading || formattedRelayerFeeAmount) && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-md ">Relayer fee:</span>
              <span className="text-md font-semibold">
                {isRelayerFeeLoading ? (
                  <Loader />
                ) : (
                  <>{formattedRelayerFeeAmount}</>
                )}
              </span>
            </div>
          )}
          {Boolean(disableReason) && (
            <div className="mb-1 text-red-500 text-center font-semibold">
              {errorPerDisableReason[disableReason!]}
            </div>
          )}
          {account?.address ? (
            <BetButton setIsLoading={setIsLoading} />
          ) : (
            <button
              onClick={openConnectModal}
              className="mt-6 py-3.5 text-center rounded-xl bg-primary w-full font-bold"
            >
              Connect Wallet
            </button>
          )}
        </>
      ) : (
        <div>Empty</div>
      )}
    </div>
  )
}

export default function Betslip() {
  const { isOpen, toggleOpen } = useBetslip()
  const { items } = useBaseBetslip()

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-full md:max-w-sm">
      {isOpen && <BetslipContent />}
      <button
        className="flex items-center py-2 px-4 bg-black whitespace-nowrap rounded-full ml-auto"
        onClick={toggleOpen}
      >
        Betslip {items.length || ''}
      </button>
    </div>
  )
}
