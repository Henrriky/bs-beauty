import { PrismaProfessionalRepository } from '../repository/prisma/prisma-professional.repository'
import { ProfessionalsUseCase } from '../services/professionals.use-case'

function makeProfessionalsUseCaseFactory() {
  const repository = new PrismaProfessionalRepository()
  const usecase = new ProfessionalsUseCase(repository)

  return usecase
}

export { makeProfessionalsUseCaseFactory }
