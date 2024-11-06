import { type Service, type Prisma } from '@prisma/client'
import { type ServiceRepository } from '../repository/protocols/service.repository'
import { CustomError } from '../utils/errors/custom.error.util'

interface ServicesOutput {
  services: Service[]
}

class ServicesUseCase {
  constructor (private readonly serviceRepository: ServiceRepository) { }

  public async executeFindAll (): Promise<ServicesOutput> {
    const services = await this.serviceRepository.findAll()
    return { services }
  }

  public async executeFindById (serviceId: string): Promise<Service | null> {
    const service = await this.serviceRepository.findById(serviceId)
    if (service == null) {
      throw new CustomError('Bad Request', 400, 'Specified service not found')
    }
    return service
  }

  public async executeCreate (newService: Prisma.ServiceCreateInput) {
    const service = await this.serviceRepository.create(newService)
    return service
  }

  public async executeUpdate (serviceId: string, updatedService: Prisma.ServiceUpdateInput) {
    await this.verifyExistence(serviceId)
    const service = await this.serviceRepository.update(serviceId, updatedService)
    return service
  }

  public async executeDelete (serviceId: string) {
    await this.verifyExistence(serviceId)
    const service = await this.serviceRepository.delete(serviceId)
    return service
  }

  private async verifyExistence (id: string) {
    const verifiedService = await this.serviceRepository.findById(id)
    if (verifiedService == null) {
      throw new CustomError('Not found', 400, 'Service doesn\'t exist')
    }
  }
}

export { ServicesUseCase }
