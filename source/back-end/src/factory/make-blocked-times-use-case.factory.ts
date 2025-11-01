import { PrismaBlockedTimeRepository } from '@/repository/prisma/prisma-blocked-time.repository'
import { PrismaProfessionalRepository } from '@/repository/prisma/prisma-professional.repository'
import { BlockedTimesUseCase } from '@/services/blocked-times.use-case'

function makeBlockedTimesUseCaseFactory () {
  const blockedTimeRepository = new PrismaBlockedTimeRepository()
  const professionalRepository = new PrismaProfessionalRepository()
  const usecase = new BlockedTimesUseCase(
    blockedTimeRepository,
    professionalRepository
  )

  return usecase
}

export { makeBlockedTimesUseCaseFactory }
