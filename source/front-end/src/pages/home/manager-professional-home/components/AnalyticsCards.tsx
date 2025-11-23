import {
  BriefcaseIcon,
  CalendarDateRangeIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
  ScissorsIcon,
  UserGroupIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline'
import { analyticsAPI } from '../../../../store/analytics/analytics-api'
import Card from './Card'
import { authAPI } from '../../../../store/auth/auth-api'

const CardSkeleton = () => (
  <div className="text-primary-100 flex items-center gap-2.5 animate-pulse">
    <div className="size-8 mr-2 bg-secondary-700/30 rounded"></div>
    <div className="h-4 w-32 bg-secondary-700/30 rounded"></div>
    <div className="ml-auto h-4 w-12 bg-secondary-700/30 rounded"></div>
  </div>
)

const AnalyticsCards = () => {
  const { data: userData } = authAPI.useFetchUserInfoQuery()
  const userType = userData?.user?.userType
  const id = userData?.user?.id

  const managerQuery = analyticsAPI.useFetchAnalyticsQuery(undefined, {
    skip: userType !== 'MANAGER',
  })

  const professionalQuery = analyticsAPI.useFetchAnalyticsByProfessionalIdQuery(
    { professionalId: id! },
    {
      skip: userType !== 'PROFESSIONAL' || !id,
    },
  )

  const activeQuery = userType === 'MANAGER' ? managerQuery : professionalQuery
  const { data: analytics, isLoading, error } = activeQuery

  if (isLoading) {
    const skeletonIds = [
      'total',
      'new',
      'finished',
      'customer-count',
      'service-count',
      'professional-count',
      'revenue',
    ]
    return (
      <div className="my-6 flex flex-col gap-6">
        {skeletonIds.map((id) => (
          <CardSkeleton key={`skeleton-${id}`} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <h1 className="mt-10 text-primary-200 text-xl">
        Erro ao carregar dados de análise.
      </h1>
    )
  }

  if (!analytics) {
    return (
      <h1 className="mt-10 text-primary-200 text-xl">
        Nenhum dado de análise disponível.
      </h1>
    )
  }

  return (
    <div className="my-6 flex flex-col gap-6">
      <Card
        icon={<CalendarDateRangeIcon />}
        text="Total de agendamentos"
        count={analytics?.totalAppointments}
      />
      <Card
        icon={<UserPlusIcon />}
        text="Novos agendamentos"
        count={analytics?.newAppointments}
      />
      <Card
        icon={<CheckBadgeIcon />}
        text="Agendamentos finalizados"
        count={analytics?.finishedAppointments}
      />
      <Card
        icon={<UserGroupIcon />}
        text="Total de clientes"
        count={analytics?.totalCustomers}
      />
      <Card
        icon={<ScissorsIcon />}
        text="Total de serviços"
        count={analytics?.numberOfServices}
      />
      {userType === 'MANAGER' && (
        <Card
          icon={<BriefcaseIcon />}
          text="Profissionais"
          count={analytics?.numberOfProfessionals ?? 0}
        />
      )}
      <Card
        icon={<CurrencyDollarIcon />}
        text="Faturamento total"
        count={analytics?.totalRevenue.toFixed(2)}
      />
    </div>
  )
}

export default AnalyticsCards
