import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '../../components/button/Button'
import { ErrorMessage } from '../../components/feedback/ErrorMessage'
import useAppSelector from '../../hooks/use-app-selector'
import { PageHeader } from '../../layouts/PageHeader'
import { paymentRecordAPI } from '../../store/payment-record/payment-record-api'
import { PaymentRecord } from '../../store/payment-record/types'
import PaymentRecordCard from './components/PaymentRecordCard'
import PaymentRecordModal from './components/PaymentRecordModal'

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
    if (!data?.data) return

    const paymentData = data.data

    const isFirstPage = page === 1
    if (isFirstPage) {
      setAllPaymentRecords(paymentData)
      return
    }

    setAllPaymentRecords((prev) => {
      const newRecords = paymentData.filter(
        (record) => !prev.some((existing) => existing.id === record.id),
      )
      return [...prev, ...newRecords]
    })
  }, [data, page])

  if (isError) {
    toast.error('Erro ao carregar a lista de clientes')
    console.error(error)

    return (
      <ErrorMessage message="Erro ao carregar informações. Tente novamente mais tarde." />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Registros de Pagamentos"
        subtitle="Gerencie os registros de pagamentos dos seus serviços aqui."
      />
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
                key={record.id}
                paymentRecord={record}
                index={index + 1}
              />
            )
          })
        )}
        {data && data.page < data.totalPages && (
          <Button
            label={isLoading ? 'Carregando...' : 'Carregar mais'}
            variant="text-only"
            className="text-[18px] self-center"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={isLoading}
          />
        )}
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
