'use client'
import { MyBetFilterNotFound, MyBetNotFound } from '@/components/NotFound'
import { returnTypeOfBet } from '@/utils'
import type { ApolloError } from '@apollo/client'
import { Bet, BetType } from '@azuro-org/sdk'
import { useMemo, useState } from 'react'
import { SkeletonArray } from '../Skeleton'
import Tabs from '../Tabs'
import WrapBetCard from './WrapBetCard'

type MyBetsProps = {
  tabs: {
    name: string
    type: BetType
    count: number
  }[]
  prematchBets: {
    loading: boolean
    bets: Bet[]
    error: ApolloError | undefined
  }
}

export default function MyBets({ tabs, prematchBets }: Readonly<MyBetsProps>) {
  const [value, setValue] = useState(0)

  const filterBets = useMemo(() => {
    const _bets = prematchBets?.bets
    const _data = _bets?.filter(
      (bet) => returnTypeOfBet(bet) === tabs[value].type
    )
    return {
      bets: _data?.toSorted((prev, curr) => curr.createdAt - prev.createdAt),
    }
  }, [prematchBets?.bets, tabs, value])

  const showNoData = useMemo(
    () => !prematchBets?.loading && !prematchBets?.bets?.length,
    [prematchBets?.bets.length, prematchBets?.loading]
  )

  return (
    <>
      <div>
        {Boolean(prematchBets?.bets?.length) && (
          <Tabs items={tabs} value={value} onClick={setValue} />
        )}
      </div>
      <div className="flex-1 overflow-auto">
        {filterBets?.bets?.map((bet) => (
          <WrapBetCard key={bet.txHash} bet={bet} status={tabs[value].type} />
        ))}
        {prematchBets?.loading && (
          <SkeletonArray length={3} className="mb-5 w-full h-[150px]" />
        )}
        {showNoData ? (
          <MyBetNotFound />
        ) : (
          <>
            {!prematchBets?.loading && filterBets.bets.length === 0 && (
              <MyBetFilterNotFound />
            )}
          </>
        )}
      </div>
    </>
  )
}
