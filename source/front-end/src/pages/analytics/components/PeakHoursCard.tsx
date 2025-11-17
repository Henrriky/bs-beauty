import { Box, CircularProgress, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'
import { ClockIcon } from '@heroicons/react/24/outline'
import ChartContainer from './ChartContainer'
import type { PeakHour } from '../../../store/reports/types'

interface PeakHoursCardProps {
  data?: PeakHour[]
  isLoading?: boolean
}

export default function PeakHoursCard({ data, isLoading }: PeakHoursCardProps) {
  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`
  }

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
          <ClockIcon style={{ width: 48, height: 48, color: '#666' }} />
          <Typography sx={{ color: '#999' }}>
            Nenhum dado disponível para o período selecionado
          </Typography>
        </Box>
      )
    }

    const filteredData = data
      .filter((item) => item.appointmentCount > 0)
      .sort((a, b) => a.hour - b.hour)

    if (filteredData.length === 0) {
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
          <ClockIcon style={{ width: 48, height: 48, color: '#666' }} />
          <Typography sx={{ color: '#999' }}>
            Nenhum agendamento registrado no período selecionado
          </Typography>
        </Box>
      )
    }

    const topPeakHour = filteredData.reduce((prev, current) =>
      prev.appointmentCount > current.appointmentCount ? prev : current,
    )

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
          <ClockIcon style={{ width: 32, height: 32, color: '#A4978A' }} />
          <Box>
            <Typography sx={{ fontSize: 14, color: '#ccc', mb: 0.5 }}>
              Horário de Pico
            </Typography>
            <Typography
              sx={{ fontSize: 24, fontWeight: 700, color: '#A4978A' }}
            >
              {formatHour(topPeakHour.hour)}
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#999' }}>
              {topPeakHour.appointmentCount} agendamento
              {topPeakHour.appointmentCount !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <BarChart
            dataset={filteredData.map((item) => ({
              ...item,
              hourLabel: formatHour(item.hour),
            }))}
            xAxis={[
              {
                scaleType: 'band',
                dataKey: 'hour',
                valueFormatter: (value) => formatHour(value as number),
              },
            ]}
            series={[
              {
                dataKey: 'appointmentCount',
                label: 'Agendamentos',
                color: '#A4978A',
              },
            ]}
            height={300}
            margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
          />
        </Box>
      </Box>
    )
  }

  return (
    <ChartContainer title="Horários de Pico">{renderContent()}</ChartContainer>
  )
}
