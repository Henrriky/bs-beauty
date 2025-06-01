import { PrismaAppointmentRepository } from '../repository/prisma/prisma-appointment.repository'
import { PrismaCustomerRepository } from '../repository/prisma/prisma-customer.repository'
import { PrismaEmployeeRepository } from '../repository/prisma/prisma-employee.repository'
import { AppointmentsUseCase } from '../services/appointments.use-case'

function makeAppointmentsUseCaseFactory () {
  const appointmentRepository = new PrismaAppointmentRepository()
  const customerRepository = new PrismaCustomerRepository()
  const employeeRepository = new PrismaEmployeeRepository()
  const useCase = new AppointmentsUseCase(appointmentRepository, customerRepository, employeeRepository)

  return useCase
}

export { makeAppointmentsUseCaseFactory }
