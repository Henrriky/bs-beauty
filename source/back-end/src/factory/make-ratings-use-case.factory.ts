import { PrismaRatingRepository } from '../repository/prisma/prisma-rating.repository'
import { RatingsUseCase } from '../services/ratings.use-case'

function makeRatingsUseCaseFactory () {
  const ratingsRepository = new PrismaRatingRepository()
  const usecase = new RatingsUseCase(ratingsRepository)

  return usecase
}

export { makeRatingsUseCaseFactory }
