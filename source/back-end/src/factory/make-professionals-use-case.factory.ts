import { PrismaProfessionalRepository } from '../repository/prisma/prisma-professional.repository'
import { PrismaRoleRepository } from '../repository/prisma/prisma-role.repository'
import { ProfessionalsUseCase } from '../services/professionals.use-case'

function makeProfessionalsUseCaseFactory () {
  const repository = new PrismaProfessionalRepository()
  const roleRepository = new PrismaRoleRepository()
  const usecase = new ProfessionalsUseCase(repository, roleRepository)

  return usecase
}

export { makeProfessionalsUseCaseFactory }
