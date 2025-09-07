import { useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'
import BSBeautyLoading from '../../../../../../components/feedback/Loading'
import Subtitle from '../../../../../../components/texts/Subtitle'
import { serviceAPI } from '../../../../../../store/service/service-api'
import { CreateAppointmentFormData } from '../types'
import CustomerHomeServiceCard from './CustomerHomeServiceCard'
import { ErrorMessage } from '../../../../../../components/feedback/ErrorMessage'
import { professionalAPI } from '../../../../../../store/professional/professional-api'
import { FaceFrownIcon } from '@heroicons/react/24/outline'

interface Props {
  currentFlow: 'service' | 'professional'
}

function CustomerHomeSelectServiceContainer(props: Props) {
  const { register, watch, setValue } =
    useFormContext<CreateAppointmentFormData>()
  const serviceSelectedId = watch('serviceId')
  const serviceOfferedId = watch('serviceOfferedId')
  const professionalId = watch('professionalId')

  if (!professionalId && props.currentFlow === 'professional') {
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
  } = professionalAPI.useFetchServicesOfferedByProfessionalQuery(
    { professionalId },
    { skip: props.currentFlow !== 'professional' },
  )

  // TODO: CARREGAR MAIS SERVIÇOS QUANDO CHEGA NO LIMITE PADRÃO (10)
  // TODO: POSSÍVEL CRIAÇÃO DE INPUT DE BUSCA PARA BUSCAR PELO NOME (O PARÂMETRO JÁ ESTÁ FEITO NA API)

  const servicesData = Array.isArray(data?.data) ? data.data : []
  const offersDataArray = Array.isArray(offersData?.professional.offers)
    ? offersData?.professional.offers
    : []

  const services =
    props.currentFlow === 'service'
      ? servicesData.map((service) => ({
          id: `${service.id}`,
          service,
        }))
      : offersDataArray

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

  if (!Array.isArray(services) || services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500">
        <FaceFrownIcon className="h-12 w-12 mb-2" />
        <p>Nenhum serviço disponível</p>
        {props.currentFlow === 'professional' && (
          <p className="text-sm">
            Este funcionário não possui serviços cadastrados
          </p>
        )}
      </div>
    )
  }

  return (
    <>
      <Subtitle align="left" className="text-[#A4978A] font-medium">
        Selecione o serviço que você deseja agendar:
      </Subtitle>

      {services &&
        services.map((service) => {
          const serviceOffered = service.service

          return (
            <div key={`service-label-${service.id}`}>
              <input
                className="invisible"
                type="radio"
                id={service.id}
                value={service.id}
                {...register(fieldToRegister)}
              />
              <CustomerHomeServiceCard
                isSelected={fieldToCompare === service.id}
                currentFlow={props.currentFlow}
                key={service.id}
                for={service.id}
                {...service}
                onClick={() => setValue('serviceId', serviceOffered.id)}
              />
            </div>
          )
        })}
    </>
  )
}

export default CustomerHomeSelectServiceContainer
