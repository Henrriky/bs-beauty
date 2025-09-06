// factory/auth/make-register-customer.use-case.factory.ts
import { RegisterUserUseCase } from '../../services/use-cases/auth/register-user.use-case'
import { PrismaCustomerRepository } from '../../repository/prisma/prisma-customer.repository'
import { PrismaEmployeeRepository } from '../../repository/prisma/prisma-employee.repository'

const makeRegisterUserUseCase = () => {
  const customerRepo = new PrismaCustomerRepository()
  const employeeRepo = new PrismaEmployeeRepository()
  const usecase = new RegisterUserUseCase(customerRepo, employeeRepo)
  return usecase
}

export { makeRegisterUserUseCase }