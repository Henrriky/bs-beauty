import { useFormContext } from 'react-hook-form'
import { CreateAppointmentFormData } from '../types'
import { serviceAPI } from '../../../../../../store/service/service-api'
import ProfilePicture from '../../../../../profile/components/ProfilePicture'

function CustomerHomeReviewStep() {
  const { watch } = useFormContext<CreateAppointmentFormData>()

  const serviceId = watch('serviceId')

  if (!serviceId)
    return <div className="text-red-600 text-xl">Ocorreu um erro!</div>

  const { data: serviceData } = serviceAPI.useGetServiceByIdQuery(serviceId)
  const professionalName = watch('professionalName')
  const professionalPhotoUrl = watch('professionalPhotoUrl')
  const appointmentDateValue = watch('appointmentDate')
  const durationInMinutes = watch('estimatedTime')
  const price = watch('price')

  const initialDate = appointmentDateValue
    ? new Date(appointmentDateValue)
    : null
  const isDateValid = initialDate && !isNaN(initialDate.getTime())
  const finishTime =
    isDateValid && typeof durationInMinutes === 'number'
      ? addMinutes(initialDate, durationInMinutes)
      : null

  function addMinutes(date: Date, minutes: number) {
    const newDate = new Date(date)
    newDate.setMinutes(newDate.getMinutes() + minutes)
    return newDate
  }

  const formattedDate = isDateValid
    ? initialDate.toLocaleString('pt-BR', {
        dateStyle: 'long',
      })
    : 'Nenhuma data selecionada'

  const startTime = isDateValid
    ? initialDate.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--:--'

  const finishTimeFormatted = finishTime
    ? finishTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--:--'

  return (
    <div className="p-8 rounded-lg space-y-4 bg-[#262626]">
      <h2 className="text-xl font-semibold text-secondary-200 border-b pb-2">
        Revise seu Agendamento
      </h2>
      <div className="space-y-2 flex flex-col gap-4">
        <div className="flex gap-4 ">
          <ProfilePicture
            size="md"
            variation="square-with-bg"
            profilePhotoUrl={
              professionalPhotoUrl ||
              'https://cdn-site-assets.veed.io/cdn-cgi/image/width=256,quality=75,format=auto/Fish_6e8d209905/Fish_6e8d209905.webp'
            }
          />
          <p className="text-primary-100 flex items-center">
            {professionalName || 'Desconhecido '}
          </p>
        </div>
        <p className="text-primary-100">
          <span className="font-medium text-primary-0">Serviço:</span>{' '}
          {serviceData?.name || 'Não selecionado'}
        </p>
        <p className="text-primary-100">
          <span className="font-medium text-primary-0">Descrição:</span>{' '}
          {serviceData?.description || 'Não selecionado'}
        </p>
        <p className="text-primary-100">
          <span className="font-medium text-primary-0">Data:</span>{' '}
          {formattedDate}
        </p>
        <p className="text-primary-100">
          <span className="font-medium text-primary-0">Horário:</span>{' '}
          {startTime} às {finishTimeFormatted}
        </p>
        <p className="text-primary-100">
          <span className="font-medium text-primary-0">Preço:</span> R${' '}
          {price?.toFixed(2)}
        </p>
      </div>
    </div>
  )
}

export default CustomerHomeReviewStep
