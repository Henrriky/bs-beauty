import { PrismaServiceRepository } from '../repository/prisma/prisma-service.repository'
import { FetchServicesUseCase } from '../services/fetch-services.use-case'

function makeFetchServiceUseCaseFactory () {
  const repository = new PrismaServiceRepository()
  const usecase = new FetchServicesUseCase(
    repository
  )

  return usecase
}

export { makeFetchServiceUseCaseFactory }
