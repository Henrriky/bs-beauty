import { ClockIcon } from '@heroicons/react/24/outline'
import WeekAppointments from './components/WeekAppointments'
import AnalyticsCards from './components/AnalyticsCards'
import useAppSelector from '../../hooks/use-app-selector'

function ManagerHome() {
  const user = useAppSelector((state) => state.auth.user!)
  return (
    <>
      <h1 className="text-2xl mt-10 mb-8">
        <span className="font-bold text-primary-500">Bem-vindo(a) ao seu </span>
        <span className="text-secondary-200">perfil </span>
        <span className="text-primary-100">
          como {user.role === 'MANAGER' ? 'gerente' : 'funcionário'}!
        </span>
      </h1>
      <div className="h-44 bg-secondary-100 rounded-[10px] pt-[18px] pb-[25px] px-[15px]">
        <div className="flex gap-4">
          <ClockIcon className="size-[38px] text-primary-900" />
          <p className="text-primary-300 text-sm">
            Compromissos <br />
            na semana
          </p>
        </div>
        <WeekAppointments />
      </div>
      <AnalyticsCards />
    </>
  )
}

export default ManagerHome
