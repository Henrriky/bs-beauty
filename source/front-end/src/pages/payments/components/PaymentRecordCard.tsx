import { DateTime } from 'luxon'
import { PaymentRecord } from '../../../store/payment-record/types'
import { customerAPI } from '../../../store/customer/customer-api'
import { BanknotesIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface PaymentRecordCardProps {
  paymentRecord: PaymentRecord
  index: number
}

function PaymentRecordCard({ paymentRecord, index }: PaymentRecordCardProps) {
  const { data: customer } = customerAPI.useGetCustomerByIdQuery(
    paymentRecord.customerId,
  )

  return (
    <div className="p-4 mb-4 bg-[#222222] text-primary-0 rounded-lg shadow-md relative flex flex-col gap-2">
      <div className="flex w-full items-center gap-2">
        <BanknotesIcon className="size-6" />
        <p className="font-medium text-xl">Registro #{index}</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm">
          Cliente: {''}
          <span className="text-primary-200">{customer?.name}</span>
        </p>
        <p className="text-sm w-full">
          Valor Total: {''}
          <span className="text-primary-200">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(Number(paymentRecord.totalValue))}
          </span>
        </p>
        <p className="text-sm">
          Método de Pagamento: {''}
          <span className="text-primary-200">
            {paymentRecord.paymentMethod}
          </span>
        </p>
        <p className="text-sm">
          Data do Registro: {''}
          <span className="text-primary-200">
            {DateTime.fromISO(paymentRecord.createdAt)
              .setZone('local')
              .toFormat('dd/MM/yy - HH:mm')}
          </span>
        </p>
      </div>
      <MagnifyingGlassIcon
        className="size-5 text-primary-100 absolute right-4 hover:size-6 hover:text-primary-0 hover:cursor-pointer transition-all"
        title="Visualizar"
      />
    </div>
  )
}

export default PaymentRecordCard
