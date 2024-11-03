import { type Service } from '../entities/service'
import { type ServiceRepository } from './protocols/service.repository'

class InMemoryServiceRepository implements ServiceRepository {
  private readonly items: Service[] = [
    {
      name: 'Serviço 1',
      category: 'Unha'
    }
  ]

  async fetchAll (): Promise<Service[]> {
    return this.items
  }
}

export { InMemoryServiceRepository }
