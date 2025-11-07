import { faker } from '@faker-js/faker'

faker.seed(789)

export interface RatingSeedData {
  score: number
  comment: string | null
  appointmentId: string
}

export interface AppointmentForRating {
  id: string
  status: string
  professionalName: string
  serviceName: string
}

export function generateRatingsData(appointments: AppointmentForRating[]): RatingSeedData[] {
  const ratings: RatingSeedData[] = []

  const finishedAppointments = appointments.filter(apt => apt.status === 'FINISHED')

  const appointmentsToRate = finishedAppointments.filter(() => faker.datatype.boolean(0.8))

  const excellentComments = [
    'Atendimento excelente! Profissional muito atencioso e caprichoso.',
    'Amei o resultado! Superou minhas expectativas.',
    'Profissional muito talentoso, voltarei com certeza!',
    'Atendimento impecável, ambiente agradável e resultado perfeito.',
    'Muito satisfeita com o serviço, recomendo!',
    null
  ]

  const goodComments = [
    'Bom atendimento, resultado satisfatório.',
    'Gostei do serviço, mas poderia ser um pouco mais rápido.',
    'Profissional competente, voltarei novamente.',
    'Bom custo-benefício, estou satisfeita.',
    null
  ]

  const averageComments = [
    'Serviço ok, atendeu o esperado.',
    'Nada de excepcional, mas foi satisfatório.',
    'Poderia melhorar alguns detalhes.',
    null
  ]

  const poorComments = [
    'Não gostei muito do resultado, esperava mais.',
    'Atendimento demorado e resultado abaixo do esperado.',
    'Não voltarei, não atendeu minhas expectativas.'
  ]

  for (const appointment of appointmentsToRate) {
    // Distribuição de notas:
    // 5 estrelas: 50%
    // 4 estrelas: 30%
    // 3 estrelas: 15%
    // 1-2 estrelas: 5%
    const random = Math.random()
    let score: number
    let comments: (string | null)[]

    if (random < 0.5) {
      score = 5
      comments = excellentComments
    } else if (random < 0.8) {
      score = 4
      comments = goodComments
    } else if (random < 0.95) {
      score = 3
      comments = averageComments
    } else {
      score = faker.helpers.arrayElement([1, 2])
      comments = poorComments
    }

    ratings.push({
      score,
      comment: faker.helpers.arrayElement(comments),
      appointmentId: appointment.id
    })
  }

  return ratings
}
