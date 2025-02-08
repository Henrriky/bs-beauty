import { PrismaAppointmentServiceRepository } from '../repository/prisma/prisma-appointment-service.repository'
import { PrismaCustomerRepository } from '../repository/prisma/prisma-customer.repository'
import { AppointmentServicesUseCase } from '../services/appointment-services.use-case'

function makeAppointmentServicesUseCaseFactory () {
  const appointmentServiceRepository = new PrismaAppointmentServiceRepository()
  const customerRepository = new PrismaCustomerRepository()
  const useCase = new AppointmentServicesUseCase(appointmentServiceRepository, customerRepository)

  return useCase
}

export { makeAppointmentServicesUseCaseFactory }
