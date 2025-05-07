import { PrismaAppointmentRepository } from '../repository/prisma/prisma-appointment.repository'
import { AppointmentsUseCase } from '../services/appointments.use-case'

function makeAppointmentsUseCaseFactory () {
  const repository = new PrismaAppointmentRepository()
  const useCase = new AppointmentsUseCase(repository)

  return useCase
}

export { makeAppointmentsUseCaseFactory }
