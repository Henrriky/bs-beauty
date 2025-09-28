import { AppointmentSchemas } from '../../../utils/validation/zod-schemas/appointment.zod-schemas.validation.utils'
import { Status } from '../../../store/appointment/types'
import { Input } from '../../../components/inputs/Input'
import { Formatter } from '../../../utils/formatter/formatter.util'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AppointmentDetailsComponentProps,
  CustomerUpdateAppointmentFormData,
} from '../types'
import { DateTime } from 'luxon'
import { Button } from '../../../components/button/Button'
import Title from '../../../components/texts/Title'
import {
  BriefcaseIcon,
  CalendarDaysIcon,
  CameraIcon,
  ChatBubbleOvalLeftIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  UserIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import RatingModal from './RatingModal'
import { ratingAPI } from '../../../store/rating/rating-api'
import { useEffect, useState } from 'react'
import { RatingUI } from './RatingUI'

const actionToOperations = {
  edit: {
    operations: [
      {
        name: 'Cancelar agendamento',
        value: Status.CANCELLED,
        style: 'border-[#7a3d3d]',
        Icon: XCircleIcon,
        status: Status.CANCELLED,
      },
    ],
  },
  view: {
    operations: [],
  },
}

function CustomerAppointmentDetails(props: AppointmentDetailsComponentProps) {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const [rating, setRating] = useState(0)

  const ratingId = props.appointment.rating?.id

  const { data: ratingData, isSuccess } = ratingAPI.useGetRatingByIdQuery(
    ratingId!,
    {
      skip: !ratingId,
    },
  )

  useEffect(() => {
    if (isSuccess) {
      const ratingScore = ratingData?.score

      if (ratingScore === null || ratingScore === undefined) {
        setModalIsOpen(true)
      } else if (ratingScore > 0 && ratingScore < 6) {
        setRating(ratingScore)
      }
    }
  }, [isSuccess, ratingData])

  const operationInformations = actionToOperations[props.action]
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CustomerUpdateAppointmentFormData>({
    resolver: zodResolver(AppointmentSchemas.customerUpdateSchema),
    defaultValues: {
      observation: props.appointment?.observation ?? '',
    },
  })

  const appointmentDateOnLocalZone = DateTime.fromISO(
    props.appointment.appointmentDate,
  ).setZone('local')

  return (
    <>
      <Title align="left">Detalhes do Agendamento</Title>
      <form
        className="flex flex-col gap-4 w-full my-8 px-1"
        onSubmit={handleSubmit(props.handleSubmitConcrete)}
      >
        <Input
          label={
            <p className="flex gap-1 items-center">
              <UserIcon className="size-5" />
              Profissional
            </p>
          }
          id="professional"
          type="text"
          variant="solid"
          value={
            props.appointment.offer?.professional?.name ??
            'Funcionário não definido'
          }
          disabled
        />

        <Input
          label={
            <p className="flex gap-1 items-center">
              <BriefcaseIcon className="size-5" />
              Serviço
            </p>
          }
          id="service"
          type="text"
          variant="solid"
          value={props.appointment.offer.service.name}
          disabled
        />
        <Input
          label={
            <p className="flex gap-1 items-center">
              <CurrencyDollarIcon className="size-5" />
              Valor
            </p>
          }
          id="price"
          type="text"
          variant="solid"
          value={new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(Number(props.appointment.offer.price))}
          disabled
        />
        <Input
          label={
            <p className="flex gap-1 items-center">
              <CalendarDaysIcon className="size-5" />
              Data
            </p>
          }
          id="date"
          type="text"
          variant="solid"
          value={`${appointmentDateOnLocalZone
            .setLocale('pt-BR')
            .toFormat("dd 'de' MMMM 'às' HH:mm")}`}
          disabled
        />
        <Input
          label={
            <p className="flex gap-1 items-center">
              <InformationCircleIcon className="size-5" />
              Status
            </p>
          }
          id="status"
          type="text"
          variant="solid"
          value={Formatter.formatApplicationStatusToPrettyRepresentation(
            props.appointment.status,
          )}
          disabled
        />
        <Input
          label={
            <p className="flex gap-1 items-center">
              <CameraIcon className="size-5" />
              Uso de imagem
            </p>
          }
          id="imageUse"
          type="text"
          variant="solid"
          value={Formatter.formatImageUsageToPrettyRepresentation(
            props.appointment.allowImageUse,
          )}
          disabled
        />
        <Input
          registration={{ ...register('observation') }}
          label={
            <p className="flex gap-1 items-center">
              <ChatBubbleOvalLeftIcon className="size-5" />
              Observação
            </p>
          }
          id="observation"
          type="text"
          variant="solid"
          placeholder={
            props.action !== 'view'
              ? 'Escreva algo que você deseja que o profissional veja'
              : ''
          }
          disabled={props.action === 'view'}
          error={errors?.observation?.message?.toString()}
        />
        <div className="flex gap-2 flex-grow mb-4">
          {operationInformations.operations.map((operation, index) => {
            return (
              <Button
                label={
                  props.handleSubmitConcreteIsLoading ? (
                    <div className="flex justify-center items-center gap-4">
                      <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-white rounded-full animate-spin"></div>
                      <p className="flex gap-1 items-center justify-center">
                        {operation.name}
                      </p>
                    </div>
                  ) : (
                    <div className={`flex items-center justify-center gap-2`}>
                      {<operation.Icon className="size-5" />}
                      {operation.name}
                    </div>
                  )
                }
                key={index}
                className={`${operation.style}`}
                borderColor={operation.style}
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  setValue('status', operation.value)
                  handleSubmit(props.handleSubmitConcrete)()
                }}
                disabled={props.handleSubmitConcreteIsLoading}
              />
            )
          })}
        </div>
        {ratingData?.score && (
          <RatingUI
            score={ratingData?.score}
            hover={ratingData?.score}
            isInteractive={false}
            commentValue={ratingData.comment}
            userType={'customer'}
          />
        )}
        {props.action !== 'view' && (
          <Button
            type="submit"
            label={
              props.handleSubmitConcreteIsLoading ? (
                <div className="flex justify-center items-center gap-4">
                  <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-white rounded-full animate-spin"></div>
                  <p className="text-sm">Salvar</p>
                </div>
              ) : (
                'Salvar'
              )
            }
            disabled={props.handleSubmitConcreteIsLoading}
          />
        )}
      </form>
      {ratingId && (
        <RatingModal
          isOpen={modalIsOpen}
          onClose={() => {
            setModalIsOpen(false)
          }}
          ratingId={ratingId}
          appointmentId={props.appointment.id}
        />
      )}
    </>
  )
}

export default CustomerAppointmentDetails
