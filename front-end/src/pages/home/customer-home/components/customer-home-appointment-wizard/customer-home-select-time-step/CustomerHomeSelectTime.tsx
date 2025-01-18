import { toast } from 'react-toastify'
import BSBeautyLoading from '../../../../../../components/feedback/Loading'
import Subtitle from '../../../../../../components/texts/Subtitle'
import { useFormContext } from 'react-hook-form'
import { CreateAppointmentFormData } from '../types'
import { ErrorMessage } from '../../../../../../components/feedback/ErrorMessage'
import { FaceFrownIcon } from '@heroicons/react/24/outline'
import CustomerHomeEmployeeCard from './CustomerHomeEmployeeCard'
import { offerAPI } from '../../../../../../store/offer/offer-api'
import { useState } from 'react'

function CustomerHomeSelectTimeContainer() {
  const { register, watch } = useFormContext<CreateAppointmentFormData>()
  const serviceOfferedId = watch('serviceOfferedId')
  const appointmentDate = watch('appointmentDate')

  const [dayToSchedulling, setDayToSchedulling] = useState()

  if (!serviceOfferedId) {
    toast.error(
      'Por favor, selecione um o serviço de um dos profissionais para acessar os horários',
    )

    return (
      <ErrorMessage
        message={
          'Por favor, selecione um o serviço de um dos profissionais para acessar os horários'
        }
      />
    )
  }

  const { data, isLoading, isError, error } =
    offerAPI.useFetchForAvailableSchedulesFromEmployeeOfferQuery({
      serviceOfferedId,
      dayToFetchAvailableSchedulling,
    })

  if (isLoading)
    return (
      <BSBeautyLoading title="Carregando os horários do funcionários escolhido..." />
    )

  if (isError) {
    toast.error('Erro ao carregar os horários do funcionário')
    console.error(`Error trying to fetch employee time`, error)

    return (
      <ErrorMessage
        message={'Erro ao carregar informações. Tente novamente mais tarde.'}
      />
    )
  }

  if (data?.employeesOfferingService?.offers.length === 0) {
    return (
      <ErrorMessage
        message={
          <>
            <FaceFrownIcon />
            Infelizmente, no momento não temos horários disponíveis para esse
            funcionário
          </>
        }
      />
    )
  }
  return (
    <>
      <Subtitle align="left" className="text-[#A4978A] font-medium">
        Escolha o seu melhor horário:
      </Subtitle>

      {data?.employeesOfferingService &&
        data.employeesOfferingService.offers.map((offer) => {
          return (
            <>
              <input
                className="invisible"
                type="radio"
                id={offer.id}
                value={offer.id}
                {...register('serviceOfferedId')}
              />
              <CustomerHomeEmployeeCard
                isSelected={serviceOfferedId === offer.id}
                key={offer.id}
                for={offer.id}
                {...offer}
              />
            </>
          )
        })}
    </>
  )
}

export default CustomerHomeSelectTimeContainer
