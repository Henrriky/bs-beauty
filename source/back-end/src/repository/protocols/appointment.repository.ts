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
    allowImageUse: true
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
    customer: {
      select: {
        id: true
        name: true
        email: true
        notificationPreference: true
      }
    }
  }
}>

interface AppointmentRepository {
  findAll: () => Promise<Appointment[]>
  findById: (id: string) => Promise<FindByIdAppointments | null>
  findByCustomerOrProfessionalId: (customerOrProfessionalId: string) => Promise<Appointment[]>
  findByServiceOfferedId: (id: string) => Promise<Appointment[]>
  findByDateRangeStatusAndProfessional: (startDate: Date, endDate: Date, statusList?: Status[], professionalId?: string) => Promise<Appointment[]>
  findNonFinishedByUserAndDay: (
    userId: string,
    dayToFetchAvailableSchedulling: Date
  ) => Promise<{ validAppointmentsOnDay: FindNonFinishedByUserAndDay } >
  countCustomerAppointmentsPerDay: (
    customerId: string,
    day?: Date,
  ) => Promise<number>
  create: (newAppointment: Prisma.AppointmentCreateInput) => Promise<Appointment>
  update: (id: string, updatedAppointment: Prisma.AppointmentUpdateInput) => Promise<Appointment>
  delete: (id: string) => Promise<Appointment>
}

export { appointmentNonFinishedStatus }
export type { AppointmentRepository }
