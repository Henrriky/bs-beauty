import { type Permission } from '@prisma/client'
import { type PaginatedRequest, type PaginatedResult } from '@/types/pagination'
import { type PermissionFilters } from '@/types/permissions/permission-filters'
import { type PermissionRepository } from '@/repository/protocols/permission.repository'

class PermissionUseCase {
  private readonly entityName = 'Permission'

  constructor (private readonly permissionRepository: PermissionRepository) {}

  public async executeFindAllPaginated (params: PaginatedRequest<PermissionFilters>): Promise<PaginatedResult<Permission>> {
    // Validação básica de paginação
    if (params.page <= 0) {
      params.page = 1
    }
    if (params.limit <= 0 || params.limit > 100) {
      params.limit = 10
    }

    const result = await this.permissionRepository.findAllPaginated(params)

    return result
  }
}

export { PermissionUseCase }
