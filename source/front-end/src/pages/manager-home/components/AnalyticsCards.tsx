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
import { toast } from 'react-toastify'

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
    toast.warning("Error while fetching data.")
  }

  if (!analytics) {
    toast.warn("No analytics data available.")
    return <h1 className='mt-10 text-primary-200 text-xl'>No analytics data available.</h1>
  }

  return (
    <div className="my-12 flex flex-col gap-6">
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
      {role === 'MANAGER' && (
        <Card
          icon={<BriefcaseIcon />}
          text="Funcionários"
          count={(analytics?.numberOfEmployees ?? 0)}
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
