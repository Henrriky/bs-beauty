import { type $Enums, type Prisma } from '@prisma/client'

interface FetchValidAppointmentsByProfessionalOnDay extends Array<{
  id: string
  observation: string | null
  status: $Enums.Status
  appointmentDate: Date
  appointmentId: string
  estimatedTime: number
}> {}

export type { FetchValidAppointmentsByProfessionalOnDay }
