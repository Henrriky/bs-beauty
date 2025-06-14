import { AppointmentServiceSchemas } from '../../../utils/validation/zod-schemas/appointment-service.zod-schemas.validation.util'
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
  CurrencyDollarIcon,
  InformationCircleIcon,
  UserIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

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
  const operationInformations = actionToOperations[props.action]
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CustomerUpdateAppointmentFormData>({
    resolver: zodResolver(AppointmentServiceSchemas.customerUpdateSchema),
    defaultValues: {
      observation: props.appointmentService?.observation ?? '',
    },
  })

  const appointmentDateOnLocalZone = DateTime.fromISO(
    props.appointmentService.appointmentDate,
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
          value={props.appointmentService.serviceOffered.employee.name ?? ''}
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
          value={props.appointmentService.serviceOffered.service.name}
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
          }).format(Number(props.appointmentService.serviceOffered.price))}
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
            props.appointmentService.status,
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
    </>
  )
}

export default CustomerAppointmentDetails
