import { useState } from 'react'
import { customerAPI } from '../../../store/customer/customer-api'
import ComboBox from '../../../components/combobox/ComboBox'
import { Customer, Professional } from '../../../store/auth/types'
import { authAPI } from '../../../store/auth/auth-api'
import SelectServicesField from './SelectServicesField'
import { Button } from '../../../components/button/Button'
import ProfilePicture from '../../profile/components/ProfilePicture'
import {
  CreatePaymentRecordFormData,
  OnSubmitCreatePaymentRecordForm,
  paymentLabels,
} from '../types/types'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PaymentRecordSchemas } from '../../../utils/validation/zod-schemas/payment-record.zod-schemas.validation.utils'
import { paymentRecordAPI } from '../../../store/payment-record/payment-record-api'
import { toast } from 'react-toastify'
import { ErrorMessage } from '../../../components/feedback/ErrorMessage'
import useAppSelector from '../../../hooks/use-app-selector'

interface CreatePaymentRecordFormProps {
  closeModal: () => void
}

function CreatePaymentRecordForm({ closeModal }: CreatePaymentRecordFormProps) {
  const professionalId = useAppSelector(
    (state) => state.auth.user?.id as string,
  )

  const [customerQuery, setCustomerQuery] = useState('')
  const [paymentMethodQuery, setPaymentMethodQuery] = useState('')

  const user = authAPI.useFetchUserInfoQuery().data?.user as Professional
  const paymentMethods = user?.paymentMethods

  const { data } = customerAPI.useFetchCustomersQuery({
    page: 1,
    limit: 5,
  })

  const mappedPaymentMethods =
    paymentMethods?.map(({ name }) => ({
      name,
      label: paymentLabels[name] || name,
    })) ?? []

  const filteredCustomers =
    customerQuery === ''
      ? data?.data || []
      : (data?.data || []).filter((customer: Customer) =>
          customer.name?.toLowerCase().includes(customerQuery.toLowerCase()),
        )

  const filteredPaymentMethods =
    paymentMethodQuery === ''
      ? mappedPaymentMethods || []
      : (mappedPaymentMethods || []).filter((method) =>
          method.label
            ?.toLowerCase()
            .includes(paymentMethodQuery.toLowerCase()),
        )

  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
    setValue,
    watch,
  } = useForm<CreatePaymentRecordFormData>({
    resolver: zodResolver(PaymentRecordSchemas.createSchema),
    mode: 'onChange',
    defaultValues: {
      items: [{ offerId: '', quantity: 1, price: 0, discount: 0 }],
      customerId: '',
      paymentMethod: '',
      totalValue: 0,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const watchedItems = watch('items') || []

  const totalAmount = watchedItems.reduce((total, item) => {
    const itemTotal = item.price * item.quantity * (1 - item.discount / 100)
    return total + itemTotal
  }, 0)

  console.log(errors)

  const [createPaymentRecord, { isLoading }] =
    paymentRecordAPI.useCreatePaymentRecordMutation()

  const handleSubmitConcrete: OnSubmitCreatePaymentRecordForm = async (
    data,
  ) => {
    await createPaymentRecord(data)
      .unwrap()
      .then(() => {
        console.log('Payment record created successfully')
        toast.success('Registro de pagamento criado com sucesso!')
        closeModal()
      })
      .catch((error: unknown) => {
        console.error('Error trying to create payment record', error)
        toast.error('Ocorreu um erro ao criar o registro de pagamento.')
      })
  }

  return (
    <form
      className="w-full flex flex-col gap-4 animate-fadeIn"
      onSubmit={handleSubmit(handleSubmitConcrete)}
    >
      <input
        type="hidden"
        value={professionalId}
        {...register('professionalId')}
      />
      <input
        type="hidden"
        value={Number(totalAmount)}
        {...(register('totalValue'), { valueAsNumber: true })}
      />
      <Controller
        control={control}
        name="customerId"
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const selectedCustomer =
            filteredCustomers.find((customer) => customer.id === value) ?? null

          return (
            <div>
              <ComboBox
                value={selectedCustomer}
                onChange={(customer) => onChange(customer?.id ?? '')}
                id="select-customer"
                label="Cliente"
                placeholder="Buscar cliente..."
                wrapperClassName="w-full mb-2"
                options={filteredCustomers}
                setQuery={setCustomerQuery}
                displayValue={(option) => option?.name ?? ''}
                notFoundMessage="Cliente não encontrado"
                getOptionIcon={(option) => (
                  <ProfilePicture
                    profilePhotoUrl={option.profilePhotoUrl ?? ''}
                    size="sm"
                  />
                )}
              />
              {error && <ErrorMessage message={error.message} />}
            </div>
          )
        }}
      />
      <Controller
        control={control}
        name="paymentMethod"
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const selectedPaymentMethod =
            filteredPaymentMethods.find((method) => method.name === value) ??
            null

          return (
            <div>
              <ComboBox
                value={selectedPaymentMethod}
                onChange={(method) => onChange(method?.name ?? '')}
                id="select-payment-method"
                label="Método de pagamento"
                placeholder="Buscar método de pagamento..."
                wrapperClassName="w-full mb-2"
                options={filteredPaymentMethods}
                setQuery={setPaymentMethodQuery}
                displayValue={(option) => option?.label || ''}
                notFoundMessage="Método de pagamento não encontrado"
              />
              {error && <ErrorMessage message={error.message} />}
            </div>
          )
        }}
      />
      <SelectServicesField
        totalAmount={totalAmount}
        paymentItems={fields}
        appendItems={append}
        removeItems={remove}
        control={control}
        setValue={setValue}
      />
      <div className="flex justify-end gap-3">
        <Button label="Cancelar" variant="outline" onClick={closeModal} />
        <Button
          type="submit"
          label={
            isLoading ? (
              <div className="flex justify-center items-center gap-4">
                <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-white rounded-full animate-spin"></div>
                <p className="text-sm">Criando...</p>
              </div>
            ) : (
              'Criar registro de pagamento'
            )
          }
          disabled={isLoading}
        />
      </div>
    </form>
  )
}

export default CreatePaymentRecordForm
