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

  const { data } = paymentRecordAPI.useGetPaymentRecordsByProfessionalIdQuery({
    professionalId: userId,
  })

  const paymentRecords = data ? [...data] : []

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Title align="left">Registro de Pagamentos</Title>
        <Subtitle align="left">
          Confira registros de pagamentos passados ou crie novos registros.
        </Subtitle>
      </div>
      <div className="flex flex-col">
        {paymentRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500 gap-2">
            <span className="text-4xl">💸</span>
            <span className="text-lg font-semibold">
              Nenhum pagamento registrado ainda.
            </span>
            <span className="text-sm">
              Clique no botão abaixo para criar o primeiro registro!
            </span>
          </div>
        ) : (
          paymentRecords
            ?.map((record, index) => {
              return (
                <PaymentRecordCard
                  key={index}
                  paymentRecord={record}
                  index={paymentRecords.length - index}
                />
              )
            })
            .reverse()
        )}
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
