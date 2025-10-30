import { BarChart } from '@mui/x-charts/BarChart'
import { FetchEstimatedTimeResponse } from '../../../store/analytics/types'
import { useChartData, useTotalWorkTime } from '../hooks/useChartData'
import { commonChartStyles } from '../utils/chartStyles'
import LoadingPlaceholder from './LoadingPlaceholder'

interface EstimatedTimeChartProps {
  data: FetchEstimatedTimeResponse | undefined
}

function EstimatedTimeChart({ data }: EstimatedTimeChartProps) {
  const chartData = useChartData(data, 'time')
  const workTimeInHours = useTotalWorkTime(data)

  if (!data) {
    return <LoadingPlaceholder />
  }

  return (
    <>
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-[#A4978A]">
          {workTimeInHours} horas
        </div>
        <div className="text-sm text-[#979797]">
          Total no período selecionado
        </div>
      </div>
      <BarChart
        xAxis={[
          {
            scaleType: 'band',
            data: chartData.dates,
            colorMap: {
              type: 'ordinal',
              colors: ['#926941'],
            },
          },
        ]}
        series={[
          {
            data: chartData.values,
            label: 'Horas Estimadas',
            color: '#926941',
          },
        ]}
        height={300}
        sx={commonChartStyles}
      />
    </>
  )
}

export default EstimatedTimeChart
