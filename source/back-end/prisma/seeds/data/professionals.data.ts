import { faker } from '@faker-js/faker'
import { UserType } from '@prisma/client'

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
  socialMedia: {
    instagram?: string
    facebook?: string
    whatsapp?: string
  } | null
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

function generatePhoneNumber(): string {
  const ddd = faker.helpers.arrayElement(['11', '21', '31', '41', '51', '61', '71', '81'])
  const prefix = '9' + faker.string.numeric(4)
  const suffix = faker.string.numeric(4)
  return `(55) ${ddd} ${prefix}-${suffix}`
}

function generateInstagramHandle(name: string): string {
  const cleanName = name.toLowerCase().replace(/\s+/g, '')
  const suffix = faker.helpers.arrayElement(['beauty', 'hair', 'nails', 'makeup', 'style', ''])
  return `@${cleanName}${suffix}`
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
    const firstName = prof.name.split(' ')[0].toLowerCase()
    const isCommissioned = faker.datatype.boolean(0.5)
    const commissionRate = isCommissioned
      ? parseFloat(faker.number.float({ min: 0.15, max: 0.4, fractionDigits: 2 }).toFixed(4))
      : null

    professionals.push({
      name: prof.name,
      email: prof.email,
      passwordHash: prof.passwordHash,
      googleId: prof.googleId,
      specialization: prof.specialization,
      contact: generatePhoneNumber(),
      paymentMethods: faker.helpers.arrayElement(paymentMethodOptions),
      isCommissioned,
      commissionRate,
      socialMedia: {
        instagram: generateInstagramHandle(firstName),
        whatsapp: generatePhoneNumber()
      },
      registerCompleted: true,
      userType: UserType.MANAGER
    })
  }

  for (const prof of requiredProfessionals) {
    const firstName = prof.name.split(' ')[0].toLowerCase()
    const isCommissioned = faker.datatype.boolean(0.7)
    const commissionRate = isCommissioned
      ? parseFloat(faker.number.float({ min: 0.15, max: 0.4, fractionDigits: 2 }).toFixed(4))
      : null

    professionals.push({
      name: prof.name,
      email: prof.email,
      passwordHash: prof.passwordHash,
      googleId: prof.googleId,
      specialization: prof.specialization,
      contact: generatePhoneNumber(),
      paymentMethods: faker.helpers.arrayElement(paymentMethodOptions),
      isCommissioned,
      commissionRate,
      socialMedia: {
        instagram: generateInstagramHandle(firstName),
        whatsapp: generatePhoneNumber()
      },
      registerCompleted: true,
      userType: 'PROFESSIONAL'
    })
  }

  // Profissionais adicionais (fictícios)
  const additionalNames = [
    'Ana Carolina Santos',
    'Camila Rodrigues Lima',
    'Daniel Costa Oliveira',
    'Fernanda Almeida Souza',
    'Gabriel Martins Pereira',
    'Isabella Ferreira Santos',
    'João Pedro Ribeiro',
    'Larissa Mendes Costa',
    'Marcos Vinícius Dias'
  ]

  const additionalSpecializations = [
    'Cortes e Escovação',
    'Manicure e Pedicure',
    'Designer de Sobrancelhas',
    'Maquiagem Profissional',
    'Depilação',
    'Extensão de Cílios',
    'Penteados e Noivas',
    'Tratamentos Capilares',
    'Barbeiro'
  ]

  for (let i = 0; i < additionalNames.length; i++) {
    const name = additionalNames[i]
    const firstName = name.split(' ')[0].toLowerCase()
    const lastName = name.split(' ').pop()?.toLowerCase() || ''
    const email = `${firstName}.${lastName}@bsbeauty.com`
    const specialization = additionalSpecializations[i]
    const isCommissioned = faker.datatype.boolean(0.7)
    const commissionRate = isCommissioned
      ? parseFloat(faker.number.float({ min: 0.15, max: 0.4, fractionDigits: 2 }).toFixed(4))
      : null

    professionals.push({
      name,
      email,
      passwordHash: '$2b$10$jL/UoBjQ2w31M29iLvwyK.kLqBuD2PSL86JJbXm3GOFUIrgA1o5vS',
      specialization,
      contact: generatePhoneNumber(),
      paymentMethods: faker.helpers.arrayElement(paymentMethodOptions),
      isCommissioned,
      commissionRate,
      socialMedia: {
        instagram: generateInstagramHandle(firstName),
        whatsapp: generatePhoneNumber()
      },
      registerCompleted: true,
      userType: 'PROFESSIONAL'
    })
  }

  return professionals
}
