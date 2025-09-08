import { useFormContext } from 'react-hook-form'
import { CreateAppointmentFormData } from '../types'
import { serviceAPI } from '../../../../../../store/service/service-api'

function CustomerHomeReviewStep() {
  const { watch } = useFormContext<CreateAppointmentFormData>()

  const serviceId = watch('serviceId')

  const { data: serviceData } = serviceAPI.useGetServiceByIdQuery(serviceId)

  return (
    <div className="p-8 rounded-lg space-y-4 bg-[#262626]">
      <h2 className="text-xl font-semibold text-secondary-200 border-b pb-2">
        Revise seu Agendamento
      </h2>
      <div className="space-y-2 flex flex-col gap-4">
        <p className="text-primary-100">
          <span className="font-medium text-primary-0">Serviço:</span>{' '}
          {serviceData?.name || 'Não selecionado'}
        </p>
        <p className="text-primary-100">
          <span className="font-medium text-primary-0">Descrição:</span>{' '}
          {serviceData?.description || 'Não selecionado'}
        </p>
      </div>
    </div>
  )
}

export default CustomerHomeReviewStep
