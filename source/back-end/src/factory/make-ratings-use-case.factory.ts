import { PrismaRatingRepository } from '../repository/prisma/prisma-rating.repository'
import { RatingsUseCase } from '../services/ratings.use-case'

function makeRatingsUseCaseFactory () {
  const repository = new PrismaRatingRepository()
  const usecase = new RatingsUseCase(repository)

  return usecase
}

export { makeRatingsUseCaseFactory }
