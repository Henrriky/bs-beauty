import { Box, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import ChartContainer from './ChartContainer'
import { ReportCard } from './ReportCard'
import type { BusiestWeekday } from '../../../store/reports/types'

interface BusiestWeekdaysCardProps {
  data?: BusiestWeekday[]
  isLoading?: boolean
}

const weekdayTranslation: Record<string, string> = {
  SUNDAY: 'Domingo',
  MONDAY: 'Segunda',
  TUESDAY: 'Terça',
  WEDNESDAY: 'Quarta',
  THURSDAY: 'Quinta',
  FRIDAY: 'Sexta',
  SATURDAY: 'Sábado',
}

const weekdayOrder = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
]

export default function BusiestWeekdaysCard({
  data,
  isLoading,
}: BusiestWeekdaysCardProps) {
  const renderContent = () => {
    if (!data || data.length === 0) return null

    const sortedData = [...data].sort((a, b) => {
      return weekdayOrder.indexOf(a.weekDay) - weekdayOrder.indexOf(b.weekDay)
    })

    const filteredData = sortedData.filter((item) => item.appointmentCount > 0)

    if (filteredData.length === 0) {
      return null
    }

    const busiestDay = filteredData.reduce(
      (prev, current) =>
        prev.appointmentCount > current.appointmentCount ? prev : current,
      filteredData[0],
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
          <CalendarDaysIcon
            style={{ width: 32, height: 32, color: '#A4978A' }}
          />
          <Box>
            <Typography sx={{ fontSize: 14, color: '#ccc', mb: 0.5 }}>
              Dia Mais Movimentado
            </Typography>
            <Typography
              sx={{ fontSize: 24, fontWeight: 700, color: '#A4978A' }}
            >
              {weekdayTranslation[busiestDay.weekDay]}
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#999' }}>
              {busiestDay.appointmentCount} agendamento
              {busiestDay.appointmentCount !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <BarChart
            dataset={filteredData.map((item) => ({
              ...item,
              weekDayLabel: weekdayTranslation[item.weekDay],
            }))}
            xAxis={[
              {
                scaleType: 'band',
                dataKey: 'weekDay',
                valueFormatter: (value) =>
                  weekdayTranslation[value as string] || value,
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
    <ChartContainer title="Dias Mais Movimentados">
      <ReportCard
        data={data}
        isLoading={isLoading}
        emptyIcon={
          <CalendarDaysIcon style={{ width: 48, height: 48, color: '#666' }} />
        }
        emptyMessage="Nenhum agendamento registrado no período selecionado"
        minHeight={300}
      >
        {renderContent()}
      </ReportCard>
    </ChartContainer>
  )
}
