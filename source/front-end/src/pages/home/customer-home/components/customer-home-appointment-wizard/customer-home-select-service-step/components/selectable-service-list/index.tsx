/* eslint-disable react-hooks/rules-of-hooks */
import { FaceFrownIcon } from '@heroicons/react/24/outline'
import { useFormContext } from 'react-hook-form'
import { SchedullingFlows } from '../..'
import { ServicesOfferedByProfessionalOffer } from '../../../../../../../../store/professional/types'
import { Service } from '../../../../../../../../store/service/types'
import { CreateAppointmentFormData } from '../../../types'
import CustomerHomeServiceCard from './components/CustomerHomeServiceCard'

interface SelectableServiceListProps {
  currentFlow: SchedullingFlows
  services:
    | {
        id: string
        service: Service
      }[]
    | ServicesOfferedByProfessionalOffer[]
}

function SelectableServiceList({
  services,
  currentFlow,
}: SelectableServiceListProps) {
  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-4 text-gray-500">
        <FaceFrownIcon className="h-12 w-12 mb-2" />
        <p>Nenhum serviço encontrado</p>
        {currentFlow === 'professional' && (
          <p className="text-sm">
            Este funcionário não possui serviços cadastrados
          </p>
        )}
      </div>
    )
  }

  const { register, watch, setValue } =
    useFormContext<CreateAppointmentFormData>()
  const serviceSelectedId = watch('serviceId')
  const serviceOfferedId = watch('serviceOfferedId')

  const fieldToRegister =
    currentFlow === 'service' ? 'serviceId' : 'serviceOfferedId'

  const fieldToCompare =
    currentFlow === 'service' ? serviceSelectedId : serviceOfferedId

  return services.map((service) => {
    const serviceOffered = service.service
    return (
      <div key={`service-label-${service.id}`} className="relative">
        <input
          className="invisible absolute"
          type="radio"
          id={service.id}
          value={service.id}
          {...register(fieldToRegister)}
        />
        <CustomerHomeServiceCard
          isSelected={fieldToCompare === service.id}
          currentFlow={currentFlow}
          key={service.id}
          for={service.id}
          {...service}
          onClick={() => setValue('serviceId', serviceOffered.id)}
        />
      </div>
    )
  })
}

export default SelectableServiceList
