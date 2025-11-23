import { ThemeProvider } from '@mui/material/styles'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/pt-br'
import { Professional, UserType } from '../../store/auth/types'
import { useDateRange } from './hooks/useDateRange'
import { useAnalyticsData } from './hooks/useAnalyticsData'
import { darkChartTheme } from './constants/theme'
import ReportFilters from './components/ReportFilters'
import AppointmentsChart from './components/AppointmentsChart'
import CancellationChart from './components/CancellationChart'
import ChartContainer from './components/ChartContainer'
import EstimatedTimeChart from './components/EstimatedTimeChart'
import RatingsChart from './components/RatingsChart'
import DiscoverySourceChart from './components/DiscoverySourceChart'
import CustomerAgeChart from './components/CustomerAgeChart'
import RevenueChart from './components/RevenueChart'
import TotalRevenueCard from './components/TotalRevenueCard'
import NewCustomersCard from './components/NewCustomersCard'
import RevenueByServiceGrid from './components/RevenueByServiceGrid'
import RevenueByProfessionalGrid from './components/RevenueByProfessionalGrid'
import CommissionedRevenueCard from './components/CommissionedRevenueCard'
import OccupancyRateCard from './components/OccupancyRateCard'
import PeakHoursCard from './components/PeakHoursCard'
import BusiestWeekdaysCard from './components/BusiestWeekdaysCard'
import MostBookedServicesCard from './components/MostBookedServicesCard'
import MostProfitableServicesCard from './components/MostProfitableServicesCard'
import { SwitchButton } from '../../components/button/SwitchButton'
import { PageHeader } from '../../layouts/PageHeader'
import { useState } from 'react'
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

  const {
    userType,
    professionalsData,
    appointmentsCountData,
    estimatedTimeData,
    cancelationData,
    ratingsCountData,
    discoverySourceData,
    customerAgeData,
    newCustomersData,
    isNewCustomersLoading,
    revenueData,
    isRevenueLoading,
    totalRevenueData,
    isTotalRevenueLoading,
    revenueByServiceData,
    isRevenueByServiceLoading,
    revenueByProfessionalData,
    isRevenueByProfessionalLoading,
    occupancyRateData,
    isOccupancyRateLoading,
    peakHoursData,
    isPeakHoursLoading,
    busiestWeekdaysData,
    isBusiestWeekdaysLoading,
    mostBookedServicesData,
    isMostBookedServicesLoading,
    mostProfitableServicesData,
    isMostProfitableServicesLoading,
    commissionedRevenueData,
    isCommissionedRevenueLoading,
    activeProfessionalId,
  } = useAnalyticsData(
    startDate,
    endDate,
    selectedStatuses,
    selectedProfessional?.id,
  )

  return (
    <ThemeProvider theme={darkChartTheme}>
      <div className="h-full flex flex-col">
        <PageHeader
          title="Relatórios do Salão"
          subtitle={
            <>
              Visualize os dados de{' '}
              <b className="text-[#A4978A]">agendamentos</b> e{' '}
              <b className="text-[#A4978A]">desempenho</b>.
            </>
          }
        />

        <SwitchButton
          value={switchValue}
          onChange={setSwitchValue}
          options={
            userType === UserType.MANAGER
              ? [
                  { value: 'productivity', label: 'Produtividade' },
                  { value: 'financial', label: 'Financeiro' },
                  { value: 'customer', label: 'Clientes' },
                  { value: 'occupancy', label: 'Ocupação' },
                ]
              : [
                  { value: 'productivity', label: 'Produtividade' },
                  { value: 'financial', label: 'Financeiro' },
                ]
          }
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
        )}

        {userType === UserType.MANAGER && switchValue === 'customer' && (
          <div className="flex flex-col gap-6">
            <NewCustomersCard
              data={newCustomersData}
              isLoading={isNewCustomersLoading}
            />

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

            {activeProfessionalId && (
              <CommissionedRevenueCard
                data={commissionedRevenueData}
                isLoading={isCommissionedRevenueLoading}
              />
            )}

            <ChartContainer title="Evolução do Faturamento">
              <RevenueChart data={revenueData} isLoading={isRevenueLoading} />
            </ChartContainer>

            <RevenueByServiceGrid
              data={revenueByServiceData}
              isLoading={isRevenueByServiceLoading}
            />

            {userType === UserType.MANAGER && (
              <RevenueByProfessionalGrid
                data={revenueByProfessionalData}
                isLoading={isRevenueByProfessionalLoading}
              />
            )}
          </div>
        )}

        {userType === UserType.MANAGER && switchValue === 'occupancy' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <OccupancyRateCard
                data={occupancyRateData}
                isLoading={isOccupancyRateLoading}
              />
            </div>

            <PeakHoursCard
              data={peakHoursData}
              isLoading={isPeakHoursLoading}
            />

            <BusiestWeekdaysCard
              data={busiestWeekdaysData}
              isLoading={isBusiestWeekdaysLoading}
            />

            <MostBookedServicesCard
              data={mostBookedServicesData}
              isLoading={isMostBookedServicesLoading}
            />

            <MostProfitableServicesCard
              data={mostProfitableServicesData}
              isLoading={isMostProfitableServicesLoading}
            />
          </div>
        )}
      </div>
    </ThemeProvider>
  )
}

export default ProductivityReport
