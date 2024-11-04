import { type Service } from '@prisma/client'

interface ServiceRepository {
  fetchAll: () => Promise<Service[]>
}

export type { ServiceRepository }
