import {
  BanknotesIcon,
  BriefcaseIcon,
  CreditCardIcon,
  LinkIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline'
import PaymentMethodCard from './PaymentMethodCard'

const knownPaymentMethods = new Map<
  string,
  React.ComponentType<{ className?: string }>
>([
  ['card', CreditCardIcon],
  ['cash', BanknotesIcon],
  ['payment-link', LinkIcon],
  ['pix', QrCodeIcon],
  ['credit-card', CreditCardIcon],
  ['bank-slip', BriefcaseIcon],
])

const paymentMethodNames: { [key: string]: string } = {
  card: 'Cartão de Crédito',
  cash: 'Dinheiro',
  'payment-link': 'Link de Pagamento',
  pix: 'Pix',
  'bank-slip': 'Boleto Bancario',
  'credit-card': 'Cartão de Crédito',
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
          ) : null
        })}
      </div>
    </div>
  )
}

export default PaymentMethodsContainer
