import { useState } from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import { LineChart } from '@mui/x-charts/LineChart'
import { PieChart } from '@mui/x-charts/PieChart'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/pt-br'
import Title from '../../components/texts/Title'
import Subtitle from '../../components/texts/Subtitle'
import { analyticsAPI } from '../../store/analytics/analytics-api'
import { authAPI } from '../../store/auth/auth-api'
import { professionalAPI } from '../../store/professional/professional-api'
import StatusFilterInput from '../../components/inputs/status-filter-input/StatusFilterInput'
import ProfessionalSelector from '../../components/inputs/professional-selector/ProfessionalSelector'
import { UserType, Professional } from '../../store/auth/types'
import expandArrow from '../../assets/expand-arrow.svg'
import { useDateRange } from './hooks/useDateRange'
import {
  useChartData,
  useTotalWorkTime,
  useCancellationData,
} from './hooks/useChartData'
import { commonChartStyles } from './utils/chartStyles'

dayjs.locale('pt-br')

const darkChartTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      paper: '#262626',
      default: '#1E1E1E',
    },
    text: {
      primary: '#D9D9D9',
      secondary: '#979797',
    },
    primary: {
      main: '#A4978A',
    },
  },
  components: {
    MuiPopper: {
      styleOverrides: {
        root: {
          '& .MuiPaper-root': {
            backgroundColor: '#262626',
            border: '1px solid #535353',
            color: '#D9D9D9',
          },
        },
      },
    },
  },
})

function ProductivityReport() {
  const { defaultDates, toISO } = useDateRange()

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

  const { data: userData } = authAPI.useFetchUserInfoQuery()
  const id = userData?.user?.id
  const userType = userData?.user?.userType

  const { data: professionalsData } =
    professionalAPI.useFetchProfessionalsQuery(
      { page: 1, limit: 50 },
      { skip: userType !== UserType.MANAGER },
    )

  const activeProfessionalId = selectedProfessional?.id || id

  const hasActiveFilters =
    selectedStatuses.length > 0 || selectedProfessional !== null

  const activeFiltersCount =
    (selectedStatuses.length > 0 ? 1 : 0) +
    (selectedProfessional !== null ? 1 : 0)

  const shouldShowFilters = filtersOpen || hasActiveFilters

  const queryParams = {
    professionalId: activeProfessionalId!,
    startDate: startDate ? toISO(startDate.format('YYYY-MM-DD')) : '',
    endDate: endDate ? toISO(endDate.format('YYYY-MM-DD'), true) : '',
  }

  const { data: appointmentsCountData } =
    analyticsAPI.useFetchAppointmentsCountQuery(
      {
        ...queryParams,
        statusList: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      },
      {
        skip: !activeProfessionalId || !startDate || !endDate,
      },
    )

  const { data: estimatedTimeData } = analyticsAPI.useFetchEstimatedTimeQuery(
    queryParams,
    {
      skip: !activeProfessionalId || !startDate || !endDate,
    },
  )

  const { data: cancelationData } = analyticsAPI.useFetchCancelationRateQuery(
    queryParams,
    {
      skip: !activeProfessionalId || !startDate || !endDate,
    },
  )

  const { data: ratingsCountData } = analyticsAPI.useFetchRatingsCountQuery(
    {
      professionalId: activeProfessionalId,
      startDate: startDate ? toISO(startDate.format('YYYY-MM-DD')) : undefined,
      endDate: endDate ? toISO(endDate.format('YYYY-MM-DD'), true) : undefined,
    },
    {
      skip: !activeProfessionalId || !startDate || !endDate,
    },
  )

  const appointmentsChartData = useChartData(appointmentsCountData, 'count')
  const estimatedTimeChartData = useChartData(estimatedTimeData, 'time')
  const workTimeInHours = useTotalWorkTime(estimatedTimeData)
  const {
    chartData: cancellationChartData,
    cancellationPercentage,
    activePercentage,
  } = useCancellationData(cancelationData)
  console.log(cancelationData)

  const meanRating = ratingsCountData
    ? (() => {
        const totalRatings =
          ratingsCountData[1] +
          ratingsCountData[2] +
          ratingsCountData[3] +
          ratingsCountData[4] +
          ratingsCountData[5]
        if (totalRatings === 0) return 0
        const weightedSum =
          ratingsCountData[1] * 1 +
          ratingsCountData[2] * 2 +
          ratingsCountData[3] * 3 +
          ratingsCountData[4] * 4 +
          ratingsCountData[5] * 5
        return (weightedSum / totalRatings).toFixed(1)
      })()
    : null

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

        <div className="bg-[#262626] rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-[#D9D9D9]">
            Período de Análise
          </h2>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="pt-br"
          >
            <div className="flex">
              <DatePicker
                label="Data Inicial"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="DD/MM/YYYY"
                className="w-1/2"
                slotProps={{
                  textField: {
                    sx: {
                      '& .MuiSvgIcon-root': {
                        color: '#A4978A',
                      },
                    },
                  },
                }}
              />
              <DatePicker
                label="Data Final"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                format="DD/MM/YYYY"
                className="w-1/2"
                slotProps={{
                  textField: {
                    sx: {
                      '& .MuiSvgIcon-root': {
                        color: '#A4978A',
                      },
                    },
                  },
                }}
              />
            </div>
          </LocalizationProvider>
        </div>

        <div className="w-full my-6">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex justify-center items-center"
          >
            <img
              src={expandArrow}
              alt="Ícone de seta"
              className={`transition-transform duration-500 ${
                shouldShowFilters ? 'rotate-180' : 'rotate-0'
              }`}
            />
            <span className="text-[#B19B86] text-sm ml-[13px]">
              Filtrar resultados
              {hasActiveFilters && (
                <span className="bg-[#A4978A] text-[#1E1E1E] text-xs font-medium px-2 py-1 rounded-full ml-2">
                  {activeFiltersCount} ativo{activeFiltersCount > 1 ? 's' : ''}
                </span>
              )}
            </span>
          </button>

          {shouldShowFilters && (
            <div className="mt-6 space-y-4">
              {userType === UserType.MANAGER && (
                <div>
                  <ProfessionalSelector
                    professionals={professionalsData?.data || []}
                    selectedProfessional={selectedProfessional}
                    onSelect={setSelectedProfessional}
                  />
                </div>
              )}

              <div>
                <StatusFilterInput
                  value={selectedStatuses}
                  onChange={setSelectedStatuses}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-[#262626] rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-[#D9D9D9] text-center">
              Quantidade de Agendamentos
            </h2>
            <div className="w-full h-[400px]">
              <LineChart
                yAxis={[
                  {
                    min: 0,
                    tickMinStep: 1,
                  },
                ]}
                xAxis={[
                  {
                    scaleType: 'point',
                    data: appointmentsChartData.dates,
                  },
                ]}
                series={[
                  {
                    data: appointmentsChartData.values,
                    label: 'Agendamentos',
                    color: '#A4978A',
                    curve: 'natural',
                  },
                ]}
                height={350}
                sx={commonChartStyles}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-[#262626] rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-[#D9D9D9] text-center">
                Tempo Estimado de Trabalho
              </h2>
              <div className="w-full h-[400px]">
                {estimatedTimeData ? (
                  <>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-[#A4978A]">
                        {workTimeInHours} horas
                      </div>
                      <div className="text-sm text-[#979797]">
                        Total no período selecionado
                      </div>
                    </div>
                    <BarChart
                      xAxis={[
                        {
                          scaleType: 'band',
                          data: estimatedTimeChartData.dates,
                          colorMap: {
                            type: 'ordinal',
                            colors: ['#926941'],
                          },
                        },
                      ]}
                      series={[
                        {
                          data: estimatedTimeChartData.values,
                          label: 'Horas Estimadas',
                          color: '#926941',
                        },
                      ]}
                      height={300}
                      sx={commonChartStyles}
                    />
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-[#979797]">
                    Carregando...
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#262626] rounded-lg p-6">
              <div className="flex flex-col mb-4">
                <h2 className="text-lg font-semibold text-[#D9D9D9] mb-4 lg:mb-0 text-center">
                  Taxa de Cancelamento
                </h2>
                <div className="text-center">
                  <div className="text-[#979797] mb-3 text-center">
                    Percentuais
                  </div>
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
              <div className="w-full h-[400px] flex justify-center items-center">
                <PieChart
                  series={[
                    {
                      data: cancellationChartData,
                      highlightScope: { fade: 'global', highlight: 'item' },
                      innerRadius: '60%',
                      outerRadius: '90%',
                    },
                  ]}
                  height={350}
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
            </div>
          </div>

          <div className="bg-[#262626] rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-[#D9D9D9] text-center">
              Avaliações dos Clientes
            </h2>
            <div className="w-full h-[400px]">
              {ratingsCountData ? (
                <>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-[#A4978A]">
                      {meanRating} ★
                    </div>
                    <div className="text-sm text-[#979797]">
                      Avaliação média
                    </div>
                  </div>
                  <BarChart
                    layout="horizontal"
                    borderRadius={10}
                    yAxis={[
                      {
                        scaleType: 'band',
                        data: ['5 ★', '4 ★', '3 ★', '2 ★', '1 ★'],
                        colorMap: {
                          type: 'ordinal',
                          colors: ['#A4978A'],
                        },
                        categoryGapRatio: 0.7,
                        disableLine: true,
                        disableTicks: true,
                        barGapRatio: 40,
                        tickLabelStyle: {
                          fontSize: 14,
                          fill: '#D9D9D9',
                        },
                      },
                    ]}
                    xAxis={[
                      {
                        disableLine: true,
                        disableTicks: true,
                        valueFormatter: () => '',
                      },
                    ]}
                    series={[
                      {
                        data: [
                          ratingsCountData[5],
                          ratingsCountData[4],
                          ratingsCountData[3],
                          ratingsCountData[2],
                          ratingsCountData[1],
                        ],
                        label: 'Quantidade de Avaliações',
                        color: '#A4978A',
                      },
                    ]}
                    height={300}
                  />
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-[#979797]">
                  Carregando...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default ProductivityReport
