import { PieChart } from '@mui/x-charts/PieChart'
import { FetchCancelationRateResponse } from '../../../store/analytics/types'
import { useCancellationData } from '../hooks/useChartData'
import LoadingPlaceholder from './LoadingPlaceholder'

interface CancellationChartProps {
  data: FetchCancelationRateResponse | undefined
}

function CancellationChart({ data }: CancellationChartProps) {
  const { chartData, cancellationPercentage, activePercentage } =
    useCancellationData(data)

  if (!data) {
    return <LoadingPlaceholder />
  }

  return (
    <>
      <div className="flex flex-col mb-4">
        <div className="text-center">
          <div className="text-[#979797] mb-3 text-center">Percentuais</div>
          <div className="flex flex-row gap-3 justify-center">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#A4978A]"></div>
              <span className="text-base font-medium text-[#D9D9D9]">
                Ativos: {activePercentage}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#CC3636]"></div>
              <span className="text-base font-medium text-[#D9D9D9]">
                Cancelados: {cancellationPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[350px] flex justify-center items-center">
        <PieChart
          series={[
            {
              data: chartData,
              highlightScope: { fade: 'global', highlight: 'item' },
              innerRadius: '60%',
              outerRadius: '90%',
            },
          ]}
          height={300}
          sx={{
            '& .MuiChartsLegend-root': {
              display: 'none !important',
            },
            '& text': {
              fill: '#D9D9D9 !important',
            },
          }}
        />
      </div>
    </>
  )
}

export default CancellationChart
