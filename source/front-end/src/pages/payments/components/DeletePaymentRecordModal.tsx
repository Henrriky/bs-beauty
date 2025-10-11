import { useNavigate, useParams } from 'react-router'
import { Button } from '../../../components/button/Button'
import Title from '../../../components/texts/Title'
import { paymentRecordAPI } from '../../../store/payment-record/payment-record-api'
import { toast } from 'react-toastify'

interface DeletePaymentRecordModalProps {
  isOpen: boolean
  setIsOpen: () => void
}

function DeletePaymentRecordModal({
  isOpen,
  setIsOpen,
}: DeletePaymentRecordModalProps) {
  const navigate = useNavigate()
  const { paymentRecordId } = useParams()
  const [deletePaymentRecord] =
    paymentRecordAPI.useDeletePaymentRecordMutation()
  const utils = paymentRecordAPI.util

  const handleDelete = async (paymentRecordId: string) => {
    try {
      await deletePaymentRecord(paymentRecordId).unwrap()
      toast.success('Registro de pagamento deletado com sucesso!')
      utils.invalidateTags(['PaymentRecords'])
    } catch (error) {
      console.log('Erro ao deletar o registro de pagamento:', error)
      toast.error('Ocorreu um erro ao tentar deletar o registro de pagamento.')
    }
  }
  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 flex justify-center items-center animate-fadeIn z-[1000] transition-colors ${isOpen ? 'visible bg-black/60' : 'invisible'} animate-d`}
          onClick={setIsOpen}
        >
          <div
            className="bg-[#1E1E1E] rounded-2xl shadow p-6 w-full max-w-[480px] max-h-screen flex flex-col justify-center items-center gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <Title align="center">Deseja excluir o registro?</Title>
            <p className="text-lg text-secondary-200">
              Esta ação <span className="font-bold">não</span> poderá ser
              desfeita.
            </p>
            <div className="w-full flex gap-5">
              <Button label="Cancelar" variant="outline" onClick={setIsOpen} />
              <Button
                label="Excluir"
                onClick={() => {
                  handleDelete(paymentRecordId ?? '')
                  navigate('/payments')
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DeletePaymentRecordModal
