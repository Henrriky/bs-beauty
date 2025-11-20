import { faker } from '@faker-js/faker'
import { UserType } from '@prisma/client'
import { generatePhoneNumber } from './utils/utils'

faker.seed(123)

interface RequiredProfessional {
  name: string
  email: string
  specialization: string | null
  googleId: string | null
  passwordHash: string | null
  userType: UserType
}

export interface ProfessionalSeedData {
  name: string
  email: string
  passwordHash: string | null
  googleId?: string | null
  specialization: string | null
  contact: string
  paymentMethods: { name: string }[]
  isCommissioned: boolean
  commissionRate: number | null
  socialMedia: Array<{
    name: string
    url: string
  }> | null
  registerCompleted: boolean
  userType: UserType
}

const paymentMethodOptions = [
  [{ 'name': 'pix' }, { 'name': 'cash' }],
  [{ 'name': 'pix' }, { 'name': 'credit-card' }, { 'name': 'cash' }],
  [{ 'name': 'pix' }, { 'name': 'credit-card' }, { 'name': 'debit-card' }, { 'name': 'cash' }],
  [{ 'name': 'pix' }, { 'name': 'cash' }, { 'name': 'credit-card' }],
  [{ 'name': 'pix' }, { 'name': 'debit-card' }, { 'name': 'cash' }],
  [{ 'name': 'pix' }, { 'name': 'credit-card' }, { 'name': 'debit-card' }, { 'name': 'bank-transfer' }],
  [{ 'name': 'pix' }]
]

function generateInstagramHandle(name: string): string {
  const cleanName = name.toLowerCase().replace(/\s+/g, '')
  const suffix = faker.helpers.arrayElement(['beauty', 'hair', 'nails', 'makeup', 'style', ''])
  return `https://instagram.com/${cleanName}${suffix}`
}

function createProfessionalData(
  prof: RequiredProfessional,
  userType: UserType,
  commissionProbability: number
): ProfessionalSeedData {
  const firstName = prof.name.split(' ')[0].toLowerCase()
  const isCommissioned = faker.datatype.boolean(commissionProbability)
  const commissionRate = isCommissioned
    ? parseFloat(faker.number.float({ min: 0.15, max: 0.4, fractionDigits: 2 }).toFixed(4))
    : null

  return {
    name: prof.name,
    email: prof.email,
    passwordHash: prof.passwordHash,
    googleId: prof.googleId,
    specialization: prof.specialization,
    contact: generatePhoneNumber(),
    paymentMethods: faker.helpers.arrayElement(paymentMethodOptions),
    isCommissioned,
    commissionRate,
    socialMedia: [
      {
        name: 'Instagram',
        url: generateInstagramHandle(firstName)
      }
    ],
    registerCompleted: true,
    userType
  }
}

export function generateProfessionalsData(): ProfessionalSeedData[] {
  const professionals: ProfessionalSeedData[] = []

  const requiredProfessionals: RequiredProfessional[] = [
    {
      name: 'Alyson Fumagalli',
      email: 'alyson.fumagalli@bsbeauty.com',
      specialization: null,
      googleId: null,
      passwordHash: '$2b$10$jL/UoBjQ2w31M29iLvwyK.kLqBuD2PSL86JJbXm3GOFUIrgA1o5vS',
      userType: UserType.MANAGER
    },
    {
      name: 'Bruna Silva',
      email: 'bruna.silva@bsbeauty.com',
      specialization: 'Cortes e Escovação',
      googleId: null,
      passwordHash: '$2b$10$jL/UoBjQ2w31M29iLvwyK.kLqBuD2PSL86JJbXm3GOFUIrgA1o5vS',
      userType: UserType.MANAGER
    },
    {
      name: 'Bruno Fischer',
      email: 'bruno.fischer@bsbeauty.com',
      specialization: null,
      googleId: null,
      passwordHash: '$2b$10$jL/UoBjQ2w31M29iLvwyK.kLqBuD2PSL86JJbXm3GOFUIrgA1o5vS',
      userType: UserType.MANAGER
    },
    {
      name: 'Eliel da Silva',
      email: 'eliel.silva@bsbeauty.com',
      specialization: null,
      googleId: null,
      passwordHash: '$2b$10$jL/UoBjQ2w31M29iLvwyK.kLqBuD2PSL86JJbXm3GOFUIrgA1o5vS',
      userType: UserType.MANAGER
    },
    {
      name: 'Giovanna Camille',
      email: 'giovanna.camille@bsbeauty.com',
      specialization: null,
      googleId: null,
      passwordHash: '$2b$10$jL/UoBjQ2w31M29iLvwyK.kLqBuD2PSL86JJbXm3GOFUIrgA1o5vS',
      userType: UserType.MANAGER
    },
    {
      name: 'Henrique Santiago Pires',
      email: 'henrique.pires@bsbeauty.com',
      specialization: null,
      googleId: null,
      passwordHash: '$2b$10$jL/UoBjQ2w31M29iLvwyK.kLqBuD2PSL86JJbXm3GOFUIrgA1o5vS',
      userType: UserType.MANAGER
    },
    {
      name: 'Henrriky Jhonny',
      email: 'henrriky.jhonny@bsbeauty.com',
      specialization: null,
      googleId: null,
      passwordHash: '$2b$10$jL/UoBjQ2w31M29iLvwyK.kLqBuD2PSL86JJbXm3GOFUIrgA1o5vS',
      userType: UserType.MANAGER
    },
  ]

  for (const prof of requiredProfessionals) {
    professionals.push(createProfessionalData(prof, UserType.MANAGER, 0.5))
  }

  for (const prof of requiredProfessionals) {
    professionals.push(createProfessionalData(prof, 'PROFESSIONAL' as UserType, 0.7))
  }

  const additionalProfessionals = [
    { name: 'Ana Carolina Santos', specialization: 'Cortes e Escovação' },
    { name: 'Camila Rodrigues Lima', specialization: 'Manicure e Pedicure' },
    { name: 'Fernanda Almeida Souza', specialization: 'Maquiagem Profissional' },
    { name: 'Isabella Ferreira Santos', specialization: 'Extensão de Cílios' },
    { name: 'Larissa Mendes Costa', specialization: 'Tratamentos Capilares' }
  ]

  for (const { name, specialization } of additionalProfessionals) {
    const firstName = name.split(' ')[0].toLowerCase()
    const lastName = name.split(' ').pop()?.toLowerCase() || ''
    const email = `${firstName}.${lastName}@bsbeauty.com`

    professionals.push(
      createProfessionalData(
        {
          name,
          email,
          specialization,
          googleId: null,
          passwordHash: '$2b$10$jL/UoBjQ2w31M29iLvwyK.kLqBuD2PSL86JJbXm3GOFUIrgA1o5vS',
          userType: 'PROFESSIONAL' as UserType
        },
        'PROFESSIONAL' as UserType,
        0.7
      )
    )
  }

  return professionals
}

