import { type Professional, type Prisma } from '@prisma/client'
import { type PaginatedRequest, type PaginatedResult } from '../../types/pagination'
import { type ServicesOfferedByProfessional } from '../types/professional-repository.types'
import { type PartialHandleFetchServicesOfferedByProfessionalQuerySchema } from '@/utils/validation/zod-schemas/pagination/professionals/professionals-query.schema'
import { type ProfessionalsFilters } from '@/types/employees/employees-filters'

interface ProfessionalRepository {
  findAll: () => Promise<Professional[]>
  findById: (customerId: string) => Promise<Professional | null>
  findByEmail: (email: string) => Promise<Professional | null>
  create: (newCustomer: Prisma.ProfessionalCreateInput) => Promise<Professional>
  update: (id: string, customerUpdated: Prisma.ProfessionalUpdateInput) => Promise<Professional>
  updateByEmailAndGoogleId: (googleId: string, email: string, customerUpdated: Prisma.ProfessionalUpdateInput) => Promise<Professional>
  updateProfessionalByEmail: (email: string, customerUpdated: Prisma.ProfessionalUpdateInput) => Promise<Professional>
  delete: (id: string) => Promise<Professional>
  fetchServicesOfferedByProfessional: (professionalId: string, params: PaginatedRequest<PartialHandleFetchServicesOfferedByProfessionalQuerySchema>) => Promise<{
    professional: ServicesOfferedByProfessional
  }>
  findAllPaginated: (params: PaginatedRequest<ProfessionalsFilters>) => Promise<PaginatedResult<Professional>>
}

export type { ProfessionalRepository }
