import { useState } from 'react'
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
  const [currentPage, setCurrentPage] = useState(1)

  const user = useAppSelector((state) => state.auth.user!)
  const selectUserInfo = authAPI.endpoints.fetchUserInfo.select()
  const userInfoQuery = useAppSelector(selectUserInfo)
  const displayName = userInfoQuery?.data?.user?.name ?? user.name

  const schedulledStatuses = [
    Status.PENDING,
    Status.CONFIRMED,
    Status.RESCHEDULED,
  ]

  const finishedStatuses = [Status.CANCELLED, Status.FINISHED, Status.NO_SHOW]

  const { data, isLoading, isError, error } =
    appointmentAPI.useFetchAppointmentsQuery({
      page: currentPage,
      limit: 10,
      status:
        switchButtonStatus === 'schedulled'
          ? schedulledStatuses
          : finishedStatuses,
    })

  if (isError) {
    toast.error('Erro ao carregar os agendamentos')
    console.error(error)
  }

  const AppointmentContainer = userTypeToAppointmentComponents[user.userType]

  const handleSwitchChange = (newStatus: ListAppointmentsButtonStatus) => {
    setSwitchButtonStatus(newStatus)
    setCurrentPage(1)
  }

  return (
    <div className="h-full flex flex-col gap-3">
      <PageHeader
        title="Agendamentos"
        subtitle={
          <>
            Olá, {displayName}.{' '}
            <b className="text-[#A4978A]">
              Aqui você pode visualizar seus agendamentos
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
          onClick={() => handleSwitchChange('schedulled')}
        />
        <Button
          label="Finalizados"
          variant="outline"
          outlineVariantBorderStyle="solid"
          className={`rounded-l-none ${switchButtonStatus === 'finished' && 'bg-[#3A3027] hover:!bg-[#3A3027] hover:cursor-default'}`}
          onClick={() => handleSwitchChange('finished')}
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
            appointmentsService={data.data}
            switchButtonStatus={switchButtonStatus}
            pagination={{
              currentPage: data.page,
              totalPages: data.totalPages,
              total: data.total,
              onPageChange: setCurrentPage,
            }}
          />
        )}
      </section>
    </div>
  )
}

export default Appointments
