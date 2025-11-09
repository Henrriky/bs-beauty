import { faker } from '@faker-js/faker'

faker.seed(789)

export interface RatingSeedData {
  score: number | null
  comment: string | null
  appointmentId: string
}

export interface AppointmentForRating {
  id: string
  status: string
  professionalName: string
  serviceName: string
}

const RATING_PROBABILITY = 0.85

const MALE_PROFESSIONALS = [
  'Henrique Santiago Pires',
  'Henrriky Jhonny',
  'Alyson Fumagalli',
  'Eliel da Silva',
  'Bruno Fischer'
]

const COMMENTS = {
  brunaExcellent: [
    'A Bruna é simplesmente perfeita! Melhor profissional que já conheci.',
    'Atendimento impecável! A Bruna é uma artista, amei demais!',
    'Não tenho palavras para descrever o quão maravilhoso foi o resultado!',
    'Sempre perfeito! A Bruna é a melhor, super recomendo!',
    'Excelência em atendimento! Trabalho impecável como sempre.',
    'A melhor profissional! Resultado perfeito toda vez!'
  ],
  excellent: [
    'Atendimento excelente! Profissional muito atencioso e caprichoso.',
    'Amei o resultado! Superou minhas expectativas.',
    'Profissional muito talentoso, voltarei com certeza!',
    'Atendimento impecável, ambiente agradável e resultado perfeito.',
    'Muito satisfeita com o serviço, recomendo!',
    null
  ],
  good: [
    'Bom atendimento, resultado satisfatório.',
    'Gostei do serviço, mas poderia ser um pouco mais rápido.',
    'Profissional competente, voltarei novamente.',
    'Bom custo-benefício, estou satisfeita.',
    null
  ],
  average: [
    'Serviço ok, atendeu o esperado.',
    'Nada de excepcional, mas foi satisfatório.',
    'Poderia melhorar alguns detalhes.',
    null
  ]
}

const RATING_DISTRIBUTIONS = {
  brunaExclusive: { score: 5, comments: COMMENTS.brunaExcellent },

  standard: [
    { probability: 0.75, score: 5, comments: COMMENTS.excellent },
    { probability: 0.95, score: 4, comments: COMMENTS.good },
    { probability: 1.0, score: 3, comments: COMMENTS.average }
  ]
}

function createPendingRating(appointmentId: string): RatingSeedData {
  return {
    score: null,
    comment: null,
    appointmentId
  }
}

function createRating(appointmentId: string, score: number, comments: (string | null)[]): RatingSeedData {
  return {
    score,
    comment: faker.helpers.arrayElement(comments),
    appointmentId
  }
}

function getRatingForProfessional(professionalName: string, appointmentId: string): RatingSeedData {
  if (professionalName === 'Bruna Silva') {
    return createRating(appointmentId, RATING_DISTRIBUTIONS.brunaExclusive.score, RATING_DISTRIBUTIONS.brunaExclusive.comments)
  }

  const isMale = MALE_PROFESSIONALS.includes(professionalName)
  if (isMale) {
    return createPendingRating(appointmentId)
  }

  const distribution = RATING_DISTRIBUTIONS.standard
  const random = Math.random()

  for (const { probability, score, comments } of distribution) {
    if (random < probability) {
      return createRating(appointmentId, score, comments)
    }
  }

  return createRating(appointmentId, 4, COMMENTS.good)
}

export function generateRatingsData(appointments: AppointmentForRating[]): RatingSeedData[] {
  const finishedAppointments = appointments.filter(apt => apt.status === 'FINISHED')

  return finishedAppointments.map(appointment => {
    const isMale = MALE_PROFESSIONALS.includes(appointment.professionalName)
    if (isMale) {
      return createPendingRating(appointment.id)
    }

    const hasRated = faker.datatype.boolean(RATING_PROBABILITY)

    if (!hasRated) {
      return createPendingRating(appointment.id)
    }

    return getRatingForProfessional(appointment.professionalName, appointment.id)
  })
}
