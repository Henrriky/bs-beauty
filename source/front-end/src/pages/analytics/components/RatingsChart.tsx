import { BarChart } from '@mui/x-charts/BarChart'
import { FetchRatingsCountResponse } from '../../../store/analytics/types'
import { calculateMeanRating } from '../utils/ratings'
import LoadingPlaceholder from './LoadingPlaceholder'

interface RatingsChartProps {
  data: FetchRatingsCountResponse | undefined
}

function RatingsChart({ data }: RatingsChartProps) {
  const meanRating = calculateMeanRating(data)

  if (!data) {
    return <LoadingPlaceholder />
  }

  return (
    <>
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-[#A4978A]">{meanRating} ★</div>
        <div className="text-sm text-[#979797]">Avaliação média</div>
      </div>
      <BarChart
        layout="horizontal"
        borderRadius={10}
        yAxis={[
          {
            scaleType: 'band',
            data: ['5 ★', '4 ★', '3 ★', '2 ★', '1 ★'],
            colorMap: {
              type: 'ordinal',
              colors: ['#A4978A'],
            },
            categoryGapRatio: 0.7,
            disableLine: true,
            disableTicks: true,
            barGapRatio: 40,
            tickLabelStyle: {
              fontSize: 14,
              fill: '#D9D9D9',
            },
          },
        ]}
        xAxis={[
          {
            disableLine: true,
            disableTicks: true,
            valueFormatter: () => '',
          },
        ]}
        series={[
          {
            data: [data[5], data[4], data[3], data[2], data[1]],
            label: 'Quantidade de Avaliações',
            color: '#A4978A',
          },
        ]}
        height={300}
      />
    </>
  )
}

export default RatingsChart
