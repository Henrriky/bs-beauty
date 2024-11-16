import { type Service, type Prisma } from '@prisma/client'

interface ServiceRepository {
  findAll: () => Promise<Service[]>
  findById: (serviceId: string) => Promise<Service | null>
  create: (newService: Prisma.ServiceCreateInput) => Promise<Service>
  update: (serviceId: string, updatedService: Prisma.ServiceUpdateInput) => Promise<Service>
  delete: (serviceId: string) => Promise<Service>
}

export type { ServiceRepository }
