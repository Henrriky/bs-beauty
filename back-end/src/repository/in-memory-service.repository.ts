import { type Service } from '@prisma/client'
import { type ServiceRepository } from './protocols/service.repository'

class InMemoryServiceRepository implements ServiceRepository {
  private readonly items: Service[] = [
    {
      id: '123123',
      name: 'Serviço 1',
      category: 'Unha',
      description: 'Serviço de unha',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  async fetchAll (): Promise<Service[]> {
    return this.items
  }
}

export { InMemoryServiceRepository }
