import {
  BriefcaseIcon,
  CalendarDateRangeIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
  ScissorsIcon,
  UserGroupIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline'
import { analyticsAPI } from '../../../store/analytics/analytics-api'
import Card from './Card'
import { authAPI } from '../../../store/auth/auth-api'

const AnalyticsCards = () => {
  const { data: userData } = authAPI.useFetchUserInfoQuery()
  const role = userData?.user?.role
  const id = userData?.user?.id

  const managerQuery = analyticsAPI.useFetchAnalyticsQuery(undefined, {
    skip: role !== 'MANAGER',
  })

  const employeeQuery = analyticsAPI.useFetchAnalyticsByEmployeeIdQuery(
    { employeeId: id! },
    {
      skip: role !== 'EMPLOYEE' || !id,
    },
  )

  if (!userData) return <p>Loading user...</p>

  if (role !== 'MANAGER' && role !== 'EMPLOYEE') {
    return <p>No permissions</p>
  }

  const activeQuery = role === 'MANAGER' ? managerQuery : employeeQuery
  const { data: analytics, isLoading, error } = activeQuery

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (error) {
    if (error.data.statusCode === 404) return <p>Error while fetching data.</p>
  }

  if (!analytics) {
    return <p>No analytics data available.</p>
  }

  return (
    <div className="my-12 flex flex-col gap-6">
      <Card
        icon={<CalendarDateRangeIcon />}
        text="Total de agendamentos"
        count={Number(analytics?.totalAppointments)}
      />
      <Card
        icon={<UserPlusIcon />}
        text="Novos agendamentos"
        count={Number(analytics?.newAppointments)}
      />
      <Card
        icon={<CheckBadgeIcon />}
        text="Agendamentos finalizados"
        count={Number(analytics?.finishedAppointments)}
      />
      <Card
        icon={<UserGroupIcon />}
        text="Total de clientes"
        count={Number(analytics?.totalCustomers)}
      />
      <Card
        icon={<ScissorsIcon />}
        text="Total de serviços"
        count={Number(analytics?.numberOfServices)}
      />
      {role === 'MANAGER' && (
        <Card
          icon={<BriefcaseIcon />}
          text="Funcionários"
          count={Number(analytics?.numberOfEmployees)}
        />
      )}
      <Card
        icon={<CurrencyDollarIcon />}
        text="Faturamento total"
        count={Number(analytics?.totalRevenue).toFixed(2)}
      />
    </div>
  )
}

export default AnalyticsCards
