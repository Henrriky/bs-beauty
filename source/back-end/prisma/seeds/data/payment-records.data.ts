import { faker } from '@faker-js/faker'

faker.seed(789)

export interface PaymentItemSeedData {
  quantity: number
  discount: number
  price: number
  offerInfo: {
    serviceName: string
    professionalName: string
  }
}

export interface PaymentRecordSeedData {
  totalValue: number
  paymentMethod: string
  customerEmail: string
  professionalName: string
  items: PaymentItemSeedData[]
  createdAt: Date
}

const PAYMENT_METHODS = [
  'Pix',
  'Dinheiro',
  'Cartão de Crédito',
  'Cartão de Débito',
  'Transferência Bancária'
]

const CUSTOMERS = [
  'ana.oliveira@example.com',
  'roberta.mendes@example.com',
  'patricia.santos@example.com',
  'rosemary.almeida@example.com',
  'maria.fernanda@example.com'
]

const PROFESSIONALS = [
  'Bruna Silva',
  'Camila Rodrigues Lima',
  'Fernanda Almeida Souza',
  'Henrique Santiago Pires',
  'Henrriky Jhonny',
  'Alyson Fumagalli',
  'Eliel da Silva',
  'Giovanna Camille',
  'Bruno Fischer'
]

const OFFERS = [
  { serviceName: 'Corte Feminino', professionalName: 'Bruna Silva', price: 90.0 },
  { serviceName: 'Manicure Completa', professionalName: 'Bruna Silva', price: 45.0 },
  { serviceName: 'Design de Sobrancelhas', professionalName: 'Bruna Silva', price: 40.0 },
  { serviceName: 'Manicure Completa', professionalName: 'Camila Rodrigues Lima', price: 40.0 },
  { serviceName: 'Manicure e Pedicure', professionalName: 'Camila Rodrigues Lima', price: 55.0 },
  { serviceName: 'Design de Sobrancelhas', professionalName: 'Fernanda Almeida Souza', price: 35.0 },
  { serviceName: 'Maquiagem Profissional', professionalName: 'Fernanda Almeida Souza', price: 150.0 },
  { serviceName: 'Corte Feminino', professionalName: 'Henrique Santiago Pires', price: 75.0 },
  { serviceName: 'Design de Sobrancelhas', professionalName: 'Henrique Santiago Pires', price: 30.0 },
  { serviceName: 'Corte Feminino', professionalName: 'Henrriky Jhonny', price: 70.0 },
  { serviceName: 'Manicure Completa', professionalName: 'Alyson Fumagalli', price: 38.0 },
  { serviceName: 'Design de Sobrancelhas', professionalName: 'Alyson Fumagalli', price: 28.0 },
  { serviceName: 'Manicure Completa', professionalName: 'Eliel da Silva', price: 42.0 },
  { serviceName: 'Corte Feminino', professionalName: 'Giovanna Camille', price: 85.0 },
  { serviceName: 'Manicure Completa', professionalName: 'Giovanna Camille', price: 43.0 },
  { serviceName: 'Corte Feminino', professionalName: 'Bruno Fischer', price: 78.0 },
  { serviceName: 'Escova Progressiva', professionalName: 'Bruno Fischer', price: 115.0 }
]

function generateRandomDate(startMonthsAgo: number, endMonthsAgo: number): Date {
  const now = new Date()
  const startDate = new Date(now)
  startDate.setMonth(now.getMonth() - startMonthsAgo)

  const endDate = new Date(now)
  endDate.setMonth(now.getMonth() - endMonthsAgo)

  return faker.date.between({ from: startDate, to: endDate })
}

function generatePaymentItems(professionalName: string, count: number): PaymentItemSeedData[] {
  const professionalOffers = OFFERS.filter(o => o.professionalName === professionalName)

  if (professionalOffers.length === 0) {
    return []
  }

  const items: PaymentItemSeedData[] = []
  const selectedOffers = faker.helpers.arrayElements(
    professionalOffers,
    Math.min(count, professionalOffers.length)
  )

  for (const offer of selectedOffers) {
    const quantity = faker.helpers.arrayElement([1, 1, 1, 2])
    const hasDiscount = faker.datatype.boolean(0.2)
    const discount = hasDiscount ? faker.helpers.arrayElement([5, 10, 15, 20]) : 0

    items.push({
      quantity,
      discount,
      price: offer.price,
      offerInfo: {
        serviceName: offer.serviceName,
        professionalName: offer.professionalName
      }
    })
  }

  return items
}

function calculateTotalValue(items: PaymentItemSeedData[]): number {
  return items.reduce((total, item) => {
    const itemTotal = item.price * item.quantity
    const discountAmount = (itemTotal * item.discount) / 100
    return total + (itemTotal - discountAmount)
  }, 0)
}

export function generatePaymentRecordsData(): PaymentRecordSeedData[] {
  const paymentRecords: PaymentRecordSeedData[] = []
  const maxRecords = 100

  for (let i = 0; i < maxRecords; i++) {
    const customerEmail = faker.helpers.arrayElement(CUSTOMERS)
    const professionalName = faker.helpers.arrayElement(PROFESSIONALS)
    const itemCount = faker.helpers.arrayElement([1, 1, 2, 2, 3])

    const items = generatePaymentItems(professionalName, itemCount)

    if (items.length === 0) {
      continue
    }

    const totalValue = calculateTotalValue(items)
    const paymentMethod = faker.helpers.arrayElement(PAYMENT_METHODS)
    const createdAt = generateRandomDate(6, 0)

    paymentRecords.push({
      totalValue,
      paymentMethod,
      customerEmail,
      professionalName,
      items,
      createdAt
    })
  }

  return paymentRecords
}
