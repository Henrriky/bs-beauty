import { toast } from 'react-toastify'
import BSBeautyLoading from '../../../../../../components/feedback/Loading'
import Subtitle from '../../../../../../components/texts/Subtitle'
import { serviceAPI } from '../../../../../../store/service/service-api'
import { useFormContext } from 'react-hook-form'
import { CreateAppointmentFormData } from '../types'
import { ErrorMessage } from '../../../../../../components/feedback/ErrorMessage'
import { FaceFrownIcon } from '@heroicons/react/24/outline'
import CustomerHomeProfessionalCard from './CustomerHomeProfessionalCard'
import { professionalAPI } from '../../../../../../store/professional/professional-api'

interface Props {
  currentFlow: 'service' | 'professional'
}

function CustomerHomeSelectProfessionalContainer(props: Props) {
  const { register, watch, setValue } =
    useFormContext<CreateAppointmentFormData>()
  const serviceId = watch('serviceId')
  const serviceOfferedId = watch('serviceOfferedId')
  const professionalId = watch('professionalId')

  if (!serviceId && props.currentFlow === 'service') {
    toast.error(
      'Por favor, selecione um serviço para acessar a etapa de selecionar os profissionais',
    )

    return (
      <ErrorMessage
        message={
          'Por favor, selecione um serviço para acessar a etapa de selecionar os profissionais'
        }
      />
    )
  }

  const { data, isLoading, isError, error } =
    serviceAPI.useFetchProfessionalsOfferingServiceQuery(
      { serviceId },
      { skip: props.currentFlow !== 'service' },
    )

  const {
    data: professionalsData,
    isLoading: isLoadingProfessionals,
    isError: isErrorProfessionals,
    error: professionalsError,
  } = professionalAPI.useFetchProfessionalsQuery(
    {},
    { skip: props.currentFlow !== 'professional' },
  )

  if (isLoading || isLoadingProfessionals)
    return <BSBeautyLoading title="Carregando os profissionais..." />

  if (isError || isErrorProfessionals) {
    toast.error('Erro ao carregar dados')
    console.error(`Error trying to fetch services`, error || professionalsError)

    return (
      <ErrorMessage
        message={'Erro ao carregar informações. Tente novamente mais tarde.'}
      />
    )
  }

  const professionalsToShow =
    props.currentFlow === 'service'
      ? (data?.professionalsOfferingService.offers ?? [])
      : (professionalsData?.data.map((professional) => ({
        id: `${professional.id}`,
        professional,
      })) ?? [])

  if (professionalsToShow.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500">
        <FaceFrownIcon className="h-12 w-12 mb-2" />
        <p>Nenhum funcionário disponível</p>
        {props.currentFlow === 'service' && (
          <p className="text-sm">
            Este serviço não está sendo feito por nenhum funcionário no momento
          </p>
        )}
      </div>
    )
  }

  const fieldToRegister =
    props.currentFlow === 'service' ? 'serviceOfferedId' : 'professionalId'

  const fieldToCompare =
    props.currentFlow === 'service' ? serviceOfferedId : professionalId

  return (
    <>
      <Subtitle align="left" className="text-[#A4978A] font-medium">
        Escolha o profissional do seu agendamento:
      </Subtitle>

      {professionalsToShow &&
        professionalsToShow.map((offerOrProfessional) => {
          const professional = offerOrProfessional.professional

          return (
            <div key={`professional-${professional.id}`}>
              <input
                className="invisible"
                type="radio"
                id={offerOrProfessional.id}
                value={offerOrProfessional.id}
                {...register(fieldToRegister)}
              />
              <CustomerHomeProfessionalCard
                isSelected={fieldToCompare === offerOrProfessional.id}
                currentFlow={props.currentFlow}
                key={offerOrProfessional.id}
                for={offerOrProfessional.id}
                {...offerOrProfessional}
                onClick={() => setValue('professionalId', professional.id)}
              />
            </div>
          )
        })}
    </>
  )
}

export default CustomerHomeSelectProfessionalContainer
