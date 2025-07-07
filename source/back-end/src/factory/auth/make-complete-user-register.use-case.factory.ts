import { PrismaCustomerRepository } from '../../repository/prisma/prisma-customer.repository'
import { PrismaEmployeeRepository } from '../../repository/prisma/prisma-employee.repository'
import { CompleteUserRegisterUseCase } from '../../services/use-cases/auth/complete-user-register.use-case'

function makeCompleteUserRegisterUseCase () {
  const customerRepository = new PrismaCustomerRepository()
  const employeeRepository = new PrismaEmployeeRepository()
  const usecase = new CompleteUserRegisterUseCase(
    customerRepository,
    employeeRepository
  )

  return usecase
}

export { makeCompleteUserRegisterUseCase }
