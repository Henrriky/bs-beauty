import { Dayjs } from 'dayjs'
import { analyticsAPI } from '../../../store/analytics/analytics-api'
import { authAPI } from '../../../store/auth/auth-api'
import { professionalAPI } from '../../../store/professional/professional-api'
import { reportAPI } from '../../../store/reports/report-api'
import { UserType } from '../../../store/auth/types'
import { buildQueryParams } from '../utils/queryHelpers'
import { useDateRange } from './useDateRange'

export const useAnalyticsData = (
  startDate: Dayjs | null,
  endDate: Dayjs | null,
  selectedStatuses: string[],
  selectedProfessionalId: string | undefined,
) => {
  const { toISO } = useDateRange()

  const { data: userData } = authAPI.useFetchUserInfoQuery()
  const userType = userData?.user?.userType
  const userId = userData?.user?.id

  const activeProfessionalId =
    userType === UserType.MANAGER
      ? selectedProfessionalId
      : selectedProfessionalId || userId

  const { data: professionalsData } =
    professionalAPI.useFetchProfessionalsQuery(
      { page: 1, limit: 50 },
      { skip: userType !== UserType.MANAGER },
    )

  const queryParams = buildQueryParams(
    activeProfessionalId,
    startDate,
    endDate,
    toISO,
  )

  const shouldSkipQuery =
    !startDate ||
    !endDate ||
    (userType === UserType.PROFESSIONAL && !activeProfessionalId)

  const { data: appointmentsCountData } =
    analyticsAPI.useFetchAppointmentsCountQuery(
      {
        ...queryParams,
        statusList: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      },
      {
        skip: shouldSkipQuery,
      },
    )

  const { data: estimatedTimeData } = analyticsAPI.useFetchEstimatedTimeQuery(
    queryParams,
    {
      skip: shouldSkipQuery,
    },
  )

  const { data: cancelationData } = analyticsAPI.useFetchCancelationRateQuery(
    queryParams,
    {
      skip: shouldSkipQuery,
    },
  )

  const { data: ratingsCountData } = analyticsAPI.useFetchRatingsCountQuery(
    {
      professionalId: activeProfessionalId,
      startDate: startDate ? toISO(startDate.format('YYYY-MM-DD')) : undefined,
      endDate: endDate ? toISO(endDate.format('YYYY-MM-DD'), true) : undefined,
    },
    {
      skip: shouldSkipQuery,
    },
  )

  const { data: discoverySourceData } =
    reportAPI.useGetDiscoverySourceCountQuery(
      {
        startDate: startDate
          ? toISO(startDate.format('YYYY-MM-DD'))
          : undefined,
        endDate: endDate
          ? toISO(endDate.format('YYYY-MM-DD'), true)
          : undefined,
      },
      {
        skip: !startDate || !endDate,
      },
    )

  const { data: customerAgeData } =
    reportAPI.useGetCustomerAgeDistributionQuery(
      {
        startDate: startDate
          ? toISO(startDate.format('YYYY-MM-DD'))
          : undefined,
        endDate: endDate
          ? toISO(endDate.format('YYYY-MM-DD'), true)
          : undefined,
      },
      {
        skip: !startDate || !endDate,
      },
    )

  const { data: newCustomersData, isLoading: isNewCustomersLoading } =
    reportAPI.useGetNewCustomersCountQuery(
      {
        startDate: startDate ? toISO(startDate.format('YYYY-MM-DD')) : '',
        endDate: endDate ? toISO(endDate.format('YYYY-MM-DD'), true) : '',
      },
      {
        skip: !startDate || !endDate,
      },
    )

  const { data: revenueData } = reportAPI.useGetRevenueEvolutionQuery(
    {
      startDate: startDate ? toISO(startDate.format('YYYY-MM-DD')) : '',
      endDate: endDate ? toISO(endDate.format('YYYY-MM-DD'), true) : '',
      professionalId: activeProfessionalId,
    },
    {
      skip: !startDate || !endDate,
    },
  )

  const { data: totalRevenueData, isLoading: isTotalRevenueLoading } =
    reportAPI.useGetTotalRevenueQuery(
      {
        startDate: startDate ? toISO(startDate.format('YYYY-MM-DD')) : '',
        endDate: endDate ? toISO(endDate.format('YYYY-MM-DD'), true) : '',
        professionalId: activeProfessionalId,
      },
      {
        skip: !startDate || !endDate,
      },
    )

  const { data: revenueByServiceData, isLoading: isRevenueByServiceLoading } =
    reportAPI.useGetRevenueByServiceQuery(
      {
        startDate: startDate ? toISO(startDate.format('YYYY-MM-DD')) : '',
        endDate: endDate ? toISO(endDate.format('YYYY-MM-DD'), true) : '',
        professionalId: activeProfessionalId,
      },
      {
        skip: !startDate || !endDate,
      },
    )

  const {
    data: revenueByProfessionalData,
    isLoading: isRevenueByProfessionalLoading,
  } = reportAPI.useGetRevenueByProfessionalQuery(
    {
      startDate: startDate ? toISO(startDate.format('YYYY-MM-DD')) : '',
      endDate: endDate ? toISO(endDate.format('YYYY-MM-DD'), true) : '',
    },
    {
      skip: !startDate || !endDate || userType !== UserType.MANAGER,
    },
  )

  const { data: occupancyRateData, isLoading: isOccupancyRateLoading } =
    reportAPI.useGetOccupancyRateQuery(
      {
        startDate: startDate ? toISO(startDate.format('YYYY-MM-DD')) : '',
        endDate: endDate ? toISO(endDate.format('YYYY-MM-DD'), true) : '',
        professionalId: activeProfessionalId,
      },
      {
        skip: !startDate || !endDate,
      },
    )

  const { data: idleRateData, isLoading: isIdleRateLoading } =
    reportAPI.useGetIdleRateQuery(
      {
        startDate: startDate ? toISO(startDate.format('YYYY-MM-DD')) : '',
        endDate: endDate ? toISO(endDate.format('YYYY-MM-DD'), true) : '',
        professionalId: activeProfessionalId,
      },
      {
        skip: !startDate || !endDate,
      },
    )

  const { data: peakHoursData, isLoading: isPeakHoursLoading } =
    reportAPI.useGetPeakHoursQuery(
      {
        startDate: startDate ? toISO(startDate.format('YYYY-MM-DD')) : '',
        endDate: endDate ? toISO(endDate.format('YYYY-MM-DD'), true) : '',
        professionalId: activeProfessionalId,
      },
      {
        skip: !startDate || !endDate,
      },
    )

  const { data: busiestWeekdaysData, isLoading: isBusiestWeekdaysLoading } =
    reportAPI.useGetBusiestWeekdaysQuery(
      {
        startDate: startDate ? toISO(startDate.format('YYYY-MM-DD')) : '',
        endDate: endDate ? toISO(endDate.format('YYYY-MM-DD'), true) : '',
        professionalId: activeProfessionalId,
      },
      {
        skip: !startDate || !endDate,
      },
    )

  const {
    data: mostBookedServicesData,
    isLoading: isMostBookedServicesLoading,
  } = reportAPI.useGetMostBookedServicesQuery(
    {
      startDate: startDate ? toISO(startDate.format('YYYY-MM-DD')) : '',
      endDate: endDate ? toISO(endDate.format('YYYY-MM-DD'), true) : '',
      professionalId: activeProfessionalId,
    },
    {
      skip: !startDate || !endDate,
    },
  )

  const {
    data: mostProfitableServicesData,
    isLoading: isMostProfitableServicesLoading,
  } = reportAPI.useGetMostProfitableServicesQuery(
    {
      startDate: startDate ? toISO(startDate.format('YYYY-MM-DD')) : '',
      endDate: endDate ? toISO(endDate.format('YYYY-MM-DD'), true) : '',
      professionalId: activeProfessionalId,
    },
    {
      skip: !startDate || !endDate,
    },
  )

  const {
    data: commissionedRevenueData,
    isLoading: isCommissionedRevenueLoading,
    isError: isCommissionedRevenueError,
  } = reportAPI.useGetCommissionedRevenueQuery(
    {
      startDate: startDate ? toISO(startDate.format('YYYY-MM-DD')) : '',
      endDate: endDate ? toISO(endDate.format('YYYY-MM-DD'), true) : '',
      professionalId: activeProfessionalId || '',
    },
    {
      skip: !startDate || !endDate || !activeProfessionalId,
    },
  )

  return {
    userType,
    userId,
    activeProfessionalId,
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
    totalRevenueData,
    isTotalRevenueLoading,
    revenueByServiceData,
    isRevenueByServiceLoading,
    revenueByProfessionalData,
    isRevenueByProfessionalLoading,
    occupancyRateData,
    isOccupancyRateLoading,
    idleRateData,
    isIdleRateLoading,
    peakHoursData,
    isPeakHoursLoading,
    busiestWeekdaysData,
    isBusiestWeekdaysLoading,
    mostBookedServicesData,
    isMostBookedServicesLoading,
    mostProfitableServicesData,
    isMostProfitableServicesLoading,
    commissionedRevenueData: isCommissionedRevenueError
      ? null
      : commissionedRevenueData,
    isCommissionedRevenueLoading,
  }
}
