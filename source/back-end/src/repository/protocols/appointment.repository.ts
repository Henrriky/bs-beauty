import { type Appointment, type Prisma } from '@prisma/client'
// import { FindAppointmentById, type FindAppointmentByCustomerId } from '../types/appointment-repository.types'

interface AppointmentRepository {
  findAll: () => Promise<Appointment[]>
  findById: (id: string) => Promise<Appointment | null>
  findByCustomerOrProfessionalId: (customerOrProfessionalId: string) => Promise<Appointment[]>
  findByAppointmentDate: (date: Date) => Promise<Appointment[]>
  findByServiceOfferedId: (id: string) => Promise<Appointment[]>
  create: (newAppointment: Prisma.AppointmentCreateInput) => Promise<Appointment>
  update: (id: string, updatedAppointment: Prisma.AppointmentUpdateInput) => Promise<Appointment>
  delete: (id: string) => Promise<Appointment>
}

export type { AppointmentRepository }
