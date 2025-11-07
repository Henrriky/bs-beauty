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

  return {
    userType,
    professionalsData,
    appointmentsCountData,
    estimatedTimeData,
    cancelationData,
    ratingsCountData,
    discoverySourceData,
    customerAgeData,
  }
}
