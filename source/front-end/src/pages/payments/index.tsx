import { useEffect, useState } from 'react'
import Subtitle from '../../components/texts/Subtitle'
import Title from '../../components/texts/Title'
import useAppSelector from '../../hooks/use-app-selector'
import { paymentRecordAPI } from '../../store/payment-record/payment-record-api'
import PaymentRecordCard from './components/PaymentRecordCard'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import PaymentRecordModal from './components/PaymentRecordModal'
import { Button } from '../../components/button/Button'
import { PaymentRecord } from '../../store/payment-record/types'
import { ErrorMessage } from '../../components/feedback/ErrorMessage'
import { toast } from 'react-toastify'

function PaymentRecords() {
  const [isOpen, setIsOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [allPaymentRecords, setAllPaymentRecords] = useState<PaymentRecord[]>(
    [],
  )

  const user = useAppSelector((state) => state.auth.user!)
  const userId = user.id

  const { data, isLoading, isError, error } =
    paymentRecordAPI.useGetPaymentRecordsByProfessionalIdQuery({
      professionalId: userId,
      page,
      limit: 3,
    })

  useEffect(() => {
    if (data?.data) {
      setAllPaymentRecords((prev) => {
        const newUsers = data.data.filter(
          (emp) => !prev.some((e) => e.id === emp.id),
        )
        return [...prev, ...newUsers]
      })
    }
  }, [data])

  if (isError) {
    toast.error('Erro ao carregar a lista de clientes')
    console.error(error)

    return (
      <ErrorMessage message="Erro ao carregar informações. Tente novamente mais tarde." />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Title align="left">Registro de Pagamentos</Title>
        <Subtitle align="left">
          Confira registros de pagamentos passados ou crie novos registros.
        </Subtitle>
      </div>
      <div className="flex flex-col max-h-[70vh] overflow-y-auto ">
        {allPaymentRecords.length === 0 ? (
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
          allPaymentRecords?.map((record, index) => {
            return (
              <PaymentRecordCard
                key={index}
                paymentRecord={record}
                index={index + 1}
              />
            )
          })
        )}
        <Button
          label={isLoading ? 'Carregando...' : 'Carregar mais'}
          variant="text-only"
          className="text-[18px] self-center"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={isLoading}
        />
      </div>
      <PlusCircleIcon
        className="size-12 stroke-primary-100 self-center hover:stroke-primary-0 hover:cursor-pointer hover:size-14 transition-all"
        title="Criar novo registro"
        onClick={() => setIsOpen(true)}
      />
      <PaymentRecordModal
        isOpen={isOpen}
        setIsOpen={() => setIsOpen(!isOpen)}
      />
    </div>
  )
}

export default PaymentRecords
