import { Box, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'
import { CurrencyDollarIcon } from '@heroicons/react/24/outline'
import ChartContainer from './ChartContainer'
import { ReportCard } from './ReportCard'
import type { MostProfitableService } from '../../../store/reports/types'

interface MostProfitableServicesCardProps {
  data?: MostProfitableService[]
  isLoading?: boolean
}

export default function MostProfitableServicesCard({
  data,
  isLoading,
}: MostProfitableServicesCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const renderContent = () => {
    if (!data || data.length === 0) return null

    const topServices = data.slice(0, 10)
    const topService = topServices[0]

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            p: 2,
            bgcolor: 'rgba(164, 151, 138, 0.1)',
            borderRadius: 2,
          }}
        >
          <CurrencyDollarIcon
            style={{ width: 32, height: 32, color: '#A4978A' }}
          />
          <Box>
            <Typography sx={{ fontSize: 14, color: '#ccc', mb: 0.5 }}>
              Serviço Mais Lucrativo
            </Typography>
            <Typography
              sx={{ fontSize: 20, fontWeight: 700, color: '#A4978A' }}
            >
              {topService.serviceName}
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#999' }}>
              {formatCurrency(topService.totalRevenue)} • {topService.category}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <BarChart
            dataset={topServices.map((item) => ({
              ...item,
              displayName: item.serviceName,
            }))}
            xAxis={[
              {
                scaleType: 'band',
                dataKey: 'serviceName',
                valueFormatter: (value) => value as string,
              },
            ]}
            yAxis={[
              {
                valueFormatter: (value: number | Date | null) =>
                  formatCurrency(value as number),
              },
            ]}
            series={[
              {
                dataKey: 'totalRevenue',
                label: 'Faturamento',
                color: '#A4978A',
                valueFormatter: (value) =>
                  value ? formatCurrency(value as number) : '',
              },
            ]}
            height={350}
            margin={{ top: 20, right: 20, bottom: 80, left: 80 }}
          />
        </Box>
      </Box>
    )
  }

  return (
    <ChartContainer title="Serviços Mais Lucrativos">
      <ReportCard
        data={data}
        isLoading={isLoading}
        emptyIcon={
          <CurrencyDollarIcon
            style={{ width: 48, height: 48, color: '#666' }}
          />
        }
        emptyMessage="Nenhum dado disponível para o período selecionado"
        minHeight={300}
      >
        {renderContent()}
      </ReportCard>
    </ChartContainer>
  )
}
