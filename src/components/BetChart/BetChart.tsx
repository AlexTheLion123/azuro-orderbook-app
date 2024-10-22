import { CustomMarketOutcome, ExploreContext } from '@/contexts'
import envioClient from '@/providers/ApolloEnvioProvider'
import { gql, useQuery } from '@apollo/client'
import { ODDS_DECIMALS } from '@azuro-org/toolkit'
import { useContext } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Loader from '../Loader'

const oddsQuery = gql`
  query MyQuery($conditionId: numeric) {
    PrematchCore_OddsChanged(where: { conditionId: { _eq: $conditionId } }) {
      newOdds
      conditionId
      blockTimestamp
    }
  }
`

type outcomeSelected = 0 | 1

export default function BetChart({
  conditionId,
}: {
  conditionId: string | undefined
}) {
  const { outcomeSelected } = useContext(ExploreContext) as {
    outcomeSelected: CustomMarketOutcome
  }

  const outcomeNum =
    '_outcomeSelected' in outcomeSelected ? outcomeSelected._outcomeSelected : 0

  const {
    loading,
    error,
    data: _data,
  } = useQuery(oddsQuery, {
    client: envioClient,
    variables: { conditionId: conditionId },
  })

  if (loading) return <Loader />
  if (error) return <p>Error: {error.message}</p>

  const data = _data.PrematchCore_OddsChanged.map(
    (item: { blockTimestamp: number; newOdds: number[] }) => {
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
      }
      return {
        blockTimestamp: new Date(item.blockTimestamp * 1000).toLocaleDateString(
          'en-US',
          options
        ),
        odds: (item.newOdds[outcomeNum] / 10 ** ODDS_DECIMALS).toFixed(2),
      }
    }
  )

  const color = outcomeNum === 0 ? '#26913b' : '#d32f2f'

  if (data.length > 0) {
    return (
      <ResponsiveContainer width="100%" height={200}>
        {/* <LineChart data={data} margin={{ top: 0, left: -25, right: 0, bottom: 0 }}>
      <Line type="monotone" dataKey="odds" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="blockTimestamp" />
      <YAxis />
    </LineChart> */}
        <AreaChart
          data={data}
          margin={{ top: 0, left: -30, right: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={`${color}`} stopOpacity={0.8} />
              <stop offset="95%" stopColor={`${color}`} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip contentStyle={{ backgroundColor: '#212129' }} />
          <XAxis dataKey="blockTimestamp" />
          <YAxis />
          <Area
            type="monotone"
            dataKey="odds"
            stroke={`${color}`}
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    )
  } else {
    return <p className="h-full w-full">No chart data for this outcome</p>
  }
}
