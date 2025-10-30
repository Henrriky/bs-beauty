import { Dayjs } from 'dayjs'
import { analyticsAPI } from '../../../store/analytics/analytics-api'
import { authAPI } from '../../../store/auth/auth-api'
import { professionalAPI } from '../../../store/professional/professional-api'
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

  const activeProfessionalId = selectedProfessionalId || userId

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

  return {
    userType,
    professionalsData,
    appointmentsCountData,
    estimatedTimeData,
    cancelationData,
    ratingsCountData,
  }
}
