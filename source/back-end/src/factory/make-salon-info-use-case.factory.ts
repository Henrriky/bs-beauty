import { PrismaSalonInfoRepository } from '@/repository/prisma/prisma-salon-info.repository'
import { SalonInfoUseCase } from '@/services/salon-info.use-case'

function makeSalonInfoUseCaseFactory () {
  const repository = new PrismaSalonInfoRepository()
  const useCase = new SalonInfoUseCase(repository)

  return useCase
}

export { makeSalonInfoUseCaseFactory }
