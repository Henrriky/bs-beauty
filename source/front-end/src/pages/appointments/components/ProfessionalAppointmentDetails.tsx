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
  ChatBubbleOvalLeftIcon,
  CheckIcon,
  CurrencyDollarIcon,
  EllipsisHorizontalIcon,
  InformationCircleIcon,
  UserIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { customerAPI } from '../../../store/customer/customer-api'

const actionToOperations = {
  edit: {
    operations: [
      {
        name: 'Cancelar agendamento',
        value: Status.CANCELLED,
        style:
          'border-secondary-200 hover:border-red-700 hover:text-red-700 hover:font-semibold',
        Icon: XCircleIcon,
        status: Status.CANCELLED,
      },
      {
        name: 'Confirmar agendamento',
        value: Status.CONFIRMED,
        style:
          'border-secondary-200 hover:border-blue-500 hover:text-blue-500 hover:font-semibold',
        Icon: CalendarDaysIcon,
        status: Status.CONFIRMED,
      },
      {
        name: 'Agendamento Concluído',
        value: Status.FINISHED,
        style:
          'border-secondary-200 hover:border-green-500 hover:text-green-500 hover:font-semibold',
        Icon: CheckIcon,
        status: Status.FINISHED,
      },
      {
        name: 'Agendamento Pendente',
        value: Status.PENDING,
        style:
          'border-secondary-200 hover:border-yellow-500 hover:text-yellow-500 hover:font-semibold',
        Icon: EllipsisHorizontalIcon,
        status: Status.PENDING,
      },
    ],
  },
  view: {
    operations: [],
  },
}

function ProfessionalAppointmentDetails(
  props: AppointmentDetailsComponentProps,
) {
  const { data: customerData } = customerAPI.useGetCustomerByIdQuery(
    props.appointment.customerId,
  )

  const operationInformations = actionToOperations[props.action]
  const { register, handleSubmit, setValue } =
    useForm<CustomerUpdateAppointmentFormData>({
      resolver: zodResolver(AppointmentSchemas.professionalUpdateSchema),
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
              Cliente
            </p>
          }
          id="client"
          type="text"
          variant="solid"
          value={customerData?.name ?? ''}
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
              ? 'Observações do cliente aparecerão aqui'
              : ''
          }
          disabled
        />
        <div className="gap-2 mb-4 grid-cols-2 grid">
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
      </form>
    </>
  )
}

export default ProfessionalAppointmentDetails
