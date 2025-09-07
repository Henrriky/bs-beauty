// import { type Prisma, type AppointmentService } from '@prisma/client'
// import { FindAppointmentServiceById, type FindAppointmentServiceByCustomerId } from '../types/appointment-repository.types'

// interface AppointmentServiceRepository {
//   findAll: () => Promise<AppointmentService[]>
//   findById: (id: string) => Promise<FindAppointmentServiceById | null>
//   findByAppointmentDate: (date: Date) => Promise<AppointmentService[]>
//   findByAppointmentId: (id: string) => Promise<AppointmentService[]>
//   findByServiceOfferedId: (id: string) => Promise<AppointmentService[]>
//   findByCustomerOrProfessionalId: (customerOrProfessionalId: string) => Promise<{ appointments: FindAppointmentServiceByCustomerId[] } >
//   create: (appointmentService: Prisma.AppointmentServiceCreateInput) => Promise<AppointmentService>
//   update: (id: string, appointmentService: Prisma.AppointmentServiceUpdateInput) => Promise<AppointmentService>
//   delete: (id: string) => Promise<AppointmentService>
// }

// export type { AppointmentServiceRepository }
