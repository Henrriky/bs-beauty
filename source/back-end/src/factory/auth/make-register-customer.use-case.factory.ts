// factory/auth/make-register-customer.use-case.factory.ts
import { RegisterCustomerUseCase } from '../../services/use-cases/auth/register-customer.use-case'
import { PrismaCustomerRepository } from '../../repository/prisma/prisma-customer.repository'
import { PrismaEmployeeRepository } from '../../repository/prisma/prisma-employee.repository'

const makeRegisterCustomerUseCase = () => {
  const customerRepo = new PrismaCustomerRepository()
  const employeeRepo = new PrismaEmployeeRepository()
  const usecase = new RegisterCustomerUseCase(customerRepo, employeeRepo)
  return usecase
}

export { makeRegisterCustomerUseCase }