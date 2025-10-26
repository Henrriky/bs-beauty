import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import useAppSelector from '../../../hooks/use-app-selector'
import AnalyticsCards from './components/AnalyticsCards'
import MonthlyAgendaModal from './components/monthly-professional-agenda'
import WeekAppointments from './components/WeekAppointments'

function ManagerHome() {
  const user = useAppSelector((state) => state.auth.user!)
  const [agendaOpen, setAgendaOpen] = useState(false)

  return (
    <>
      <h2 className="text-2xl mt-10 mb-2">
        <span className="text-primary-100">Bem-vindo(a) ao seu </span>
        <span className="text-secondary-200">perfil </span>
        <span className="text-primary-100">
          como {user.userType === 'MANAGER' ? 'gerente' : 'profissional'}!
        </span>
      </h2>
      <div className="bg-[#595149] w-1/2 h-0.5 mt-2"></div>

      <div className="h-44 bg-secondary-100 rounded-[10px] pt-[18px] pb-[25px] px-[15px] mt-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <ClockIcon className="size-[38px] text-primary-900" />
            <p className="text-primary-300 text-sm">
              Compromissos <br />
              na semana
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAgendaOpen(true)}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm
                       bg-[#595149] text-primary-0 hover:opacity-90 focus:outline-none
                       focus:ring-2 focus:ring-offset-2 focus:ring-[#A4978A]"
            aria-label="Abrir agenda do mês"
            title="Agenda do mês"
          >
            <CalendarDaysIcon className="size-5" />
            <span className="hidden sm:inline">Agenda do mês</span>
          </button>
        </div>

        <WeekAppointments />
      </div>

      <AnalyticsCards />

      <MonthlyAgendaModal isOpen={agendaOpen} onClose={() => setAgendaOpen(false)} />
    </>
  )
}

export default ManagerHome
