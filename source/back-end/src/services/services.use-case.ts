import { type Service, type Prisma, ServiceStatus, type UserType, type Professional } from '@prisma/client'
import { type ServiceRepository } from '../repository/protocols/service.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'
import { type ProfessionalsOfferingService } from '../repository/types/service-repository.types'
import { type PaginatedRequest, type PaginatedResult } from '../types/pagination'
import { type PartialServiceQuerySchema } from '@/utils/validation/zod-schemas/pagination/services/services-query.schema'
import { type ProfessionalRepository } from '@/repository/protocols/professional.repository'
import { CustomError } from '@/utils/errors/custom.error.util'
import { PermissionChecker } from '@/utils/auth/permission-checker.util'
import { type Permissions } from '@/utils/auth/permissions-map.util'
import { notificationBus } from '@/events/notification-bus'
import { ENV } from '@/config/env'

interface ServicesOutput {
  services: Service[]
}

const STATUS_TRANSITIONS: Record<ServiceStatus, ServiceStatus[]> = {
  PENDING: [ServiceStatus.APPROVED, ServiceStatus.REJECTED],
  APPROVED: [],
  REJECTED: []
} as const

const CREATE_SERVICE_DEFAULT_STATUS_BY_ROLE: Record<UserType, ServiceStatus> = {
  MANAGER: ServiceStatus.APPROVED,
  PROFESSIONAL: ServiceStatus.PENDING,
  CUSTOMER: ServiceStatus.PENDING
} as const

class ServicesUseCase {
  constructor (
    private readonly serviceRepository: ServiceRepository,
    private readonly professionalRepository: ProfessionalRepository
  ) { }

  public async executeFindAll (): Promise<ServicesOutput> {
    const services = await this.serviceRepository.findAll()
    RecordExistence.validateManyRecordsExistence(services, 'services')

    return { services }
  }

  public async executeFindById (serviceId: string): Promise<Service> {
    const service = await this.serviceRepository.findById(serviceId)
    RecordExistence.validateRecordExistence(service, 'Service')

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return service!
  }

  public async fetchProfessionalsOfferingService (serviceId: string): Promise<{ professionalsOfferingService: ProfessionalsOfferingService }> {
    const { professionalsOfferingService } = await this.serviceRepository.fetchProfessionalsOfferingService(serviceId)
    RecordExistence.validateRecordExistence(professionalsOfferingService, 'Service')

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { professionalsOfferingService: professionalsOfferingService! }
  }

  public async executeCreate (newService: Prisma.ServiceCreateInput, professionalId: string) {
    const professional = await this.validateAndGetProfessional(professionalId)

    newService.status = this.getServiceStatusByRole(professional.userType)
    newService.createdByProfessional = { connect: { id: professionalId } }

    const service = await this.serviceRepository.create(newService)

    // Notificar gerentes ou usuários com permissão service.approve sobre nova criação de serviço
    if (service.status === ServiceStatus.PENDING) {
      if (ENV.NOTIFY_ASYNC_ENABLED) {
        notificationBus.emit('service.created', { service })
      }
    }

    return service
  }

  public async executeUpdate (serviceId: string, updatedService: Prisma.ServiceUpdateInput, professionalId: string) {
    const service = await this.executeFindById(serviceId)

    if (this.isStatusBeingUpdated(updatedService)) {
      const professional = await this.validateAndGetProfessional(professionalId)
      this.validatePermission({
        userToVerify: professional,
        allowedUserTypes: ['MANAGER'],
        allowedPermissions: ['service.approve']
      })
      this.validateStatusTransition(service.status, updatedService.status as ServiceStatus)
    }

    const updatedServiceResult = await this.serviceRepository.update(serviceId, updatedService)

    // Notificar o profissional criador sobre a mudança de status do serviço
    if (this.isStatusBeingUpdated(updatedService)) {
      if (ENV.NOTIFY_ASYNC_ENABLED) {
        notificationBus.emit('service.statusChanged', { service: updatedServiceResult })
      }
    }

    return updatedServiceResult
  }

  public async executeDelete (serviceId: string) {
    await this.executeFindById(serviceId)
    const service = await this.serviceRepository.delete(serviceId)
    return service
  }

  public async executeFindAllPaginated (
    params: PaginatedRequest<PartialServiceQuerySchema>
  ): Promise<PaginatedResult<Service>> {
    const result = await this.serviceRepository.findAllPaginated(params)

    return result
  }

  private getServiceStatusByRole (userType: UserType): ServiceStatus {
    const status = CREATE_SERVICE_DEFAULT_STATUS_BY_ROLE[userType]
    if (status === undefined) {
      throw new CustomError('Bad Request', 400, 'Invalid user type for setting service status.')
    }
    return status
  }

  private isValidStatusTransition (oldStatus: ServiceStatus, newStatus: ServiceStatus): boolean {
    const validTransitions = STATUS_TRANSITIONS[oldStatus]
    return validTransitions.includes(newStatus)
  }

  private async validateAndGetProfessional (professionalId: string) {
    const professional = await this.professionalRepository.findById(professionalId)
    RecordExistence.validateRecordExistence(professional, 'Professional')

    const permissions = await this.professionalRepository.findProfessionalPermissions(professionalId)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { ...professional!, permissions }
  }

  private validatePermission ({
    userToVerify: {
      permissions,
      userType
    },
    allowedPermissions,
    allowedUserTypes
  }: {
    userToVerify: Professional & { permissions: Permissions[] }
    allowedUserTypes: UserType[]
    allowedPermissions: Permissions[]
  }): void {
    if (allowedPermissions.length > 0 && permissions.length > 0) {
      const hasPermission = allowedPermissions.every(requiredPermission =>
        PermissionChecker.hasPermission(permissions, requiredPermission)
      )
      if (hasPermission) return
      throw new CustomError('Forbidden', 403, 'You do not have permission to perform this action.')
    }

    if (!allowedUserTypes.includes(userType)) {
      throw new CustomError('Forbidden', 403, 'You do not have permission to perform this action.')
    }
  }

  private validateStatusTransition (currentStatus: ServiceStatus, newStatus: ServiceStatus): void {
    if (!this.isValidStatusTransition(currentStatus, newStatus)) {
      throw new CustomError('Bad Request', 400, `Invalid status transition from ${currentStatus} to ${newStatus}.`)
    }
  }

  private isStatusBeingUpdated (updatedService: Prisma.ServiceUpdateInput): boolean {
    return updatedService.status != null && updatedService.status !== undefined
  }
}

export { ServicesUseCase }
