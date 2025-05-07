import { PrismaCustomerRepository } from '../repository/prisma/prisma-customer.repository'
import { CustomersUseCase } from '../services/customers.use-case'

function makeCustomersUseCaseFactory () {
  const repository = new PrismaCustomerRepository()
  const usecase = new CustomersUseCase(repository)

  return usecase
}

export { makeCustomersUseCaseFactory }
