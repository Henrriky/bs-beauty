import { useState } from 'react'
import { customerAPI } from '../../../store/customer/customer-api'
import ComboBox from '../../../components/combobox/ComboBox'
import { Customer, Professional } from '../../../store/auth/types'
import { authAPI } from '../../../store/auth/auth-api'
import SelectServicesField from './SelectServicesField'
import { Button } from '../../../components/button/Button'
import ProfilePicture from '../../profile/components/ProfilePicture'

interface CreatePaymentRecordFormProps {
  cancelAction: () => void
}

function CreatePaymentRecordForm({
  cancelAction,
}: CreatePaymentRecordFormProps) {
  const [customerQuery, setCustomerQuery] = useState('')
  const [paymentMethodQuery, setPaymentMethodQuery] = useState('')

  const user = authAPI.useFetchUserInfoQuery().data?.user as Professional
  const paymentMethods = user?.paymentMethods

  const { data } = customerAPI.useFetchCustomersQuery({
    page: 1,
    limit: 5,
  })

  const filteredCustomers =
    customerQuery === ''
      ? data?.data || []
      : (data?.data || []).filter((customer: Customer) =>
          customer.name?.toLowerCase().includes(customerQuery.toLowerCase()),
        )

  const filteredPaymentMethods =
    paymentMethodQuery === ''
      ? paymentMethods || []
      : (paymentMethods || []).filter((method) =>
          method.name?.toLowerCase().includes(paymentMethodQuery.toLowerCase()),
        )

  return (
    <form className="w-full flex flex-col gap-4 animate-fadeIn">
      <ComboBox
        id="select-customer"
        type="text"
        label="Cliente"
        placeholder="Buscar cliente..."
        wrapperClassName="w-full"
        options={filteredCustomers}
        setQuery={setCustomerQuery}
        getOptionLabel={(option) => option?.name}
        getOptionValue={(option) => option}
        notFoundMessage="Cliente não encontrado"
        getOptionIcon={(option) => (
          <ProfilePicture
            profilePhotoUrl={option.profilePhotoUrl ?? ''}
            size="sm"
          />
        )}
      />
      <ComboBox
        id="select-payment-method"
        type="text"
        label="Método de pagamento"
        placeholder="Buscar método de pagamento..."
        wrapperClassName="w-full"
        options={filteredPaymentMethods}
        setQuery={setPaymentMethodQuery}
        getOptionLabel={(option) => option?.name}
        getOptionValue={(option) => option}
        notFoundMessage="Método de pagamento não encontrado"
      />
      <SelectServicesField />
      <div className="flex justify-end gap-3">
        <Button label="Cancelar" variant="outline" onClick={cancelAction} />
        <Button label="Criar registro de pagamento" />
      </div>
    </form>
  )
}

export default CreatePaymentRecordForm
