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
import DiscoverySourceChart from './components/DiscoverySourceChart'
import CustomerAgeChart from './components/CustomerAgeChart'
import RevenueChart from './components/RevenueChart'
import TotalRevenueCard from './components/TotalRevenueCard'
import { SwitchButton } from '../../components/button/SwitchButton'
import { SwitchButtonValues } from './types'

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

  const [switchValue, setSwitchValue] =
    useState<SwitchButtonValues>('productivity')
  const activeProfessionalId = selectedProfessional?.id || undefined

  const {
    userType,
    professionalsData,
    appointmentsCountData,
    estimatedTimeData,
    cancelationData,
    ratingsCountData,
    discoverySourceData,
    customerAgeData,
    revenueData,
    totalRevenueData,
    isTotalRevenueLoading,
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

        <SwitchButton
          value={switchValue}
          onChange={setSwitchValue}
          options={[
            { value: 'productivity', label: 'Produtividade' },
            { value: 'financial', label: 'Financeiro' },
            { value: 'customer', label: 'Clientes' },
            { value: 'occupancy', label: 'Ocupação' },
          ]}
          className="mb-6"
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
          selectedReportType={switchValue}
        />

        {switchValue === 'productivity' && (
          <div className="flex flex-col gap-6">
            <ChartContainer title="Quantidade de Agendamentos">
              <AppointmentsChart data={appointmentsCountData} />
            </ChartContainer>

            <div className="flex flex-col gap-6">
              <ChartContainer title="Tempo Estimado de Trabalho">
                <EstimatedTimeChart data={estimatedTimeData} />
              </ChartContainer>

              <ChartContainer title="Taxa de Cancelamento">
                <CancellationChart data={cancelationData} />
              </ChartContainer>
            </div>

            <ChartContainer title="Avaliações dos Clientes no Período">
              <RatingsChart data={ratingsCountData} />
            </ChartContainer>
          </div>
        )}

        {switchValue === 'customer' && (
          <div className="flex flex-col gap-6">
            <ChartContainer title="Fontes de Captação de Clientes">
              <DiscoverySourceChart data={discoverySourceData} />
            </ChartContainer>

            <ChartContainer title="Distribuição de Idade dos Clientes">
              <CustomerAgeChart data={customerAgeData} />
            </ChartContainer>
          </div>
        )}

        {switchValue === 'financial' && (
          <div className="flex flex-col gap-6">
            <TotalRevenueCard
              data={totalRevenueData}
              isLoading={isTotalRevenueLoading}
            />

            <ChartContainer title="Evolução do Faturamento">
              <RevenueChart data={revenueData} />
            </ChartContainer>
          </div>
        )}
      </div>
    </ThemeProvider>
  )
}

export default ProductivityReport
