import { toast } from 'react-toastify'
import { Button } from '../../components/button/Button'
import BSBeautyLoading from '../../components/feedback/Loading'
import Subtitle from '../../components/texts/Subtitle'
import useAppSelector from '../../hooks/use-app-selector'
import { Role } from '../../store/auth/types'
import { CustomerAppointments } from './components/CustomerAppointments'
import { ErrorMessage } from '../../components/feedback/ErrorMessage'
import { appointmentAPI } from '../../store/appointment/appointment-api'
import { ListAppointmentsButtonStatus } from './types'
import { useMemo, useState } from 'react'
import { Status } from '../../store/appointment/types'

const roleToAppointmentComponents = {
  [Role.CUSTOMER]: CustomerAppointments,
  [Role.EMPLOYEE]: CustomerAppointments,
  [Role.MANAGER]: CustomerAppointments,
}

function Appointments() {
  const [switchButtonStatus, setSwitchButtonStatus] =
    useState<ListAppointmentsButtonStatus>('schedulled')
  const user = useAppSelector((state) => state.auth.user!)

  const { data, isLoading, isError, error } =
    appointmentAPI.useFindAppointmentsByCustomerIdQuery()

  if (isError) {
    toast.error('Erro ao carregar os agendamentos')
    console.error(error)
  }

  const AppointmentContainer = roleToAppointmentComponents[user.role]

  const filteredAppointments = useMemo(() => {
    if (!data) return []

    const schedulledStatuses = new Set([
      Status.PENDING.toString(),
      Status.CONFIRMED.toString(),
      Status.RESCHEDULED.toString(),
    ])

    const finishedStatuses = new Set([
      Status.CANCELLED.toString(),
      Status.FINISHED.toString(),
      Status.NO_SHOW.toString(),
    ])

    return data.appointments.filter((appointment) =>
      switchButtonStatus === 'schedulled'
        ? schedulledStatuses.has(appointment.status.toString())
        : finishedStatuses.has(appointment.status.toString()),
    )
  }, [data, switchButtonStatus])

  return (
    <div className="h-full flex flex-col justify-between">
      <header>
        <div className="flex flex-col mb-6 max-w-[50%]">
          <Subtitle align="left">
            Olá {user.name},{' '}
            <b className="text-[#A4978A]">
              aqui você pode visualizar seus agendamentos
            </b>
          </Subtitle>
          <div className="bg-[#595149] w-1/2 h-0.5 mt-2"></div>
        </div>
      </header>
      {/* SWITCH BUTTONS */}
      <div className="flex">
        <Button
          label="Agendados"
          variant="outline"
          outlineVariantBorderStyle="solid"
          className={`rounded-r-none ${switchButtonStatus === 'schedulled' && 'bg-[#3A3027] hover:!bg-[#3A3027] hover:cursor-default'}`}
          onClick={() => setSwitchButtonStatus('schedulled')}
        />
        <Button
          label="Finalizados"
          variant="outline"
          outlineVariantBorderStyle="solid"
          className={`rounded-l-none ${switchButtonStatus === 'finished' && 'bg-[#3A3027] hover:!bg-[#3A3027] hover:cursor-default'}`}
          onClick={() => setSwitchButtonStatus('finished')}
        />
      </div>
      <section>
        {isLoading ? (
          <BSBeautyLoading title="Carregando as informações..." />
        ) : isError ? (
          <ErrorMessage
            message={
              'Erro ao carregar informações. Tente novamente mais tarde.'
            }
          />
        ) : !data ? (
          <div className="flex justify-center items-center h-full text-yellow-500">
            Agendamentos não disponíveis no momento
          </div>
        ) : (
          <AppointmentContainer
            appointmentsService={filteredAppointments}
            switchButtonStatus={switchButtonStatus}
          />
        )}
      </section>
    </div>
  )
}

export default Appointments
