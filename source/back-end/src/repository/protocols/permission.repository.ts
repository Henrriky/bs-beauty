import { type Permission } from '@prisma/client'
import { type PaginatedRequest, type PaginatedResult } from '@/types/pagination'
import { type PermissionFilters } from '@/types/permissions/permission-filters'

interface PermissionRepository {
  findAllPaginated: (params: PaginatedRequest<PermissionFilters>) => Promise<PaginatedResult<Permission>>
}

export { type PermissionRepository }
