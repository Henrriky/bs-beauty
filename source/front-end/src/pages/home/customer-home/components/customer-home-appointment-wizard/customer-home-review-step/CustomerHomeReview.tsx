import { useFormContext } from 'react-hook-form'
import { CreateAppointmentFormData } from '../types'
import { serviceAPI } from '../../../../../../store/service/service-api'
import ProfilePicture from '../../../../../profile/components/ProfilePicture'
import PaymentMethodsContainer from './PaymentMethodsContainer'
import { customerAPI } from '../../../../../../store/customer/customer-api'
import { useEffect, useState } from 'react'
import ExclamationMarkIcon from '../../../../../../assets/exclamation-mark.svg'
import Modal from '../../../../../services/components/Modal'
import { Button } from '../../../../../../components/button/Button'
import Subtitle from '../../../../../../components/texts/Subtitle'


function CustomerHomeReviewStep() {
  const { watch, setValue } = useFormContext<CreateAppointmentFormData>()
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

  const serviceId = watch('serviceId')
  const professionalName = watch('name')
  const professionalPhotoUrl = watch('professionalPhotoUrl')
  const appointmentDateValue = watch('appointmentDate')
  const durationInMinutes = watch('estimatedTime')
  const price = watch('price')
  const paymentMethods = watch('paymentMethods')
  const customerId = watch('customerId')
  const allowImageUse = watch('allowImageUse')

  const { data: serviceData } = serviceAPI.useGetServiceByIdQuery(serviceId, {
    skip: !serviceId,
  })

  const { data: customerData } = customerAPI.useGetCustomerByIdQuery(
    customerId,
    {
      skip: !customerId,
    },
  )

  const alwaysAllowImageUse = customerData?.alwaysAllowImageUse

  useEffect(() => {
    if (alwaysAllowImageUse === false) setModalIsOpen(true)

    if (alwaysAllowImageUse === true) setValue('allowImageUse', true)
  }, [alwaysAllowImageUse, setValue])

  if (!serviceId)
    return <div className="text-red-600 text-xl">Ocorreu um erro!</div>

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
      <div className="space-y-2 flex flex-col gap-4 pb-10">
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
      {paymentMethods && paymentMethods.length > 0 && (
        <PaymentMethodsContainer methods={paymentMethods} />
      )}
      <Modal
        className="bg-[#54493F] font-normal relative"
        isOpen={modalIsOpen}
        onClose={() => {
          setModalIsOpen(false)
        }}
      >
        <img
          src={ExclamationMarkIcon}
          alt="Ícone de seta"
          className="absolute -top-[40px] max-w-[150px] max-h-[150px]"
        />
        <div className="flex flex-col items-center justify-between h-full pt-8 pb-4">
          <div className="flex-grow flex flex-col items-center justify-center gap-2">
            <Subtitle className="text-[#B5B5B5]" align="center">
              Deseja permitir o uso de sua imagem? Podemos fazer fotos ou vídeos para divulgação do Salão.
            </Subtitle>
            <Subtitle className="text-primary-100 text-sm" align="center">
              Você também pode desativar essa mensagem alterando as opções na aba Perfil.
            </Subtitle>
          </div>
          <div className="flex gap-2 justify-between w-full">
            <Button
              className="transition-all bg-[#A4978A] text-[#54493F] font-medium hover:bg-[#4e483f] hover:text-white"
              label={'Sim'}
              id={'agree'}
              onClick={() => {
                setModalIsOpen(false)
                setValue('allowImageUse', true)
              }}
            />
            <Button
              className="transition-all bg-[#A4978A] text-[#54493F] font-medium hover:bg-[#4e483f] hover:text-white"
              label={'Não'}
              id={'disagree'}
              onClick={() => {
                setModalIsOpen(false)
                setValue('allowImageUse', false)
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CustomerHomeReviewStep
