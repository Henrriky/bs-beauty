import { type Prisma, type AppointmentService } from '@prisma/client'

interface AppointmentServiceRepository {
  findAll: () => Promise<AppointmentService[]>
  findById: (id: string) => Promise<AppointmentService | null>
  findByAppointmentDate: (date: Date) => Promise<AppointmentService[]>
  findByAppointmentId: (id: string) => Promise<AppointmentService[]>
  findByServiceId: (id: string) => Promise<AppointmentService[]>
  create: (appointmentService: Prisma.AppointmentServiceCreateInput) => Promise<AppointmentService>
  update: (id: string, appointmentService: Prisma.AppointmentServiceUpdateInput) => Promise<AppointmentService>
  delete: (id: string) => Promise<AppointmentService>
}

export type { AppointmentServiceRepository }
