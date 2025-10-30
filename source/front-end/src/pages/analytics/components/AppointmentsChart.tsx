import { LineChart } from '@mui/x-charts/LineChart'
import { FetchAppointmentsCountResponse } from '../../../store/analytics/types'
import { useChartData } from '../hooks/useChartData'
import { commonChartStyles } from '../utils/chartStyles'
import LoadingPlaceholder from './LoadingPlaceholder'

interface AppointmentsChartProps {
  data: FetchAppointmentsCountResponse | undefined
}

function AppointmentsChart({ data }: AppointmentsChartProps) {
  const chartData = useChartData(data, 'count')

  if (!data) {
    return <LoadingPlaceholder />
  }

  return (
    <LineChart
      yAxis={[
        {
          min: 0,
          tickMinStep: 1,
        },
      ]}
      xAxis={[
        {
          scaleType: 'point',
          data: chartData.dates,
        },
      ]}
      series={[
        {
          data: chartData.values,
          label: 'Agendamentos',
          color: '#A4978A',
          curve: 'natural',
        },
      ]}
      height={350}
      sx={commonChartStyles}
    />
  )
}

export default AppointmentsChart
