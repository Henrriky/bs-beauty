import { type Service, type Prisma } from '@prisma/client'
import { type ServiceRepository } from '../repository/protocols/service.repository'

interface ServicesOutput {
  services: Service[]
}

class ServicesUseCase {
  constructor(private readonly serviceRepository: ServiceRepository) { }

  public async executeFindAll(): Promise<ServicesOutput> {
    const services = await this.serviceRepository.findAll()

    return { services }
  }

  public async executeFindById(serviceId: string): Promise<Service | null> {
    const service = await this.serviceRepository.findById(serviceId)
    return service
  }

  public async executeCreate(newService: Prisma.ServiceCreateInput) {
    const service = await this.serviceRepository.create(newService)
  }

  public async executeUpdate(serviceId: string, updatedService: Prisma.ServiceUpdateInput) {
    //verify existence
    const service = this.serviceRepository.update(serviceId, updatedService)
    return service
  }

  public async executeDelete(serviceId: string) {
    //verify existence
    const service = this.serviceRepository.delete(serviceId)
    return service
  }
}

export { ServicesUseCase }


