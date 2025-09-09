import {
  BanknotesIcon,
  CreditCardIcon,
  LinkIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline'

function PaymentMethods() {
  return (
    <div>
      <h2 className="text-primary-0 text-center mb-6">
        Formas de Pagamento Disponíveis
      </h2>
      <div className="grid grid-cols-2 gap-2 text-primary-100">
        <div className="bg-[#323131] flex items-center gap-4 rounded-xl p-2 transition-all hover:border-l-2 hover:text-orange-500 border-orange-800">
          <CreditCardIcon className="size-6" />
          <p>Cartão</p>
        </div>
        <div className="bg-[#323131] flex items-center gap-4 rounded-xl p-2 transition-all hover:border-l-2 hover:text-green-600 border-green-600">
          <BanknotesIcon className="size-6" />
          <p>Dinheiro</p>
        </div>
        <div className="bg-[#323131] flex items-center gap-4 rounded-xl p-2 transition-all hover:border-l-2 hover:text-violet-700 border-violet-900">
          <LinkIcon className="size-6" />
          <p>Link de Pagamento</p>
        </div>
        <div className="bg-[#323131] flex items-center gap-4 rounded-xl p-2 transition-all hover:border-l-2 hover:text-blue-400 border-blue-400">
          <QrCodeIcon className="size-6" />
          <p>Pix</p>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethods
