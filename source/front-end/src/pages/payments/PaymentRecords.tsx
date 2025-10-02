import { useState } from 'react'
import Subtitle from '../../components/texts/Subtitle'
import Title from '../../components/texts/Title'
import useAppSelector from '../../hooks/use-app-selector'
import { paymentRecordAPI } from '../../store/payment-record/payment-record-api'
import PaymentRecordCard from './components/PaymentRecordCard'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import PaymentRecordModal from './components/PaymentRecordModal'

function PaymentRecords() {
  const [isOpen, setIsOpen] = useState(false)

  const user = useAppSelector((state) => state.auth.user!)
  const userId = user.id

  const { data: paymentRecordsData } =
    paymentRecordAPI.useGetPaymentRecordsByProfessionalIdQuery({
      professionalId: userId,
    })

  const sortedPaymentRecords = paymentRecordsData
    ? [...paymentRecordsData].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    : []

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Title align="left">Registro de Pagamentos</Title>
        <Subtitle align="left">
          Confira registros de pagamentos passados ou crie novos registros.
        </Subtitle>
      </div>
      <div className="flex flex-col">
        {sortedPaymentRecords?.map((record, index) => {
          return (
            <PaymentRecordCard
              key={index}
              paymentRecord={record}
              index={sortedPaymentRecords.length - index}
            />
          )
        })}
        <PlusCircleIcon
          className="size-12 stroke-primary-100 self-center hover:stroke-primary-0 hover:cursor-pointer hover:size-14 transition-all"
          title="Criar novo registro"
          onClick={() => setIsOpen(true)}
        />
      </div>
      <PaymentRecordModal
        isOpen={isOpen}
        setIsOpen={() => setIsOpen(!isOpen)}
      />
    </div>
  )
}

export default PaymentRecords
