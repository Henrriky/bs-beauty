import { toast } from 'react-toastify'
import BSBeautyLoading from '../../../../../../components/feedback/Loading'
import Subtitle from '../../../../../../components/texts/Subtitle'
import { serviceAPI } from '../../../../../../store/service/service-api'
import { useFormContext } from 'react-hook-form'
import { CreateAppointmentFormData } from '../types'
import { ErrorMessage } from '../../../../../../components/feedback/ErrorMessage'
import { FaceFrownIcon } from '@heroicons/react/24/outline'
import CustomerHomeEmployeeCard from './CustomerHomeEmployeeCard'

function CustomerHomeSelectEmployeeContainer() {
  const { register, watch, setValue } =
    useFormContext<CreateAppointmentFormData>()
  const serviceId = watch('serviceId')
  const serviceOfferedId = watch('serviceOfferedId')

  if (!serviceId) {
    toast.error(
      'Por favor, selecione um serviço para acessar a etapa de selecionar os funcionários',
    )

    return (
      <ErrorMessage
        message={
          'Por favor, selecione um serviço para acessar a etapa de selecionar os funcionários'
        }
      />
    )
  }

  const { data, isLoading, isError, error } =
    serviceAPI.useFetchEmployeesOfferingServiceQuery({
      serviceId,
    })

  if (isLoading)
    return (
      <BSBeautyLoading title="Carregando os funcionários que oferecem o serviço escolhido..." />
    )

  if (isError) {
    toast.error('Erro ao carregar os serviços')
    console.error(`Error trying to fetch services`, error)

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
            Infelizmente, no momento não temos funcionários oferecendo esse
            serviço
          </>
        }
      />
    )
  }
  return (
    <>
      <Subtitle align="left" className="text-[#A4978A] font-medium">
        Escolha o profissional do seu agendamento:
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
                onClick={() => setValue('employeeId', offer.employee.id)}
              />
            </>
          )
        })}
    </>
  )
}

export default CustomerHomeSelectEmployeeContainer
