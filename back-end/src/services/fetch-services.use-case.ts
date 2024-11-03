import { type Service } from '../entities/service'
import { type ServiceRepository } from '../repository/protocols/service.repository'

interface FetchServicesOutput {
  services: Service[]
}

class FetchServicesUseCase {
  constructor (private readonly serviceRepository: ServiceRepository) {}

  public async execute (): Promise<FetchServicesOutput> {
    const services = await this.serviceRepository.fetchAll()

    return { services }
  }
}

export { FetchServicesUseCase }
