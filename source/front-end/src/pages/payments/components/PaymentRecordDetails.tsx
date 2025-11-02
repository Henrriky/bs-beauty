import Title from '../../../components/texts/Title'
import { Button } from '../../../components/button/Button'
import { useEffect, useState } from 'react'
import DeletePaymentRecordModal from './DeletePaymentRecordModal'
import { CreditCardIcon, UserIcon } from '@heroicons/react/24/outline'
import ComboBox from '../../../components/combobox/ComboBox'
import { customerAPI } from '../../../store/customer/customer-api'
import { Customer, Professional } from '../../../store/auth/types'
import ProfilePicture from '../../profile/components/ProfilePicture'
import {
  OnSubmitUpdatePaymentRecordForm,
  paymentLabels,
  UpdatePaymentRecordFormData,
} from '../types/types'
import { authAPI } from '../../../store/auth/auth-api'
import { useParams } from 'react-router'
import { paymentRecordAPI } from '../../../store/payment-record/payment-record-api'
import SelectServicesField from './SelectServicesField'
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PaymentRecordSchemas } from '../../../utils/validation/zod-schemas/payment-record.zod-schemas.validation.utils'
import { toast } from 'react-toastify'
import { OptionIcon } from '../../../components/combobox/OptionIcon'

function PaymentRecordDetails() {
  const { paymentRecordId } = useParams()
  const paymentRecord = paymentRecordAPI.useGetPaymentRecordByIdQuery(
    paymentRecordId ?? '',
  )

  const methods = useForm<UpdatePaymentRecordFormData>({
    resolver: zodResolver(PaymentRecordSchemas.updateSchema),
    defaultValues: {
      customerId: paymentRecord.data?.customerId,
      paymentMethod: paymentRecord.data?.paymentMethod,
      items: paymentRecord.data?.items,
    },
  })

  const customer = customerAPI.useGetCustomerByIdQuery(
    paymentRecord.data?.customerId ?? '',
  )

  const [isOpen, setIsOpen] = useState(false)

  const { data: customerData } = customerAPI.useFetchCustomersQuery({
    page: 1,
    limit: 5,
  })

  const [customerQuery, setCustomerQuery] = useState('')

  const filteredCustomers =
    customerQuery === ''
      ? customerData?.data || []
      : (customerData?.data || []).filter((customer: Customer) =>
          customer.name?.toLowerCase().includes(customerQuery.toLowerCase()),
        )

  const user = authAPI.useFetchUserInfoQuery().data?.user as Professional
  const paymentMethods = user?.paymentMethods
  const [paymentMethodQuery, setPaymentMethodQuery] = useState('')

  const mappedPaymentMethods =
    paymentMethods?.map(({ name }) => ({
      name,
      label: paymentLabels[name] || name,
    })) ?? []

  const filteredPaymentMethods =
    paymentMethodQuery === ''
      ? mappedPaymentMethods.map((method) => method.label) || []
      : (mappedPaymentMethods || [])
          .filter((method) =>
            method.label
              ?.toLowerCase()
              .includes(paymentMethodQuery.toLowerCase()),
          )
          .map((method) => method.label)

  const watchedItems = methods.watch('items') || []

  const totalAmount = watchedItems.reduce((total, item) => {
    const itemTotal = item.price * item.quantity * (1 - item.discount / 100)
    return total + itemTotal
  }, 0)

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'items',
  })

  const [updatePaymentRecord, { isLoading }] =
    paymentRecordAPI.useUpdatePaymentRecordMutation()

  console.log(methods.watch('items'))

  const handleSubmitConcrete: OnSubmitUpdatePaymentRecordForm = async (
    data,
  ) => {
    const sanitizedData = {
      ...data,
      items: data.items?.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    }
    await updatePaymentRecord({
      id: paymentRecordId ?? '',
      data: sanitizedData,
    })
      .unwrap()
      .then(() => {
        console.log('Payment record updated successfully')
        toast.success('Registro de pagamento atualizado com sucesso!')
      })
      .catch((error: unknown) => {
        console.error('Error trying to create payment record', error)
        toast.error('Ocorreu um erro ao criar o registro de pagamento.')
      })
  }

  console.log('Errors: ', methods.formState.errors)

  useEffect(() => {
    if (paymentRecord.data) {
      const cleanItems =
        paymentRecord.data.items?.map((item) => ({
          id: item.id,
          offerId: item.offerId,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
        })) ?? []

      methods.reset({
        customerId: paymentRecord.data.customerId,
        paymentMethod: paymentRecord.data.paymentMethod,
        items: cleanItems,
      })
    }
  }, [paymentRecord.data, methods])

  return (
    <div className="flex flex-col gap-10">
      <Title align="left">Detalhes do Pagamento</Title>
      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-7"
          onSubmit={methods.handleSubmit(handleSubmitConcrete)}
        >
          <input
            type="hidden"
            {...methods.register('totalValue', { valueAsNumber: true })}
            value={totalAmount}
          />

          <Controller
            control={methods.control}
            name="customerId"
            render={({ field: { onChange, value } }) => {
              const selectedCustomer =
                filteredCustomers.find((customer) => customer.id === value) ??
                null

              return (
                <ComboBox
                  value={selectedCustomer || customer.data}
                  onChange={(customer) => onChange(customer?.id ?? '')}
                  id="select-customer"
                  options={filteredCustomers}
                  notFoundMessage="Cliente não encontrado"
                  displayValue={(option) => option?.name ?? ''}
                  label={
                    <div className="flex items-center gap-1">
                      <UserIcon className="size-5" />
                      Cliente
                    </div>
                  }
                  getOptionIcon={(option) => (
                    <OptionIcon
                      profilePhotoUrl={option?.profilePhotoUrl ?? ''}
                    />
                  )}
                  setQuery={setCustomerQuery}
                />
              )
            }}
          />
          <Controller
            control={methods.control}
            name="paymentMethod"
            render={({ field: { onChange, value } }) => {
              const selectedPaymentMethod =
                filteredPaymentMethods.find((method) => method === value) ??
                null

              return (
                <ComboBox
                  value={
                    selectedPaymentMethod || paymentRecord.data?.paymentMethod
                  }
                  onChange={(method) => onChange(method ?? '')}
                  id="select-payment-method"
                  wrapperClassName="w-full mb-2"
                  options={filteredPaymentMethods}
                  setQuery={setPaymentMethodQuery}
                  displayValue={(option) => option ?? ''}
                  notFoundMessage="Método de pagamento não encontrado"
                  label={
                    <div className="flex items-center gap-1">
                      <CreditCardIcon className="size-5" />
                      Método de pagamento
                    </div>
                  }
                />
              )
            }}
          />
          <SelectServicesField
            totalAmount={totalAmount}
            paymentItems={fields}
            appendItems={append}
            removeItems={remove}
            comboboxInputWidth="w-[280px]"
          />
          <div className="flex gap-5 w-">
            <Button
              label="Excluir registro de pagamento"
              variant="outline"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="border-secondary-200 hover:border-red-700 hover:text-red-700 hover:font-semibold"
            />
            <Button
              label={
                isLoading ? (
                  <div className="flex justify-center items-center gap-4">
                    <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-white rounded-full animate-spin"></div>
                    <p className="text-sm">Salvando...</p>
                  </div>
                ) : (
                  'Salvar alterações'
                )
              }
              disabled={isLoading}
              type="submit"
            />
          </div>
        </form>
      </FormProvider>
      <DeletePaymentRecordModal
        isOpen={isOpen}
        setIsOpen={() => setIsOpen(!isOpen)}
      />
    </div>
  )
}

export default PaymentRecordDetails
