import { type Service } from '../../entities/service'

interface ServiceRepository {
  fetchAll: () => Promise<Service[]>
}

export type { ServiceRepository }
