import { type Service, type Prisma } from '@prisma/client'
import { type EmployeesOfferingService } from '../types/service-repository.types'
import { type PaginatedRequest, type PaginatedResult } from '../../types/pagination'
import { type ServiceFilters } from '../../types/services/service-filters'

interface ServiceRepository {
  findAll: () => Promise<Service[]>
  fetchEmployeesOfferingService: (serviceId: string) => Promise<{ employeesOfferingService: EmployeesOfferingService | null }>
  findById: (serviceId: string) => Promise<Service | null>
  create: (newService: Prisma.ServiceCreateInput) => Promise<Service>
  update: (serviceId: string, updatedService: Prisma.ServiceUpdateInput) => Promise<Service>
  delete: (serviceId: string) => Promise<Service>
  findAllPaginated: (params: PaginatedRequest<ServiceFilters>) => Promise<PaginatedResult<Service>>
}

export type { ServiceRepository }
