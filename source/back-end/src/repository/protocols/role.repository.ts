import { type Role, type Prisma, type Permission } from '@prisma/client'
import { type PaginatedRequest, type PaginatedResult } from '../../types/pagination'
import { type RoleFilters } from '../../types/roles/role-filters'
import { type RoleAssociation, type RoleAssociationFilters } from '../../types/roles/role-associations'

interface RoleRepository {
  findAllPaginated: (params: PaginatedRequest<RoleFilters>) => Promise<PaginatedResult<Role>>
  findById: (roleId: string) => Promise<Role | null>
  findByName: (name: string) => Promise<Role | null>
  findRoleAssociations: (roleId: string, params: PaginatedRequest<RoleAssociationFilters>) => Promise<PaginatedResult<RoleAssociation>>
  addPermissionToRole: (roleId: string, permissionId: string) => Promise<void>
  removePermissionFromRole: (roleId: string, permissionId: string) => Promise<void>
  findPermissionById: (permissionId: string) => Promise<Permission | null>
  findRolePermissionAssociation: (roleId: string, permissionId: string) => Promise<boolean>
  countProfessionalsWithRole: (roleId: string) => Promise<number>
  create: (newRole: Prisma.RoleCreateInput) => Promise<Role>
  update: (id: string, roleUpdated: Prisma.RoleUpdateInput) => Promise<Role>
  delete: (id: string) => Promise<Role>
}

export type { RoleRepository }
