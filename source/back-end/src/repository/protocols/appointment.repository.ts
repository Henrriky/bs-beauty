import { type Appointment, type Prisma } from '@prisma/client'

interface AppointmentRepository {
  findAll: () => Promise<Appointment[]>
  findById: (id: string) => Promise<Appointment | null>
  findByCustomerId: (customerId: string) => Promise<Appointment[]>
  create: (newAppointment: Prisma.AppointmentCreateInput) => Promise<Appointment>
  update: (id: string, updatedAppointment: Prisma.AppointmentUpdateInput) => Promise<Appointment>
  delete: (id: string) => Promise<Appointment>
}

export type { AppointmentRepository }
