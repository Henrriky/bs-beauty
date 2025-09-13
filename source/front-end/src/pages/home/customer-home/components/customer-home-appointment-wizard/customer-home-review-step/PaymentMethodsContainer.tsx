import {
  BanknotesIcon,
  BuildingLibraryIcon,
  CircleStackIcon,
  CreditCardIcon,
  LinkIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline'
import PaymentMethodCard from './PaymentMethodCard'

const knownPaymentMethods = new Map<
  string,
  React.ComponentType<{ className?: string }>
>([
  ['bank-transfer', BuildingLibraryIcon],
  ['cash', BanknotesIcon],
  ['credit-card', CreditCardIcon],
  ['debit-card', CreditCardIcon],
  ['payment-link', LinkIcon],
  ['pix', QrCodeIcon],
])

const paymentMethodNames: { [key: string]: string } = {
  'bank-transfer': 'Transferência',
  cash: 'Dinheiro',
  'credit-card': 'Cartão de Crédito',
  'debit-card': 'Cartão de Crédito',
  'payment-link': 'Link de Pagamento',
  pix: 'Pix',
}

function getPaymentMethodName(methodKey: string): string {
  return paymentMethodNames[methodKey] || methodKey
}

interface PaymentMethodsList {
  methods: {
    name: string
  }[]
}

function PaymentMethodsContainer({ methods }: PaymentMethodsList) {
  return (
    <div>
      <h2 className="text-primary-0 text-center mb-6">
        Formas de Pagamento Disponíveis
      </h2>
      <div className="grid grid-cols-2 gap-2 text-primary-100">
        {methods.map((method) => {
          const IconComponent = knownPaymentMethods.get(method.name)
          return IconComponent ? (
            <PaymentMethodCard
              icon={IconComponent}
              name={getPaymentMethodName(method.name)}
            />
          ) : (
            <PaymentMethodCard
              icon={CircleStackIcon}
              name={getPaymentMethodName(method.name)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default PaymentMethodsContainer
