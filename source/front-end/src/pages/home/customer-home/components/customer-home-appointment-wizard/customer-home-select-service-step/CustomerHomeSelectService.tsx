import { useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'
import BSBeautyLoading from '../../../../../../components/feedback/Loading'
import Subtitle from '../../../../../../components/texts/Subtitle'
import { serviceAPI } from '../../../../../../store/service/service-api'
import { CreateAppointmentFormData } from '../types'
import CustomerHomeServiceCard from './CustomerHomeServiceCard'
import { ErrorMessage } from '../../../../../../components/feedback/ErrorMessage'
import { employeeAPI } from '../../../../../../store/employee/employee-api'
import { FaceFrownIcon } from '@heroicons/react/24/outline'

interface Props {
  currentFlow: 'service' | 'professional'
}

function CustomerHomeSelectServiceContainer(props: Props) {
  const { register, watch } = useFormContext<CreateAppointmentFormData>()
  const serviceSelectedId = watch('serviceId')
  const serviceOfferedId = watch('serviceOfferedId')
  const employeeId = watch('employeeId')

  if (!employeeId && props.currentFlow === 'professional') {
    toast.error(
      'Por favor, selecione um funcionário para acessar a etapa de selecionar os serviços',
    )

    return (
      <ErrorMessage
        message={
          'Por favor, selecione um funcionário para acessar a etapa de selecionar os serviços'
        }
      />
    )
  }

  const { data, isLoading, isError, error } = serviceAPI.useGetServicesQuery(
    {},
    { skip: props.currentFlow !== 'service' },
  )

  const {
    data: offersData,
    isLoading: isLoadingOffers,
    isError: isErrorOffers,
    error: offersError,
  } = employeeAPI.useFetchServicesOfferedByEmployeeQuery(
    { employeeId },
    { skip: props.currentFlow !== 'professional' },
  )

  // TODO: CARREGAR MAIS SERVIÇOS QUANDO CHEGA NO LIMITE PADRÃO (10)
  // TODO: POSSÍVEL CRIAÇÃO DE INPUT DE BUSCA PARA BUSCAR PELO NOME (O PARÂMETRO JÁ ESTÁ FEITO NA API)

  const services =
    props.currentFlow === 'service'
      ? (data?.data ?? [])
      : (offersData?.offers?.map((offer) => ({
          id: `${offer.id}`,
          service: offer.service,
        })) ?? [])

  if (isLoading || isLoadingOffers)
    return <BSBeautyLoading title="Carregando os serviços..." />

  if (isError || isErrorOffers) {
    toast.error('Erro ao carregar os serviços')
    console.error(`Error trying to fetch services`, error || offersError)

    return (
      <div className="flex justify-center items-center h-full text-red-500">
        Erro ao carregar informações. Tente novamente mais tarde.
      </div>
    )
  }

  const fieldToRegister =
    props.currentFlow === 'service' ? 'serviceId' : 'serviceOfferedId'

  const fieldToCompare =
    props.currentFlow === 'service' ? serviceSelectedId : serviceOfferedId

  return (
    <>
      <Subtitle align="left" className="text-[#A4978A] font-medium">
        Selecione o serviço que você deseja agendar:
      </Subtitle>

      {services &&
        services.map((service) => {
          return (
            <div key={`service-label-${service.id}`}>
              <input
                className="invisible"
                type="radio"
                id={service.id}
                value={service.id}
                {...register('serviceId')}
              />
              <CustomerHomeServiceCard
                isSelected={serviceSelectedId === service.id}
                name={service.name}
                description={service.description}
                id={service.id}
                for={service.id}
              />
            </div>
          )
        })}
    </>
  )
}

export default CustomerHomeSelectServiceContainer
