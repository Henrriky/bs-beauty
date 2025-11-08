import { faker } from '@faker-js/faker'

faker.seed(456)

export interface CustomerSeedData {
  name: string
  email: string
  passwordHash: string
  phone: string
  birthdate: Date
  registerCompleted: boolean
  userType: 'CUSTOMER'
  referralCount: number
  alwaysAllowImageUse: boolean
  discoverySource: 'INSTAGRAM' | 'REFERRAL' | 'GOOGLE' | 'WHATSAPP'
  notificationPreference: 'IN_APP' | 'ALL' | 'NONE'
}

export function generateCustomersData(): CustomerSeedData[] {
  const customers: CustomerSeedData[] = []

  const customersInfo = [
    {
      name: 'Johnata Souza',
      email: 'johnata.santicioli@example.com',
      phone: '+55 11 92001-0001',
      discoverySource: 'WHATSAPP' as const
    },
    {
      name: 'Marcelo Tavares',
      email: 'marcelo.tavares@example.com',
      phone: '(55) 11 92001-0002',
      discoverySource: 'INSTAGRAM' as const
    },
    {
      name: 'Ana Beatriz Oliveira',
      email: 'ana.oliveira@example.com',
      phone: '(55) 11 92001-0003',
      discoverySource: 'GOOGLE' as const
    },
    {
      name: 'Roberta Carlos Mendes',
      email: 'roberta.mendes@example.com',
      phone: '(55) 11 92001-0004',
      discoverySource: 'REFERRAL' as const
    },
    {
      name: 'Patricia Silva Santos',
      email: 'patricia.santos@example.com',
      phone: '(55) 11 92001-0005',
      discoverySource: 'GOOGLE' as const
    },
    {
      name: 'Rosemary Almeida',
      email: 'rosemary.almeida@example.com',
      phone: '(55) 11 92001-0006',
      discoverySource: 'GOOGLE' as const
    },
    {
      name: 'Maria Fernanda',
      email: 'maria.fernanda@example.com',
      phone: '(55) 11 92001-0007',
      discoverySource: 'GOOGLE' as const
    },
  ]

  for (const info of customersInfo) {
    customers.push({
      name: info.name,
      email: info.email,
      passwordHash: '$2b$10$jL/UoBjQ2w31M29iLvwyK.kLqBuD2PSL86JJbXm3GOFUIrgA1o5vS',
      phone: info.phone,
      birthdate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      registerCompleted: true,
      userType: 'CUSTOMER',
      referralCount: faker.number.int({ min: 0, max: 5 }),
      alwaysAllowImageUse: faker.datatype.boolean(0.6),
      discoverySource: info.discoverySource,
      notificationPreference: faker.helpers.arrayElement(['IN_APP', 'ALL', 'NONE'])
    })
  }

  return customers
}
