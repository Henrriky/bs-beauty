import { PrismaProfessionalRepository } from '@/repository/prisma/prisma-professional.repository'
import { PrismaServiceRepository } from '../repository/prisma/prisma-service.repository'
import { ServicesUseCase } from '../services/services.use-case'

function makeServiceUseCaseFactory () {
  const repository = new PrismaServiceRepository()
  const professionalRepository = new PrismaProfessionalRepository()
  const usecase = new ServicesUseCase(
    repository,
    professionalRepository
  )

  return usecase
}

export { makeServiceUseCaseFactory }
