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

  const [finishAppointment, { isLoading: isLoadingFinishAppointment }] =
    appointmentAPI.useFinishAppointmentMutation()

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
    formData,
  ) => {
    const handleSuccess = () => {
      dispatchRedux(
        appointmentAPI.util.updateQueryData(
          'findAppointmentServiceById',
          { appointmentId },
          (draft) => {
            draft.observation = (
              'observation' in formData ? formData.observation : null
            ) as null | string
            if (formData.status) {
              draft.status = formData.status
            }
          },
        ),
      )
      dispatchRedux(
        appointmentAPI.util.invalidateTags([
          { type: 'Appointments', id: 'LIST' },
        ]),
      )
      toast.success('Agendamento atualizado com sucesso!')
      navigate('/appointments')
    }

    const handleError = (error: unknown) => {
      console.error('Error trying to update appointment', error)
      toast.error('Ocorreu um erro ao atualizar o agendamento.')
    }

    if (formData.status === 'FINISHED') {
      await finishAppointment({
        id: appointmentId,
        ...('observation' in formData
          ? { observation: formData.observation }
          : {}),
      })
        .unwrap()
        .then(handleSuccess)
        .catch(handleError)
    } else {
      await updateAppointment({
        id: appointmentId,
        status: formData.status,
        ...('observation' in formData
          ? { observation: formData.observation }
          : {}),
      })
        .unwrap()
        .then(handleSuccess)
        .catch(handleError)
    }
  }

  const isSubmitting =
    isLoadingUpdateAppontmentService || isLoadingFinishAppointment

  return (
    <AppointmentDetailsContainer
      action={action}
      appointment={data}
      handleSubmitConcrete={handleSubmitConcrete}
      handleSubmitConcreteIsLoading={isSubmitting}
    />
  )
}

export default AppointmentDetails
