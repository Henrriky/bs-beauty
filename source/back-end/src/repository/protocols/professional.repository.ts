import { type Professional, type Prisma } from '@prisma/client'
import { type PaginatedRequest, type PaginatedResult } from '../../types/pagination'
import { type ServicesOfferedByProfessional } from '../types/professional-repository.types'
import { type PartialHandleFetchServicesOfferedByProfessionalQuerySchema } from '@/utils/validation/zod-schemas/pagination/professionals/professionals-query.schema'
import { type ProfessionalsFilters } from '@/types/professionals/professionals-filters'
import { type Permissions } from '@/utils/auth/permissions-map.util'

export type FindRolesByProfessionalId = Prisma.ProfessionalRoleGetPayload<{
  select: { id: true, role: true }
}>

interface ProfessionalRepository {
  findAll: () => Promise<Professional[]>
  findById: (customerId: string) => Promise<Professional | null>
  findByEmail: (email: string) => Promise<Professional | null>
  countByRoleId: (roleId: string) => Promise<number>
  addRoleToProfessional: (professionalId: string, roleId: string) => Promise<void>
  removeRoleFromProfessional: (professionalId: string, roleId: string) => Promise<void>
  findProfessionalRoleAssociation: (professionalId: string, roleId: string) => Promise<boolean>
  findRolesByProfessionalId: (professionalId: string) => Promise<FindRolesByProfessionalId[]>
  findProfessionalPermissions: (professionalId: string) => Promise<Permissions[]>
  findProfessionalsWithPermissionOrUserType: (permission: Permissions, userType: string) => Promise<Professional[]>
  create: (newCustomer: Prisma.ProfessionalCreateInput) => Promise<Professional>
  update: (id: string, customerUpdated: Prisma.ProfessionalUpdateInput) => Promise<Professional>
  updateByEmailAndGoogleId: (googleId: string, email: string, customerUpdated: Prisma.ProfessionalUpdateInput) => Promise<Professional>
  updateProfessionalByEmail: (email: string, customerUpdated: Prisma.ProfessionalUpdateInput) => Promise<Professional>
  updateCommission: (professionalId: string, commissionRate: number) => Promise<void>
  delete: (id: string) => Promise<Professional>
  fetchServicesOfferedByProfessional: (professionalId: string, params: PaginatedRequest<PartialHandleFetchServicesOfferedByProfessionalQuerySchema>) => Promise<{
    professional: ServicesOfferedByProfessional
  }>
  findAllPaginated: (params: PaginatedRequest<ProfessionalsFilters>) => Promise<PaginatedResult<Professional>>
}

export type { ProfessionalRepository }
