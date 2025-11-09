import { ThemeProvider } from '@mui/material/styles'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/pt-br'
import { useState } from 'react'
import { PageHeader } from '../../layouts/PageHeader'
import { Professional } from '../../store/auth/types'
import AppointmentsChart from './components/AppointmentsChart'
import CancellationChart from './components/CancellationChart'
import ChartContainer from './components/ChartContainer'
import EstimatedTimeChart from './components/EstimatedTimeChart'
import RatingsChart from './components/RatingsChart'
import ReportFilters from './components/ReportFilters'
import { darkChartTheme } from './constants/theme'
import { useAnalyticsData } from './hooks/useAnalyticsData'
import { useDateRange } from './hooks/useDateRange'

dayjs.locale('pt-br')

function ProductivityReport() {
  const { defaultDates } = useDateRange()

  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs(defaultDates.startDate),
  )
  const [endDate, setEndDate] = useState<Dayjs | null>(
    dayjs(defaultDates.endDate),
  )
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const activeProfessionalId = selectedProfessional?.id || undefined

  const {
    userType,
    professionalsData,
    appointmentsCountData,
    estimatedTimeData,
    cancelationData,
    ratingsCountData,
  } = useAnalyticsData(
    startDate,
    endDate,
    selectedStatuses,
    activeProfessionalId,
  )

  return (
    <ThemeProvider theme={darkChartTheme}>
      <div className="h-full flex flex-col">
        <PageHeader
          title="Relatórios de Produtividade"
          subtitle={
            <>
              Visualize os dados de{' '}
              <b className="text-[#A4978A]">agendamentos</b> e{' '}
              <b className="text-[#A4978A]">desempenho</b>
            </>
          }
        />

        <ReportFilters
          startDate={startDate}
          endDate={endDate}
          selectedStatuses={selectedStatuses}
          selectedProfessional={selectedProfessional}
          professionals={professionalsData?.data || []}
          userType={userType}
          filtersOpen={filtersOpen}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onStatusesChange={setSelectedStatuses}
          onProfessionalChange={setSelectedProfessional}
          onToggleFilters={() => setFiltersOpen(!filtersOpen)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartContainer title="Quantidade de Agendamentos">
            <AppointmentsChart data={appointmentsCountData} />
          </ChartContainer>

          <ChartContainer title="Tempo Estimado de Trabalho">
            <EstimatedTimeChart data={estimatedTimeData} />
          </ChartContainer>

          <ChartContainer title="Taxa de Cancelamento">
            <CancellationChart data={cancelationData} />
          </ChartContainer>

          <ChartContainer title="Avaliações dos Clientes no Período">
            <RatingsChart data={ratingsCountData} />
          </ChartContainer>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default ProductivityReport
