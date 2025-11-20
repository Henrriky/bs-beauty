import { useNavigate, useParams } from 'react-router'
import { Button } from '../../../components/button/Button'
import { paymentRecordAPI } from '../../../store/payment-record/payment-record-api'
import { toast } from 'react-toastify'
import Modal from '../../../components/modal/Modal'

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
    <Modal
      isOpen={isOpen}
      onClose={setIsOpen}
      title="Excluir Registro de Pagamento"
      size="md"
    >
      <div className="flex flex-col gap-4 p-6 space-y-2 items-center">
        <h3 className="text-lg font-medium text-primary-0">
          Deseja excluir o registro?
        </h3>
        <p className="text-base text-secondary-200">
          Esta ação <span className="font-bold">não</span> poderá ser desfeita.
        </p>
        <div className="w-full flex gap-5">
          <Button label="Cancelar" variant="outline" onClick={setIsOpen} />
          <Button
            label="Excluir"
            className="!bg-red-600 hover:!bg-red-700"
            onClick={() => {
              handleDelete(paymentRecordId ?? '')
              navigate('/payments')
            }}
          />
        </div>
      </div>
    </Modal>
  )
}

export default DeletePaymentRecordModal
