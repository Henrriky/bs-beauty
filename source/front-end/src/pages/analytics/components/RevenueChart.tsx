import { LineChart } from '@mui/x-charts/LineChart'
import { GetRevenueEvolutionResponse } from '../../../store/reports/types'
import { commonChartStyles } from '../utils/chartStyles'
import LoadingPlaceholder from './LoadingPlaceholder'

interface RevenueChartProps {
  data: GetRevenueEvolutionResponse | undefined
}

function RevenueChart({ data }: RevenueChartProps) {
  if (!data) {
    return <LoadingPlaceholder />
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-gray-400">
        Nenhum dado disponível para o período selecionado
      </div>
    )
  }

  const dates = data.map((item) => {
    const date = new Date(item.date)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    })
  })

  const values = data.map((item) => item.totalValue)

  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  const padding = (maxValue - minValue) * 0.1

  return (
    <LineChart
      xAxis={[
        {
          scaleType: 'point',
          data: dates,
        },
      ]}
      yAxis={[
        {
          label: 'Faturamento (R$)',
          min: Math.max(0, minValue - padding),
          valueFormatter: (value: number) => `${(value / 1000).toFixed(1)}k`,
        },
      ]}
      series={[
        {
          data: values,
          label: 'Faturamento',
          color: '#A4978A',
          curve: 'catmullRom',
          showMark: true,
        },
      ]}
      height={350}
      sx={commonChartStyles}
    />
  )
}

export default RevenueChart
