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
import { Pagination } from '../../../../../../components/select/Pagination'
import { useState } from 'react'

interface Props {
  currentFlow: 'service' | 'professional'
}

function CustomerHomeSelectProfessionalContainer({ currentFlow }: Props) {
  const { register, watch, setValue } =
    useFormContext<CreateAppointmentFormData>()
  const serviceId = watch('serviceId')
  const serviceOfferedId = watch('serviceOfferedId')
  const professionalId = watch('professionalId')

  const [currentPage, setCurrentPage] = useState(1)
  const [pageLimit] = useState(10)

  if (!serviceId && currentFlow === 'service') {
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
      { serviceId: serviceId ?? '' },
      { skip: currentFlow !== 'service' },
    )

  const {
    data: professionalsData,
    isLoading: isLoadingProfessionals,
    isError: isErrorProfessionals,
    error: professionalsError,
  } = professionalAPI.useFetchProfessionalsQuery(
    { page: currentPage, limit: pageLimit },
    { skip: currentFlow !== 'professional' },
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
    currentFlow === 'service'
      ? data?.professionalsOfferingService.offers ?? []
      : professionalsData?.data.map((professional) => ({
        id: `${professional.id}`,
        professional,
      })) ?? []

  // Client-side pagination for professionalsOfferingService
  const paginatedProfessionals =
    currentFlow === 'service'
      ? professionalsToShow.slice(
        (currentPage - 1) * pageLimit,
        currentPage * pageLimit,
      )
      : professionalsToShow

  const totalPages =
    currentFlow === 'service'
      ? Math.ceil((professionalsToShow.length || 1) / pageLimit)
      : professionalsData?.totalPages

  if (paginatedProfessionals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500">
        <FaceFrownIcon className="h-12 w-12 mb-2" />
        <p>Nenhum funcionário disponível</p>
        {currentFlow === 'service' && (
          <p className="text-sm">
            Este serviço não está sendo feito por nenhum funcionário no momento
          </p>
        )}
      </div>
    )
  }

  const fieldToRegister =
    currentFlow === 'service' ? 'serviceOfferedId' : 'professionalId'

  const fieldToCompare =
    currentFlow === 'service' ? serviceOfferedId : professionalId

  return (
    <>
      <Subtitle align="left" className="text-[#A4978A] font-medium">
        Escolha o profissional do seu agendamento:
      </Subtitle>

      {paginatedProfessionals.map((offerOrProfessional) => {
        const professional = {
          ...offerOrProfessional.professional,
          paymentMethods:
            offerOrProfessional.professional.paymentMethods ?? undefined,
        }
        return (
          <div key={`professional-${professional.id}`}>
            <input
              className="invisible hidden"
              type="radio"
              id={offerOrProfessional.id}
              value={offerOrProfessional.id}
              {...register(fieldToRegister)}
            />
            <CustomerHomeProfessionalCard
              isSelected={fieldToCompare === offerOrProfessional.id}
              currentFlow={currentFlow}
              key={offerOrProfessional.id}
              for={offerOrProfessional.id}
              {...offerOrProfessional}
              professional={professional}
              onClick={() => {
                setValue('professionalId', professional.id)
                setValue('name', professional.name || 'Não definido')
                setValue('paymentMethods', professional.paymentMethods)
                setValue('professionalPhotoUrl', professional.profilePhotoUrl ?? '')
              }}
            />
          </div>
        )
      })}

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  )
}

export default CustomerHomeSelectProfessionalContainer
