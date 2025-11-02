import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '../../components/button/Button'
import { ErrorMessage } from '../../components/feedback/ErrorMessage'
import BSBeautyLoading from '../../components/feedback/Loading'
import useAppSelector from '../../hooks/use-app-selector'
import { PageHeader } from '../../layouts/PageHeader'
import { appointmentAPI } from '../../store/appointment/appointment-api'
import { Status } from '../../store/appointment/types'
import { authAPI } from '../../store/auth/auth-api'
import { UserType } from '../../store/auth/types'
import { CustomerAppointments } from './components/CustomerAppointments'
import { ListAppointmentsButtonStatus } from './types'

const userTypeToAppointmentComponents = {
  [UserType.CUSTOMER]: CustomerAppointments,
  [UserType.PROFESSIONAL]: CustomerAppointments,
  [UserType.MANAGER]: CustomerAppointments,
}

function Appointments() {
  const [switchButtonStatus, setSwitchButtonStatus] =
    useState<ListAppointmentsButtonStatus>('schedulled')

  const user = useAppSelector((state) => state.auth.user!)
  const selectUserInfo = authAPI.endpoints.fetchUserInfo.select()
  const userInfoQuery = useAppSelector(selectUserInfo)
  const displayName = userInfoQuery?.data?.user?.name ?? user.name

  const { data, isLoading, isError, error } =
    appointmentAPI.useFindAppointmentsByCustomerOrProfessionalIdQuery()
  if (isError) {
    toast.error('Erro ao carregar os agendamentos')
    console.error(error)
  }

  const AppointmentContainer = userTypeToAppointmentComponents[user.userType]

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
    <div className="h-full flex flex-col gap-3">
      <PageHeader
        title="Agendamentos"
        subtitle={
          <>
            Olá {displayName},{' '}
            <b className="text-[#A4978A]">
              aqui você pode visualizar seus agendamentos
            </b>
            .
          </>
        }
      />
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
