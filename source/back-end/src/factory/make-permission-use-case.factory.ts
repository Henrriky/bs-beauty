import { PermissionUseCase } from '@/services/permissions.use-case'
import { PrismaPermissionRepository } from '@/repository/prisma/prisma-permission.repository'

function makePermissionUseCaseFactory (): PermissionUseCase {
  const permissionRepository = new PrismaPermissionRepository()
  const permissionUseCase = new PermissionUseCase(permissionRepository)

  return permissionUseCase
}

export { makePermissionUseCaseFactory }
