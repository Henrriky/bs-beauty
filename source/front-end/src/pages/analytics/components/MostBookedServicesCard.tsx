import { Box, CircularProgress, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'
import { ChartBarIcon } from '@heroicons/react/24/outline'
import ChartContainer from './ChartContainer'
import type { MostBookedService } from '../../../store/reports/types'

interface MostBookedServicesCardProps {
  data?: MostBookedService[]
  isLoading?: boolean
}

export default function MostBookedServicesCard({
  data,
  isLoading,
}: MostBookedServicesCardProps) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 300,
          }}
        >
          <CircularProgress sx={{ color: '#A4978A' }} />
        </Box>
      )
    }

    if (!data || data.length === 0) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 300,
            gap: 2,
          }}
        >
          <ChartBarIcon style={{ width: 48, height: 48, color: '#666' }} />
          <Typography sx={{ color: '#999' }}>
            Nenhum dado disponível para o período selecionado
          </Typography>
        </Box>
      )
    }

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
          <ChartBarIcon style={{ width: 32, height: 32, color: '#A4978A' }} />
          <Box>
            <Typography sx={{ fontSize: 14, color: '#ccc', mb: 0.5 }}>
              Serviço Mais Agendado
            </Typography>
            <Typography
              sx={{ fontSize: 20, fontWeight: 700, color: '#A4978A' }}
            >
              {topService.serviceName}
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#999' }}>
              {topService.bookingCount} agendamento
              {topService.bookingCount !== 1 ? 's' : ''} • {topService.category}
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
            series={[
              {
                dataKey: 'bookingCount',
                label: 'Agendamentos',
                color: '#A4978A',
              },
            ]}
            height={350}
            margin={{ top: 20, right: 20, bottom: 80, left: 60 }}
          />
        </Box>
      </Box>
    )
  }

  return (
    <ChartContainer title="Serviços Mais Agendados">
      {renderContent()}
    </ChartContainer>
  )
}
