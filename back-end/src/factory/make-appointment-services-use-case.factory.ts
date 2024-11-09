import { PrismaAppointmentServiceRepository } from '../repository/prisma/prisma-appointment-service.repository'
import { AppointmentServicesUseCase } from '../services/appointment-services.use-case'

function makeAppointmentServicesUseCaseFactory () {
  const repository = new PrismaAppointmentServiceRepository()
  const useCase = new AppointmentServicesUseCase(repository)

  return useCase
}

export { makeAppointmentServicesUseCaseFactory }
