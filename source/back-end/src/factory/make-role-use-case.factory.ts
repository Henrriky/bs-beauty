import { PrismaRoleRepository } from '../repository/prisma/prisma-role.repository'
import { RoleUseCase } from '../services/roles.use-case'

function makeRoleUseCaseFactory () {
  const roleRepository = new PrismaRoleRepository()
  const usecase = new RoleUseCase(roleRepository)

  return usecase
}

export { makeRoleUseCaseFactory }
