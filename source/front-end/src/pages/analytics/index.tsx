import { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/pt-br'
import Title from '../../components/texts/Title'
import Subtitle from '../../components/texts/Subtitle'
import { Professional } from '../../store/auth/types'
import { useDateRange } from './hooks/useDateRange'
import { useAnalyticsData } from './hooks/useAnalyticsData'
import { darkChartTheme } from './constants/theme'
import ReportFilters from './components/ReportFilters'
import ChartContainer from './components/ChartContainer'
import AppointmentsChart from './components/AppointmentsChart'
import EstimatedTimeChart from './components/EstimatedTimeChart'
import CancellationChart from './components/CancellationChart'
import RatingsChart from './components/RatingsChart'

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
        <header>
          <Title align="left">Relatórios de Produtividade</Title>
          <div className="flex flex-col mt-3 mb-6 max-w-[50%]">
            <Subtitle align="left">
              <b className="text-[#A4978A]">
                Visualize os dados de agendamentos e desempenho
              </b>
            </Subtitle>
            <div className="bg-[#595149] w-1/2 h-0.5 mt-2"></div>
          </div>
        </header>

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
