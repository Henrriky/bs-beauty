import { PrismaCustomerRepository } from '../../repository/prisma/prisma-customer.repository'
import { PrismaProfessionalRepository } from '../../repository/prisma/prisma-professional.repository'
import { FetchUserInfoUseCase } from '../../services/use-cases/auth/fetch-user-info.use-case'

function makeFetchUserInfoUseCase () {
  const customerRepository = new PrismaCustomerRepository()
  const professionalRepository = new PrismaProfessionalRepository()
  const usecase = new FetchUserInfoUseCase(
    customerRepository,
    professionalRepository
  )

  return usecase
}

export { makeFetchUserInfoUseCase }
