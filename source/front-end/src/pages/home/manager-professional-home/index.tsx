import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import useAppSelector from '../../../hooks/use-app-selector'
import AnalyticsCards from './components/AnalyticsCards'
import MonthlyAgendaModal from './components/monthly-professional-agenda'
import WeekAppointments from './components/WeekAppointments'
import { SectionDivider } from '../../../layouts/SectionDivider'
import Subtitle from '../../../components/texts/Subtitle'
import { DateTime } from 'luxon'
import { appointmentAPI } from '../../../store/appointment/appointment-api'
import { Status } from '../../../store/appointment/types'
import AppointmentsCarousel from './components/AppointmentsCarousel'

function ManagerHome() {
  const user = useAppSelector((state) => state.auth.user!)
  const [agendaOpen, setAgendaOpen] = useState(false)
  const today = DateTime.now().toISODate()

  const {
    data: appointmentsData,
    isLoading: isLoadingAppointments,
    isError: isErrorAppointments,
  } = appointmentAPI.useFetchAppointmentsQuery({
    from: today,
    to: today,
    page: 1,
    limit: 10,
    status: [Status.PENDING, Status.CONFIRMED],
  })

  return (
    <>
      <h2 className="text-2xl mt-3 mb-2">
        <span className="text-[#D9D9D9]">Bem-vindo(a) ao seu </span>
        <span className="text-secondary-200">perfil </span>
        <span className="text-[#D9D9D9]">
          como {user.userType === 'MANAGER' ? 'gerente' : 'profissional'}!
        </span>
      </h2>
      <SectionDivider />

      <div className="h-44 bg-secondary-100 rounded-[10px] pt-[18px] pb-[25px] px-[15px] mt-6 mb-5">
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

      <SectionDivider />

      <Subtitle className="mt-4 text-xl text-[#D9D9D9]" align='left' children='Seus agendamentos do dia' />

      <AppointmentsCarousel
        items={appointmentsData?.data || []}
        loading={isLoadingAppointments}
        error={isErrorAppointments}
      />
      <SectionDivider />

      <AnalyticsCards />

      <MonthlyAgendaModal
        isOpen={agendaOpen}
        onClose={() => setAgendaOpen(false)}
      />
    </>
  )
}

export default ManagerHome
