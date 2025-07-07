import { type Service, type Prisma } from '@prisma/client'
import { type ServiceRepository } from '../repository/protocols/service.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'
import { type EmployeesOfferingService } from '../repository/types/service-repository.types'
import { type PaginatedRequest, type PaginatedResult } from '../types/pagination'
import { type ServiceFilters } from '../types/services/service-filters'

interface ServicesOutput {
  services: Service[]
}

class ServicesUseCase {
  constructor (private readonly serviceRepository: ServiceRepository) { }

  public async executeFindAll (): Promise<ServicesOutput> {
    const services = await this.serviceRepository.findAll()
    RecordExistence.validateManyRecordsExistence(services, 'services')

    return { services }
  }

  public async executeFindById (serviceId: string): Promise<Service | null> {
    const service = await this.serviceRepository.findById(serviceId)
    RecordExistence.validateRecordExistence(service, 'Service')

    return service
  }

  public async fetchEmployeesOfferingService (serviceId: string): Promise<{ employeesOfferingService: EmployeesOfferingService }> {
    const { employeesOfferingService } = await this.serviceRepository.fetchEmployeesOfferingService(serviceId)
    RecordExistence.validateRecordExistence(employeesOfferingService, 'Service')

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { employeesOfferingService: employeesOfferingService! }
  }

  public async executeCreate (newService: Prisma.ServiceCreateInput) {
    const service = await this.serviceRepository.create(newService)

    return service
  }

  public async executeUpdate (serviceId: string, updatedService: Prisma.ServiceUpdateInput) {
    await this.executeFindById(serviceId)
    const service = await this.serviceRepository.update(serviceId, updatedService)

    return service
  }

  public async executeDelete (serviceId: string) {
    await this.executeFindById(serviceId)
    const service = await this.serviceRepository.delete(serviceId)
    return service
  }

  public async executeFindAllPaginated (
    params: PaginatedRequest<ServiceFilters>
  ): Promise<PaginatedResult<Service>> {
    const result = await this.serviceRepository.findAllPaginated(params)

    return result
  }
}

export { ServicesUseCase }
