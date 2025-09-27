import { PrismaNotificationRepository } from '@/repository/prisma/prisma-notification.repository'
import { PrismaAppointmentRepository } from '../repository/prisma/prisma-appointment.repository'
import { PrismaCustomerRepository } from '../repository/prisma/prisma-customer.repository'
import { PrismaProfessionalRepository } from '../repository/prisma/prisma-professional.repository'
import { AppointmentsUseCase } from '../services/appointments.use-case'
import { NotificationsUseCase } from '@/services/notifications.use-case'

function makeAppointmentsUseCaseFactory () {
  const appointmentRepository = new PrismaAppointmentRepository()
  const customerRepository = new PrismaCustomerRepository()
  const professionalRepository = new PrismaProfessionalRepository()
  const notificationRepository = new PrismaNotificationRepository()
  const notificationsUseCase = new NotificationsUseCase(notificationRepository)

  const useCase = new AppointmentsUseCase(appointmentRepository, customerRepository, professionalRepository, notificationsUseCase)

  return useCase
}

export { makeAppointmentsUseCaseFactory }
