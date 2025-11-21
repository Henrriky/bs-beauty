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
    // Privileged professional - Bruna Silva (best ratings - score 5)
    { professionalName: 'Bruna Silva', serviceName: 'Corte Feminino' },
    { professionalName: 'Bruna Silva', serviceName: 'Corte Feminino' },
    { professionalName: 'Bruna Silva', serviceName: 'Corte Feminino' },
    { professionalName: 'Bruna Silva', serviceName: 'Manicure Completa' },
    { professionalName: 'Bruna Silva', serviceName: 'Manicure Completa' },
    { professionalName: 'Bruna Silva', serviceName: 'Design de Sobrancelhas' },
    { professionalName: 'Bruna Silva', serviceName: 'Design de Sobrancelhas' },
    // Primary professionals - higher appointment volume
    { professionalName: 'Ana Carolina Santos', serviceName: 'Corte Feminino' },
    { professionalName: 'Ana Carolina Santos', serviceName: 'Corte Feminino' },
    { professionalName: 'Ana Carolina Santos', serviceName: 'Escova Progressiva' },
    { professionalName: 'Camila Rodrigues Lima', serviceName: 'Manicure Completa' },
    { professionalName: 'Camila Rodrigues Lima', serviceName: 'Manicure Completa' },
    { professionalName: 'Camila Rodrigues Lima', serviceName: 'Manicure e Pedicure' },
    { professionalName: 'Fernanda Almeida Souza', serviceName: 'Design de Sobrancelhas' },
    { professionalName: 'Fernanda Almeida Souza', serviceName: 'Design de Sobrancelhas' },
    { professionalName: 'Fernanda Almeida Souza', serviceName: 'Maquiagem Profissional' },
    // Secondary professionals - fewer appointments
    { professionalName: 'Henrique Santiago Pires', serviceName: 'Corte Feminino' },
    { professionalName: 'Henrique Santiago Pires', serviceName: 'Design de Sobrancelhas' },
    { professionalName: 'Henrriky Jhonny', serviceName: 'Corte Feminino' },
    { professionalName: 'Alyson Fumagalli', serviceName: 'Manicure Completa' },
    { professionalName: 'Eliel da Silva', serviceName: 'Manicure Completa' },
    // Other professionals
    { professionalName: 'Isabella Ferreira Santos', serviceName: 'Extensão de Cílios' },
    { professionalName: 'Larissa Mendes Costa', serviceName: 'Hidratação Capilar' },
    { professionalName: 'Giovanna Camille', serviceName: 'Corte Feminino' },
    { professionalName: 'Giovanna Camille', serviceName: 'Manicure Completa' },
    { professionalName: 'Bruno Fischer', serviceName: 'Corte Feminino' },
    { professionalName: 'Bruno Fischer', serviceName: 'Escova Progressiva' }
  ]

  const customerEmails = [
    'ana.oliveira@example.com',
    'roberta.mendes@example.com',
    'patricia.santos@example.com',
    'rosemary.almeida@example.com',
    'maria.fernanda@example.com'
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

  const createAppointment = (
    offer: { professionalName: string; serviceName: string },
    customerEmail: string,
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FINISHED',
    appointmentDate: Date
  ): AppointmentSeedData => ({
    observation: faker.helpers.arrayElement(observations),
    status,
    appointmentDate,
    allowImageUse: faker.datatype.boolean(0.3),
    customerEmail,
    serviceName: offer.serviceName,
    professionalName: offer.professionalName
  })

  const today = new Date()
  const todayHours = [12, 13, 14, 15, 16, 17, 18, 19, 20]

  for (let i = 0; i < 9; i++) {
    const appointmentDate = new Date(today)
    appointmentDate.setUTCHours(todayHours[i], faker.helpers.arrayElement([0, 15, 30, 45]), 0, 0)

    appointments.push(
      createAppointment(
        faker.helpers.arrayElement(validOffers),
        faker.helpers.arrayElement(customerEmails),
        faker.helpers.arrayElement(statuses),
        appointmentDate
      )
    )
  }

  const previousMonthStatuses: Array<'CANCELLED' | 'FINISHED'> = ['CANCELLED', 'FINISHED']
  for (let i = 0; i < 200; i++) {
    const appointmentDate = new Date(today)
    appointmentDate.setMonth(appointmentDate.getMonth() - 1)
    appointmentDate.setDate(faker.number.int({ min: 1, max: 28 }))
    appointmentDate.setUTCHours(
      faker.number.int({ min: 12, max: 20 }),
      faker.helpers.arrayElement([0, 15, 30, 45]),
      0,
      0
    )

    appointments.push(
      createAppointment(
        faker.helpers.arrayElement(validOffers),
        faker.helpers.arrayElement(customerEmails),
        faker.helpers.arrayElement(previousMonthStatuses),
        appointmentDate
      )
    )
  }

  for (let i = 0; i < 70; i++) {
    const appointmentDate = new Date(today)
    appointmentDate.setDate(faker.number.int({ min: 1, max: 30 }))
    appointmentDate.setUTCHours(
      faker.number.int({ min: 12, max: 20 }),
      faker.helpers.arrayElement([0, 15, 30, 45]),
      0,
      0
    )

    appointments.push(
      createAppointment(
        faker.helpers.arrayElement(validOffers),
        faker.helpers.arrayElement(customerEmails),
        getWeightedStatus(),
        appointmentDate
      )
    )
  }

  const nextMonthStatuses: Array<'PENDING' | 'CONFIRMED'> = ['PENDING', 'CONFIRMED']
  for (let i = 0; i < 20; i++) {
    const appointmentDate = new Date(today)
    appointmentDate.setMonth(appointmentDate.getMonth() + 1)
    appointmentDate.setDate(faker.number.int({ min: 1, max: 28 }))
    appointmentDate.setUTCHours(
      faker.number.int({ min: 12, max: 20 }),
      faker.helpers.arrayElement([0, 15, 30, 45]),
      0,
      0
    )

    appointments.push(
      createAppointment(
        faker.helpers.arrayElement(validOffers),
        faker.helpers.arrayElement(customerEmails),
        faker.helpers.arrayElement(nextMonthStatuses),
        appointmentDate
      )
    )
  }

  appointments.sort((a, b) => a.appointmentDate.getTime() - b.appointmentDate.getTime())

  return appointments
}
