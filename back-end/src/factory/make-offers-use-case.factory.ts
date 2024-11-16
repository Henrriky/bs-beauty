import { PrismaOfferRepository } from '../repository/prisma/prisma-offer.repository'
import { OffersUseCase } from '../services/offers.use-case'

function makeOffersUseCaseFactory () {
  const repository = new PrismaOfferRepository()
  const useCase = new OffersUseCase(repository)

  return useCase
}

export { makeOffersUseCaseFactory }
