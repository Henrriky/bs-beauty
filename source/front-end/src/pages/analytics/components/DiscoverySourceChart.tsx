import { PieChart } from '@mui/x-charts/PieChart'
import {
  GetDiscoverySourceCountResponse,
  DiscoverySource,
} from '../../../store/reports/types'
import { commonChartStyles } from '../utils/chartStyles'
import LoadingPlaceholder from './LoadingPlaceholder'

interface DiscoverySourceChartProps {
  data: GetDiscoverySourceCountResponse | undefined
}

const sourceLabels: Record<DiscoverySource, string> = {
  [DiscoverySource.REFERRAL]: 'Indicação',
  [DiscoverySource.INSTAGRAM]: 'Instagram',
  [DiscoverySource.FACEBOOK]: 'Facebook',
  [DiscoverySource.TIKTOK]: 'TikTok',
  [DiscoverySource.GOOGLE]: 'Google',
  [DiscoverySource.WHATSAPP]: 'WhatsApp',
  [DiscoverySource.WALK_IN]: 'Presencial',
  [DiscoverySource.OTHER]: 'Outros',
}

function DiscoverySourceChart({ data }: DiscoverySourceChartProps) {
  if (!data) {
    return <LoadingPlaceholder />
  }

  const filteredData = data.filter((item) => item.count > 0)
  const total = filteredData.reduce((sum, item) => sum + item.count, 0)

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-gray-400">
        Nenhum dado disponível para o período selecionado
      </div>
    )
  }

  const chartData = filteredData.map((item, index) => ({
    id: index,
    value: item.count,
    label: item.source ? sourceLabels[item.source] : 'Não informado',
  }))

  const colors = [
    '#A4978A',
    '#8B7F73',
    '#72675C',
    '#594F45',
    '#B5A99C',
    '#C6BBB0',
    '#D7CDC4',
    '#9A8E82',
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredData.map((item, index) => {
          const percentage = ((item.count / total) * 100).toFixed(1)
          const label = item.source
            ? sourceLabels[item.source]
            : 'Não informado'

          return (
            <div
              key={item.source || 'null'}
              className="flex items-center gap-3 p-3 bg-[#2A2A2A] rounded-lg"
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-300 truncate">{label}</div>
                <div className="text-lg font-semibold text-[#A4978A]">
                  {percentage}%
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-center">
        <PieChart
          series={[
            {
              data: chartData,
              innerRadius: 80,
              outerRadius: 140,
              paddingAngle: 2,
              cornerRadius: 4,
              highlightScope: { fade: 'global', highlight: 'item' },
              faded: { innerRadius: 70, additionalRadius: -10, color: 'gray' },
            },
          ]}
          colors={colors}
          height={350}
          width={500}
          sx={{
            ...commonChartStyles,
            '& .MuiChartsLegend-root': {
              display: 'none',
            },
          }}
        />
      </div>
    </div>
  )
}

export default DiscoverySourceChart
