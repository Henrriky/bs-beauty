import { Box, Typography } from '@mui/material'
import { ClockIcon } from '@heroicons/react/24/outline'
import ChartContainer from './ChartContainer'
import { ReportCard } from './ReportCard'
import type { OccupancyRate } from '../../../store/reports/types'

interface OccupancyRateCardProps {
  data?: OccupancyRate
  isLoading?: boolean
}

export default function OccupancyRateCard({
  data,
  isLoading,
}: OccupancyRateCardProps) {
  const formatMinutesToHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return `${hours}h ${mins}min`
  }

  const renderContent = () => {
    if (!data) return null

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
          gap: 2,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: 14,
              color: '#A4978A',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: 1,
              mb: 1,
            }}
          >
            Taxa de Ocupação
          </Typography>
          <Typography
            sx={{
              fontSize: 48,
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1,
            }}
          >
            {data.occupancyRate.toFixed(1)}%
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            px: 3,
            py: 1.5,
            bgcolor: 'rgba(164, 151, 138, 0.1)',
            borderRadius: 2,
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
          >
            <Typography sx={{ fontSize: 14, color: '#ccc' }}>
              Tempo Ocupado:
            </Typography>
            <Typography
              sx={{ fontSize: 14, color: '#A4978A', fontWeight: 600 }}
            >
              {formatMinutesToHours(data.occupiedMinutes)}
            </Typography>
          </Box>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
          >
            <Typography sx={{ fontSize: 14, color: '#ccc' }}>
              Tempo Disponível:
            </Typography>
            <Typography
              sx={{ fontSize: 14, color: '#A4978A', fontWeight: 600 }}
            >
              {formatMinutesToHours(data.availableMinutes)}
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <ChartContainer title="Taxa de Ocupação do Salão">
      <ReportCard
        data={data}
        isLoading={isLoading}
        emptyIcon={<ClockIcon style={{ width: 48, height: 48, color: '#666' }} />}
        emptyMessage="Nenhum dado disponível para o período selecionado"
        minHeight={200}
      >
        {renderContent()}
      </ReportCard>
    </ChartContainer>
  )
}
