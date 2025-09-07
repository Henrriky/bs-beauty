import { Status, type Appointment, type Prisma } from '@prisma/client'
import { type FindNonFinishedByUserAndDay } from '../types/appointment-repository.types'

const appointmentNonFinishedStatus = [Status.PENDING, Status.RESCHEDULED, Status.CONFIRMED, Status.FINISHED]

interface AppointmentRepository {
  findAll: () => Promise<Appointment[]>
  findById: (id: string) => Promise<Appointment | null>
  findByCustomerOrProfessionalId: (customerOrProfessionalId: string) => Promise<Appointment[]>
  findByAppointmentDate: (date: Date) => Promise<Appointment[]>
  findByServiceOfferedId: (id: string) => Promise<Appointment[]>
  findNonFinishedByUserAndDay: (
    userId: string,
    dayToFetchAvailableSchedulling: Date
  ) => Promise<{ validAppointmentsOnDay: FindNonFinishedByUserAndDay } >
  create: (newAppointment: Prisma.AppointmentCreateInput) => Promise<Appointment>
  update: (id: string, updatedAppointment: Prisma.AppointmentUpdateInput) => Promise<Appointment>
  delete: (id: string) => Promise<Appointment>
}

export { appointmentNonFinishedStatus }
export type { AppointmentRepository }
