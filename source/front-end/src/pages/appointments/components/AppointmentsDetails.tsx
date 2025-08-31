import { useLocation, useNavigate, useParams } from 'react-router'
import { appointmentAPI } from '../../../store/appointment/appointment-api'
import { ErrorMessage } from '../../../components/feedback/ErrorMessage'
import BSBeautyLoading from '../../../components/feedback/Loading'
import { toast } from 'react-toastify'
import useAppSelector from '../../../hooks/use-app-selector'
import { UserType } from '../../../store/auth/types'
import CustomerAppointmentDetails from './CustomerAppointmentsDetails'
import {
  AppointmentDetailsAction,
  OnSubmitAppointmentDetailsUpdateForm,
} from '../types'
import useAppDispatch from '../../../hooks/use-app-dispatch'
import ProfessionalAppointmentDetails from './ProfessionalAppointmentDetails'

const userTypeToAppointmentDetailsComponents = {
  [UserType.CUSTOMER]: CustomerAppointmentDetails,
  [UserType.PROFESSIONAL]: ProfessionalAppointmentDetails,
  [UserType.MANAGER]: ProfessionalAppointmentDetails,
}

function AppointmentDetails() {
  const dispatchRedux = useAppDispatch()
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const action = queryParams.get('action') as AppointmentDetailsAction | null
  const userUserType = useAppSelector((state) => state.auth.user?.userType)!

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
    userTypeToAppointmentDetailsComponents[userUserType]

  if (!AppointmentDetailsContainer) {
    return <ErrorMessage message="Ação ou userType fornecida inválida" />
  }

  const { data, isLoading, isError, error } =
    appointmentAPI.useFindAppointmentServiceByIdQuery({
      appointmentId: appointmentId!,
    })

  const [updateAppointment, { isLoading: isLoadingUpdateAppontmentService }] =
    appointmentAPI.useUpdateAppointmentServiceMutation()

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
    await updateAppointment({
      id: appointmentId,
      status: data.status,
      ...('observation' in data ? { observation: data.observation } : {}),
    })
      .unwrap()
      .then(() => {
        dispatchRedux(
          appointmentAPI.util.updateQueryData(
            'findAppointmentServiceById',
            { appointmentId },
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
            'findAppointmentsByCustomerOrProfessionalId',
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
        navigate('/appointments')
      })
      .catch((error: unknown) => {
        console.error('Error trying to complete register', error)
        toast.error('Ocorreu um erro ao completar o seu cadastro.')
      })
  }

  return (
    <AppointmentDetailsContainer
      action={action}
      appointment={data}
      handleSubmitConcrete={handleSubmitConcrete}
      handleSubmitConcreteIsLoading={isLoadingUpdateAppontmentService}
    />
  )
}

export default AppointmentDetails
