import { Status, type Appointment, type Prisma } from '@prisma/client'
import { type FindNonFinishedByUserAndDay } from '../types/appointment-repository.types'

const appointmentNonFinishedStatus = [Status.PENDING, Status.RESCHEDULED, Status.CONFIRMED, Status.FINISHED]

export type FindByIdAppointments = Prisma.AppointmentGetPayload<{
  where: { id: string }
  select: {
    id: true
    observation: true
    status: true
    appointmentDate: true
    customerId: true
    serviceOfferedId: true
    createdAt: true
    updatedAt: true
    offer: {
      select: {
        id: true
        estimatedTime: true
        price: true
        professionalId: true
        service: {
          select: {
            name: true
          }
        }
        professional: true
      }
    }
  }
}>

interface AppointmentRepository {
  findAll: () => Promise<Appointment[]>
  findById: (id: string) => Promise<FindByIdAppointments | null>
  findByCustomerOrProfessionalId: (customerOrProfessionalId: string) => Promise<Appointment[]>
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
