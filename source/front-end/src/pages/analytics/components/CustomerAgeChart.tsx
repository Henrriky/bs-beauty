import { BarChart } from '@mui/x-charts/BarChart'
import { GetCustomerAgeDistributionResponse } from '../../../store/reports/types'
import { commonChartStyles } from '../utils/chartStyles'
import LoadingPlaceholder from './LoadingPlaceholder'

interface CustomerAgeChartProps {
  data: GetCustomerAgeDistributionResponse | undefined
}

function CustomerAgeChart({ data }: CustomerAgeChartProps) {
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

  const ageRanges = data.map((item) => item.ageRange)
  const counts = data.map((item) => item.count)

  return (
    <BarChart
      yAxis={[
        {
          scaleType: 'band',
          data: ageRanges,
          label: 'Faixa Etária',
        },
      ]}
      xAxis={[
        {
          label: 'Quantidade de Clientes',
          min: 0,
          tickMinStep: 1,
        },
      ]}
      series={[
        {
          data: counts,
          label: 'Clientes',
          color: '#A4978A',
        },
      ]}
      layout="horizontal"
      height={350}
      sx={commonChartStyles}
    />
  )
}

export default CustomerAgeChart
