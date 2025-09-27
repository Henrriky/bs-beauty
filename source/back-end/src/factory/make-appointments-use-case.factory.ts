import { PrismaAppointmentRepository } from '../repository/prisma/prisma-appointment.repository'
import { PrismaCustomerRepository } from '../repository/prisma/prisma-customer.repository'
import { PrismaProfessionalRepository } from '../repository/prisma/prisma-professional.repository'
import { AppointmentsUseCase } from '../services/appointments.use-case'

function makeAppointmentsUseCaseFactory () {
  const appointmentRepository = new PrismaAppointmentRepository()
  const customerRepository = new PrismaCustomerRepository()
  const professionalRepository = new PrismaProfessionalRepository()

  const useCase = new AppointmentsUseCase(appointmentRepository, customerRepository, professionalRepository)

  return useCase
}

export { makeAppointmentsUseCaseFactory }
