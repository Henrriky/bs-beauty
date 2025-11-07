import { faker } from '@faker-js/faker'

faker.seed(456)

export interface AppointmentSeedData {
  observation: string | null
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FINISHED'
  appointmentDate: Date
  allowImageUse: boolean
  customerEmail: string
  serviceName: string
  professionalName: string
}

export function generateAppointmentsData(): AppointmentSeedData[] {
  const appointments: AppointmentSeedData[] = []

  const STATUS_DISTRIBUTION = {
    PENDING: 0.25,    // 25%
    CONFIRMED: 0.35,  // 35%
    CANCELLED: 0.15,  // 15%
    FINISHED: 0.25    // 25%
  }

  const validOffers = [
    { professionalName: 'Henrique Santiago Pires', serviceName: 'Corte Feminino' },
    { professionalName: 'Henrriky Jhonny', serviceName: 'Corte Feminino' },
    { professionalName: 'Alyson Fumagalli', serviceName: 'Manicure Completa' },
    { professionalName: 'Eliel da Silva', serviceName: 'Manicure Completa' },
    { professionalName: 'Henrique Santiago Pires', serviceName: 'Design de Sobrancelhas' },
    { professionalName: 'Alyson Fumagalli', serviceName: 'Design de Sobrancelhas' }
  ]

  const customerEmails = [
    'ana.oliveira@example.com',
    'roberto.mendes@example.com',
    'patricia.santos@example.com'
  ]

  const statuses: Array<'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FINISHED'> = [
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'FINISHED'
  ]

  const getWeightedStatus = (): 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FINISHED' => {
    const random = Math.random()
    let cumulative = 0

    for (const [status, weight] of Object.entries(STATUS_DISTRIBUTION)) {
      cumulative += weight
      if (random <= cumulative) {
        return status as 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FINISHED'
      }
    }

    return 'PENDING'
  }

  const observations = [
    null,
    null,
    null,
    'Cliente preferencial, atendimento VIP',
    'Primeira vez no salão',
    'Cliente solicitou profissional específico',
    'Agendamento de retorno'
  ]

  const today = new Date()
  const todayHours = [12, 14, 16, 18]

  for (let i = 0; i < 4; i++) {
    const offer = faker.helpers.arrayElement(validOffers)
    const customerEmail = faker.helpers.arrayElement(customerEmails)
    const status = faker.helpers.arrayElement(statuses)

    const appointmentDate = new Date(today)
    appointmentDate.setUTCHours(todayHours[i], faker.helpers.arrayElement([0, 15, 30, 45]), 0, 0)

    appointments.push({
      observation: faker.helpers.arrayElement(observations),
      status,
      appointmentDate,
      allowImageUse: faker.datatype.boolean(0.3),
      customerEmail,
      serviceName: offer.serviceName,
      professionalName: offer.professionalName
    })
  }

  const previousMonthStatuses: Array<'CANCELLED' | 'FINISHED'> = ['CANCELLED', 'FINISHED']

  for (let i = 0; i < 10; i++) {
    const offer = faker.helpers.arrayElement(validOffers)
    const customerEmail = faker.helpers.arrayElement(customerEmails)
    const status = faker.helpers.arrayElement(previousMonthStatuses)

    const appointmentDate = new Date(today)
    appointmentDate.setMonth(appointmentDate.getMonth() - 1)
    appointmentDate.setDate(faker.number.int({ min: 1, max: 28 }))

    const hour = faker.number.int({ min: 12, max: 20 })
    const minute = faker.helpers.arrayElement([0, 15, 30, 45])
    appointmentDate.setUTCHours(hour, minute, 0, 0)

    appointments.push({
      observation: faker.helpers.arrayElement(observations),
      status,
      appointmentDate,
      allowImageUse: faker.datatype.boolean(0.3),
      customerEmail,
      serviceName: offer.serviceName,
      professionalName: offer.professionalName
    })
  }

  for (let i = 0; i < 15; i++) {
    const offer = faker.helpers.arrayElement(validOffers)
    const customerEmail = faker.helpers.arrayElement(customerEmails)
    const status = getWeightedStatus()

    const appointmentDate = new Date(today)
    appointmentDate.setDate(faker.number.int({ min: 1, max: 30 }))

    const hour = faker.number.int({ min: 12, max: 20 })
    const minute = faker.helpers.arrayElement([0, 15, 30, 45])
    appointmentDate.setUTCHours(hour, minute, 0, 0)

    appointments.push({
      observation: faker.helpers.arrayElement(observations),
      status,
      appointmentDate,
      allowImageUse: faker.datatype.boolean(0.3),
      customerEmail,
      serviceName: offer.serviceName,
      professionalName: offer.professionalName
    })
  }

  const nextMonthStatuses: Array<'PENDING' | 'CONFIRMED'> = ['PENDING', 'CONFIRMED']

  for (let i = 0; i < 10; i++) {
    const offer = faker.helpers.arrayElement(validOffers)
    const customerEmail = faker.helpers.arrayElement(customerEmails)
    const status = faker.helpers.arrayElement(nextMonthStatuses)

    const appointmentDate = new Date(today)
    appointmentDate.setMonth(appointmentDate.getMonth() + 1)
    appointmentDate.setDate(faker.number.int({ min: 1, max: 28 }))

    const hour = faker.number.int({ min: 12, max: 20 })
    const minute = faker.helpers.arrayElement([0, 15, 30, 45])
    appointmentDate.setUTCHours(hour, minute, 0, 0)

    appointments.push({
      observation: faker.helpers.arrayElement(observations),
      status,
      appointmentDate,
      allowImageUse: faker.datatype.boolean(0.3),
      customerEmail,
      serviceName: offer.serviceName,
      professionalName: offer.professionalName
    })
  }

  appointments.sort((a, b) => a.appointmentDate.getTime() - b.appointmentDate.getTime())

  return appointments
}
