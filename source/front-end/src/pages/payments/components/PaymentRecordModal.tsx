import Modal from '../../../components/modal/Modal'
import CreatePaymentRecordForm from './CreatePaymentRecordForm'

interface PaymentRecordModalProps {
  isOpen: boolean
  setIsOpen: () => void
}

function PaymentRecordModal({ isOpen, setIsOpen }: PaymentRecordModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={setIsOpen}
      title="Novo Registro de Pagamento"
      size="lg"
    >
      <CreatePaymentRecordForm closeModal={setIsOpen} />
    </Modal>
  )
}

export default PaymentRecordModal
