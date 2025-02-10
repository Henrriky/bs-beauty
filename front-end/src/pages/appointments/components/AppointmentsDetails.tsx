import { useLocation, useParams } from 'react-router'
import { appointmentAPI } from '../../../store/appointment/appointment-api'
import { ErrorMessage } from '../../../components/feedback/ErrorMessage'
import BSBeautyLoading from '../../../components/feedback/Loading'
import { toast } from 'react-toastify'
import useAppSelector from '../../../hooks/use-app-selector'
import { Role } from '../../../store/auth/types'
import CustomerAppointmentDetails from './CustomerAppointmentsDetails'
import {
  AppointmentDetailsAction,
  OnSubmitAppointmentDetailsUpdateForm,
} from '../types'
import useAppDispatch from '../../../hooks/use-app-dispatch'

const roleToAppointmentDetailsComponents = {
  [Role.CUSTOMER]: CustomerAppointmentDetails,
  [Role.EMPLOYEE]: CustomerAppointmentDetails,
  [Role.MANAGER]: CustomerAppointmentDetails,
}

function AppointmentDetails() {
  const dispatchRedux = useAppDispatch()
  const { appointmentId } = useParams()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const action = queryParams.get('action') as AppointmentDetailsAction | null
  const userRole = useAppSelector((state) => state.auth.user?.role)!

  if (!appointmentId) {
    return (
      <ErrorMessage message="Por favor, forneça o identificar do agendamento" />
    )
  }

  if (!action) {
    return (
      <ErrorMessage message="Por favor, forneça a ação para o agendamento" />
    )
  }

  const AppointmentDetailsContainer =
    roleToAppointmentDetailsComponents[userRole]

  if (!AppointmentDetailsContainer) {
    return <ErrorMessage message="Ação ou role fornecida inválida" />
  }

  const { data, isLoading, isError, error } =
    appointmentAPI.useFindAppointmentServiceByIdQuery({
      appointmentServiceId: appointmentId!,
    })

  const [
    updateAppointmentService,
    { isLoading: isLoadingUpdateAppontmentService },
  ] = appointmentAPI.useUpdateAppointmentServiceMutation()

  if (isLoading) {
    return <BSBeautyLoading title="Carregando as informações..." />
  }

  if (isError) {
    toast.error('Erro ao carregar a lista de clientes')
    console.error(error)

    return (
      <ErrorMessage message="Erro ao carregar informações. Tente novamente mais tarde." />
    )
  }

  if (!data) {
    toast.warn('Informações não disponíveis no momento')
    return (
      <div className="flex justify-center items-center h-full text-yellow-500">
        Nenhuma informação disponível.
      </div>
    )
  }

  const handleSubmitConcrete: OnSubmitAppointmentDetailsUpdateForm = async (
    data,
  ) => {
    await updateAppointmentService({
      id: appointmentId,
      status: data.status,
      ...('observation' in data ? { observation: data.observation } : {}),
    })
      .unwrap()
      .then(() => {
        dispatchRedux(
          appointmentAPI.util.updateQueryData(
            'findAppointmentServiceById',
            { appointmentServiceId: appointmentId },
            (draft) => {
              draft.observation = (
                'observation' in data ? data.observation : null
              ) as null | string
              if (data.status) {
                draft.status = data.status
              }
            },
          ),
        )
        dispatchRedux(
          appointmentAPI.util.updateQueryData(
            'findAppointmentsByCustomerId',
            undefined,
            (draft) => {
              if (!data.status) return

              const appointmentIndex = draft.appointments.findIndex(
                (appointment) => appointment.id === appointmentId,
              )

              if (appointmentIndex !== -1) {
                draft.appointments[appointmentIndex].status = data.status
              }
            },
          ),
        )
        toast.success('Agendamento atualizado com sucesso!')
      })
      .catch((error: unknown) => {
        console.error('Error trying to complete register', error)
        toast.error('Ocorreu um erro ao completar o seu cadastro.')
      })
  }

  return (
    <AppointmentDetailsContainer
      action={action}
      appointmentService={data}
      handleSubmitConcrete={handleSubmitConcrete}
      handleSubmitConcreteIsLoading={isLoadingUpdateAppontmentService}
    />
  )
}

export default AppointmentDetails
