import { Status, type Appointment, type Prisma } from '@prisma/client'
import { type FindNonFinishedByUserAndDay } from '../types/appointment-repository.types'
import { type PaginatedRequest, type PaginatedResult } from '@/types/pagination'
import { type AppointmentFilters } from '@/types/appointments/appointment-filters'

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

export interface GroupedAppointmentCount {
  period: string
  count: number
}

export interface GroupedEstimatedTime {
  period: string
  estimatedTimeInMinutes: number
}

export type GroupingPeriod = 'day' | 'week' | 'month'

interface AppointmentRepository {
  findAll: () => Promise<Appointment[]>
  findAllPaginated: (params: PaginatedRequest<AppointmentFilters>, scope: { userId: string, viewAll: boolean }) => Promise<PaginatedResult<Appointment>>
  findById: (id: string) => Promise<FindByIdAppointments | null>
  findByCustomerOrProfessionalId: (customerOrProfessionalId: string) => Promise<Appointment[]>
  findByServiceOfferedId: (id: string) => Promise<Appointment[]>
  findByDateRangeStatusProfessionalAndServices: (startDate: Date, endDate: Date, statusList?: Status[], professionalId?: string, serviceIds?: string[]) => Promise<Appointment[]>
  countByDateRangeGrouped: (
    startDate: Date,
    endDate: Date,
    groupBy: GroupingPeriod,
    statusList?: Status[],
    professionalId?: string,
    serviceIds?: string[]
  ) => Promise<GroupedAppointmentCount[]>
  sumEstimatedTimeByDateRangeGrouped: (
    startDate: Date,
    endDate: Date,
    groupBy: GroupingPeriod,
    statusList?: Status[],
    professionalId?: string,
    serviceIds?: string[]
  ) => Promise<GroupedEstimatedTime[]>
  findNonFinishedByUserAndDay: (
    userId: string,
    dayToFetchAvailableSchedulling: Date
  ) => Promise<{ validAppointmentsOnDay: FindNonFinishedByUserAndDay }>
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
