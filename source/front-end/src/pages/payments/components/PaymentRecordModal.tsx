import Title from '../../../components/texts/Title'
import CreatePaymentRecordForm from './CreatePaymentRecordForm'

interface PaymentRecordModalProps {
  isOpen: boolean
  setIsOpen: () => void
}

function PaymentRecordModal({ isOpen, setIsOpen }: PaymentRecordModalProps) {
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
            <Title align="center">Registrar Novo Pagamento</Title>
            <CreatePaymentRecordForm closeModal={setIsOpen} />
          </div>
        </div>
      )}
    </>
  )
}

export default PaymentRecordModal
