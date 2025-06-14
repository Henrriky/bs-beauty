import { PrismaServiceRepository } from '../repository/prisma/prisma-service.repository'
import { ServicesUseCase } from '../services/services.use-case'

function makeServiceUseCaseFactory () {
  const repository = new PrismaServiceRepository()
  const usecase = new ServicesUseCase(repository)

  return usecase
}

export { makeServiceUseCaseFactory }
