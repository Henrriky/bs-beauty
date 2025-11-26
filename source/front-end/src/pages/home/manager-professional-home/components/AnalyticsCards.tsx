import {
  CalendarDateRangeIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline'
import { analyticsAPI } from '../../../../store/analytics/analytics-api'
import Card from './Card'
import { authAPI } from '../../../../store/auth/auth-api'
import { reportAPI } from '../../../../store/reports/report-api'
import dayjs from 'dayjs'

const CardSkeleton = () => (
  <div className="bg-gradient-to-br from-secondary-800/50 to-secondary-900/30 rounded-xl p-6 border border-secondary-700/50 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-secondary-700/30 rounded-lg">
        <div className="size-6 bg-secondary-600/30 rounded"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 w-32 bg-secondary-700/30 rounded"></div>
      <div className="h-8 w-20 bg-secondary-700/30 rounded"></div>
    </div>
  </div>
)

const AnalyticsCards = () => {
  const { data: userData } = authAPI.useFetchUserInfoQuery()
  const userType = userData?.user?.userType
  const id = userData?.user?.id

  const now = dayjs()
  const startOfWeek = now.startOf('week')
  const endOfWeek = now.endOf('week')

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

  const { data: totalRevenueData, isLoading: isRevenueLoading } =
    reportAPI.useGetTotalRevenueQuery(
      {
        startDate: startOfWeek.toISOString(),
        endDate: endOfWeek.toISOString(),
        professionalId: userType === 'PROFESSIONAL' ? id : undefined,
      },
      {
        skip: userType === 'PROFESSIONAL' && !id,
      },
    )

  if (isLoading || isRevenueLoading) {
    const skeletonIds = [
      'total',
      'new',
      'finished',
      'customer-count',
      'revenue',
    ]
    return (
      <div className="my-6">
        <h2 className="text-2xl font-bold text-primary-100 mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skeletonIds.map((id) => (
            <CardSkeleton key={`skeleton-${id}`} />
          ))}
        </div>
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
    <div className="my-6">
      <h2 className="text-2xl font-bold text-primary-100 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card
          icon={<CalendarDateRangeIcon />}
          text="Total de agendamentos"
          count={analytics?.totalAppointments || 0}
        />
        <Card
          icon={<UserPlusIcon />}
          text="Novos agendamentos"
          count={analytics?.newAppointments || 0}
        />
        <Card
          icon={<CheckBadgeIcon />}
          text="Agendamentos finalizados"
          count={analytics?.finishedAppointments || 0}
        />
        <Card
          icon={<UserGroupIcon />}
          text="Total de clientes"
          count={analytics?.totalCustomers || 0}
        />
        <Card
          icon={<CurrencyDollarIcon />}
          text="Faturamento semanal"
          count={
            totalRevenueData?.totalRevenue
              ? `R$ ${totalRevenueData.totalRevenue.toFixed(2)}`
              : 'R$ 0.00'
          }
        />
      </div>
    </div>
  )
}

export default AnalyticsCards
