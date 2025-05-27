import { PrismaCustomerRepository } from '../../repository/prisma/prisma-customer.repository'
import { PrismaEmployeeRepository } from '../../repository/prisma/prisma-employee.repository'
import { FetchUserInfoUseCase } from '../../services/use-cases/auth/fetch-user-info.use-case'

function makeFetchUserInfoUseCase () {
  const customerRepository = new PrismaCustomerRepository()
  const employeeRepository = new PrismaEmployeeRepository()
  const usecase = new FetchUserInfoUseCase(
    customerRepository,
    employeeRepository
  )

  return usecase
}

export { makeFetchUserInfoUseCase }
