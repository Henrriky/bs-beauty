import { ServicesUseCase } from '@/services/services.use-case'
import { MockProfessionalRepository, MockServiceRepository } from '../utils/mocks/repository'
import { faker } from '@faker-js/faker'
import { NotificationChannel, Prisma, type Professional, type Service, ServiceStatus, UserType } from '@prisma/client'
import { type ProfessionalsOfferingService } from '@/repository/types/service-repository.types'
import { PERMISSIONS_MAP } from '@/utils/auth/permissions-map.util'

describe('ServicesUseCase (Unit Tests)', () => {
  let servicesUseCase: ServicesUseCase

  beforeEach(() => {
    servicesUseCase = new ServicesUseCase(MockServiceRepository, MockProfessionalRepository)
  })

  it('should be defined', () => {
    expect(servicesUseCase).toBeDefined()
  })

  describe('executeFindAll', () => {
    it('should return all services', async () => {
      const services: Service[] = [
        {
          id: faker.string.uuid(),
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          category: faker.commerce.department(),
          status: ServiceStatus.PENDING,
          createdBy: null,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        },
        {
          id: faker.string.uuid(),
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          category: faker.commerce.department(),
          status: ServiceStatus.PENDING,
          createdBy: null,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        }
      ]

      MockServiceRepository.findAll.mockResolvedValue(services)

      const result = await servicesUseCase.executeFindAll()
      expect(result).toEqual({ services })
      expect(MockServiceRepository.findAll).toHaveBeenCalled()
    })

    it('should throw an error if no services are found', async () => {
      MockServiceRepository.findAll.mockResolvedValue([])

      const promise = servicesUseCase.executeFindAll()
      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeFindById', () => {
    it('should return a service by id', async () => {
      const service: Service = {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        status: ServiceStatus.PENDING,
        createdBy: null,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockServiceRepository.findById.mockResolvedValue(service)

      const result = await servicesUseCase.executeFindById(service.id)
      expect(result).toEqual(service)
      expect(MockServiceRepository.findById).toHaveBeenCalledWith(service.id)
    })

    it('should throw an error if service is not found', async () => {
      const serviceId = faker.string.uuid()
      MockServiceRepository.findById.mockResolvedValue(null)

      const promise = servicesUseCase.executeFindById(serviceId)
      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeCreate', () => {
    it('should create a service as MANAGER with APPROVED status', async () => {
      const professionalId = faker.string.uuid()
      const professional: Professional = {
        id: professionalId,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        userType: UserType.MANAGER,
        registerCompleted: true,
        socialMedia: null,
        contact: faker.phone.number(),
        specialization: faker.person.jobType(),
        profilePhotoUrl: faker.internet.url(),
        googleId: null,
        paymentMethods: [],
        passwordHash: faker.internet.password(),
        notificationPreference: NotificationChannel.BOTH,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const serviceToCreate: Prisma.ServiceCreateInput = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department()
      }

      const createdService: Service = {
        id: faker.string.uuid(),
        name: serviceToCreate.name,
        description: serviceToCreate.description ?? null,
        category: serviceToCreate.category,
        status: ServiceStatus.APPROVED,
        createdBy: professionalId,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockProfessionalRepository.findById.mockResolvedValue(professional)
      MockServiceRepository.create.mockResolvedValue(createdService)

      const result = await servicesUseCase.executeCreate(serviceToCreate, professionalId)

      expect(result).toEqual(createdService)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(professionalId)
      expect(MockServiceRepository.create).toHaveBeenCalledWith({
        ...serviceToCreate,
        status: ServiceStatus.APPROVED,
        createdByProfessional: { connect: { id: professionalId } }
      })
    })

    it('should create a service as PROFESSIONAL with PENDING status', async () => {
      const professionalId = faker.string.uuid()
      const professional: Professional = {
        id: professionalId,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        userType: UserType.PROFESSIONAL,
        registerCompleted: true,
        socialMedia: null,
        contact: faker.phone.number(),
        specialization: faker.person.jobType(),
        profilePhotoUrl: faker.internet.url(),
        googleId: null,
        paymentMethods: [],
        passwordHash: faker.internet.password(),
        notificationPreference: NotificationChannel.BOTH,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const serviceToCreate: Prisma.ServiceCreateInput = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department()
      }

      const createdService: Service = {
        id: faker.string.uuid(),
        name: serviceToCreate.name,
        description: serviceToCreate.description ?? null,
        category: serviceToCreate.category,
        status: ServiceStatus.PENDING,
        createdBy: professionalId,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockProfessionalRepository.findById.mockResolvedValue(professional)
      MockServiceRepository.create.mockResolvedValue(createdService)

      const result = await servicesUseCase.executeCreate(serviceToCreate, professionalId)

      expect(result).toEqual(createdService)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(professionalId)
      expect(MockServiceRepository.create).toHaveBeenCalledWith({
        ...serviceToCreate,
        status: ServiceStatus.PENDING,
        createdByProfessional: { connect: { id: professionalId } }
      })
    })

    it('should throw an error if professional is not found', async () => {
      const professionalId = faker.string.uuid()
      const serviceToCreate: Prisma.ServiceCreateInput = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department()
      }

      MockProfessionalRepository.findById.mockResolvedValue(null)

      const promise = servicesUseCase.executeCreate(serviceToCreate, professionalId)
      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeUpdate', () => {
    it('should update a service without status change', async () => {
      const serviceId = faker.string.uuid()
      const professionalId = faker.string.uuid()
      const serviceToUpdate: Prisma.ServiceUpdateInput = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription()
      }

      const existingService: Service = {
        id: serviceId,
        name: 'Old name',
        description: 'Old description',
        category: faker.commerce.department(),
        status: ServiceStatus.PENDING,
        createdBy: null,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const updatedService: Service = {
        ...existingService,
        name: serviceToUpdate.name as string,
        description: serviceToUpdate.description as string,
        updatedAt: faker.date.recent()
      }

      MockServiceRepository.findById.mockResolvedValue(existingService)
      MockServiceRepository.update.mockResolvedValue(updatedService)

      const result = await servicesUseCase.executeUpdate(serviceId, serviceToUpdate, professionalId)
      expect(result).toEqual(updatedService)
      expect(MockServiceRepository.findById).toHaveBeenCalledWith(serviceId)
      expect(MockServiceRepository.update).toHaveBeenCalledWith(serviceId, serviceToUpdate)
    })

    it('should throw an error if service to update does not exist', async () => {
      const serviceId = faker.string.uuid()
      const professionalId = faker.string.uuid()
      const serviceToUpdate: Prisma.ServiceUpdateInput = {
        name: faker.commerce.productName()
      }

      MockServiceRepository.findById.mockResolvedValue(null)

      const promise = servicesUseCase.executeUpdate(serviceId, serviceToUpdate, professionalId)
      await expect(promise).rejects.toThrow('Not Found')
    })

    describe('Manager Scenarios for Status Update', () => {
      const serviceId = faker.string.uuid()
      const professionalId = faker.string.uuid()
      const serviceToUpdate: Prisma.ServiceUpdateInput = {
        status: ServiceStatus.APPROVED
      }
      const existingService: Service = {
        id: serviceId,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        status: ServiceStatus.PENDING,
        createdBy: null,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }
      const manager: Professional = {
        id: professionalId,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        userType: UserType.MANAGER,
        registerCompleted: true,
        socialMedia: null,
        contact: faker.phone.number(),
        specialization: faker.person.jobType(),
        profilePhotoUrl: faker.internet.url(),
        googleId: null,
        paymentMethods: [],
        passwordHash: faker.internet.password(),
        notificationPreference: NotificationChannel.BOTH,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }
      const updatedService: Service = {
        ...existingService,
        status: serviceToUpdate.status as ServiceStatus,
        updatedAt: faker.date.recent()
      }

      beforeEach(() => {
        MockServiceRepository.findById.mockResolvedValue(existingService)
        MockProfessionalRepository.findById.mockResolvedValue(manager)
        MockServiceRepository.update.mockResolvedValue(updatedService)
      })

      it('should update service status when manager without permissions override tries to update status', async () => {
        MockProfessionalRepository.findProfessionalPermissions.mockResolvedValue([])

        const result = await servicesUseCase.executeUpdate(serviceId, serviceToUpdate, professionalId)
        expect(result).toEqual(updatedService)
        expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(professionalId)
        expect(MockServiceRepository.update).toHaveBeenCalledWith(serviceId, serviceToUpdate)
      })

      it('should update service status when manager with permissions override that contains service.approve tries to change status', async () => {
        MockProfessionalRepository.findProfessionalPermissions.mockResolvedValue([PERMISSIONS_MAP.SERVICE.APPROVE.permissionName])

        const result = await servicesUseCase.executeUpdate(serviceId, serviceToUpdate, professionalId)
        expect(result).toEqual(updatedService)
        expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(professionalId)
        expect(MockServiceRepository.update).toHaveBeenCalledWith(serviceId, serviceToUpdate)
      })

      it('should throw forbidden error when manager with permissions override that does not contain service.approvetries to change status', async () => {
        MockProfessionalRepository.findProfessionalPermissions.mockResolvedValue([PERMISSIONS_MAP.DASHBOARD.TOTAL_EMPLOYEES.permissionName])

        await expect(servicesUseCase.executeUpdate(serviceId, serviceToUpdate, professionalId)).rejects.toThrow('Forbidden')
      })
    })

    describe('Non-Manager Scenarios for Status Update', () => {
      const serviceId = faker.string.uuid()
      const professionalId = faker.string.uuid()
      const serviceToUpdate: Prisma.ServiceUpdateInput = {
        status: ServiceStatus.APPROVED
      }
      const existingService: Service = {
        id: serviceId,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        status: ServiceStatus.PENDING,
        createdBy: null,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }
      const manager: Professional = {
        id: professionalId,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        userType: UserType.PROFESSIONAL,
        registerCompleted: true,
        socialMedia: null,
        contact: faker.phone.number(),
        specialization: faker.person.jobType(),
        profilePhotoUrl: faker.internet.url(),
        googleId: null,
        paymentMethods: [],
        passwordHash: faker.internet.password(),
        notificationPreference: NotificationChannel.BOTH,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }
      const updatedService: Service = {
        ...existingService,
        status: ServiceStatus.APPROVED,
        updatedAt: faker.date.recent()
      }

      beforeEach(() => {
        MockServiceRepository.findById.mockResolvedValue(existingService)
        MockProfessionalRepository.findById.mockResolvedValue(manager)
        MockServiceRepository.update.mockResolvedValue(updatedService)
      })

      it('should update service status when non-manager with service.approve permission tries to update status', async () => {
        MockProfessionalRepository.findProfessionalPermissions.mockResolvedValue([PERMISSIONS_MAP.SERVICE.APPROVE.permissionName])

        const result = await servicesUseCase.executeUpdate(serviceId, serviceToUpdate, professionalId)
        expect(result).toEqual(updatedService)
        expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(professionalId)
        expect(MockServiceRepository.update).toHaveBeenCalledWith(serviceId, serviceToUpdate)
      })

      it('should throw forbidden error when non-manager without service.approve permission tries to update status', async () => {
        MockProfessionalRepository.findProfessionalPermissions.mockResolvedValue([])

        const promise = servicesUseCase.executeUpdate(serviceId, serviceToUpdate, professionalId)
        await expect(promise).rejects.toThrow('Forbidden')
      })
    })

    describe('Status Transition Validation', () => {
      it('should allow PENDING to APPROVED transition', async () => {
        const serviceId = faker.string.uuid()
        const professionalId = faker.string.uuid()
        const serviceToUpdate: Prisma.ServiceUpdateInput = {
          status: ServiceStatus.APPROVED
        }

        const existingService: Service = {
          id: serviceId,
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          category: faker.commerce.department(),
          status: ServiceStatus.PENDING,
          createdBy: null,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        }

        const manager: Professional = {
          id: professionalId,
          name: faker.person.fullName(),
          email: faker.internet.email(),
          userType: UserType.MANAGER,
          registerCompleted: true,
          socialMedia: null,
          contact: faker.phone.number(),
          specialization: faker.person.jobType(),
          profilePhotoUrl: faker.internet.url(),
          googleId: null,
          paymentMethods: [],
          passwordHash: faker.internet.password(),
          createdAt: faker.date.past(),
          notificationPreference: NotificationChannel.BOTH,
          updatedAt: faker.date.past()
        }

        const updatedService: Service = {
          ...existingService,
          status: ServiceStatus.APPROVED,
          updatedAt: faker.date.recent()
        }

        MockServiceRepository.findById.mockResolvedValue(existingService)
        MockProfessionalRepository.findById.mockResolvedValue(manager)
        MockServiceRepository.update.mockResolvedValue(updatedService)

        const result = await servicesUseCase.executeUpdate(serviceId, serviceToUpdate, professionalId)
        expect(result.status).toBe(ServiceStatus.APPROVED)
      })

      it('should allow PENDING to REJECTED transition', async () => {
        const serviceId = faker.string.uuid()
        const professionalId = faker.string.uuid()
        const serviceToUpdate: Prisma.ServiceUpdateInput = {
          status: ServiceStatus.REJECTED
        }

        const existingService: Service = {
          id: serviceId,
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          category: faker.commerce.department(),
          status: ServiceStatus.PENDING,
          createdBy: null,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        }

        const manager: Professional = {
          id: professionalId,
          name: faker.person.fullName(),
          email: faker.internet.email(),
          userType: UserType.MANAGER,
          registerCompleted: true,
          socialMedia: null,
          contact: faker.phone.number(),
          specialization: faker.person.jobType(),
          profilePhotoUrl: faker.internet.url(),
          googleId: null,
          paymentMethods: [],
          passwordHash: faker.internet.password(),
          notificationPreference: NotificationChannel.BOTH,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        }

        const updatedService: Service = {
          ...existingService,
          status: ServiceStatus.REJECTED,
          updatedAt: faker.date.recent()
        }

        MockServiceRepository.findById.mockResolvedValue(existingService)
        MockProfessionalRepository.findById.mockResolvedValue(manager)
        MockServiceRepository.update.mockResolvedValue(updatedService)

        const result = await servicesUseCase.executeUpdate(serviceId, serviceToUpdate, professionalId)
        expect(result.status).toBe(ServiceStatus.REJECTED)
      })

      it('should not allow APPROVED to REJECTED transition', async () => {
        const serviceId = faker.string.uuid()
        const professionalId = faker.string.uuid()
        const serviceToUpdate: Prisma.ServiceUpdateInput = {
          status: ServiceStatus.REJECTED
        }

        const existingService: Service = {
          id: serviceId,
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          category: faker.commerce.department(),
          status: ServiceStatus.APPROVED,
          createdBy: null,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        }

        const manager: Professional = {
          id: professionalId,
          name: faker.person.fullName(),
          email: faker.internet.email(),
          userType: UserType.MANAGER,
          registerCompleted: true,
          socialMedia: null,
          contact: faker.phone.number(),
          specialization: faker.person.jobType(),
          profilePhotoUrl: faker.internet.url(),
          googleId: null,
          paymentMethods: [],
          passwordHash: faker.internet.password(),
          notificationPreference: NotificationChannel.BOTH,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        }

        MockServiceRepository.findById.mockResolvedValue(existingService)
        MockProfessionalRepository.findById.mockResolvedValue(manager)

        const promise = servicesUseCase.executeUpdate(serviceId, serviceToUpdate, professionalId)
        await expect(promise).rejects.toThrow('Bad Request')
      })
    })
  })

  describe('executeDelete', () => {
    it('should delete a service', async () => {
      const serviceId = faker.string.uuid()
      const service: Service = {
        id: serviceId,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        status: ServiceStatus.PENDING,
        createdBy: null,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockServiceRepository.findById.mockResolvedValue(service)
      MockServiceRepository.delete.mockResolvedValue(service)

      const result = await servicesUseCase.executeDelete(serviceId)
      expect(result).toEqual(service)
      expect(MockServiceRepository.findById).toHaveBeenCalledWith(serviceId)
      expect(MockServiceRepository.delete).toHaveBeenCalledWith(serviceId)
    })

    it('should throw an error if service to delete is not found', async () => {
      const serviceId = faker.string.uuid()
      MockServiceRepository.findById.mockResolvedValue(null)

      const promise = servicesUseCase.executeDelete(serviceId)
      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeFindAllPaginated', () => {
    it('should return paginated services', async () => {
      const params = {
        page: 1,
        limit: 10,
        filters: {
          name: faker.commerce.productName(),
          category: faker.commerce.department()
        }
      }

      const service: Service = {
        id: faker.string.uuid(),
        name: params.filters.name,
        description: faker.commerce.productDescription(),
        category: params.filters.category,
        status: ServiceStatus.PENDING,
        createdBy: null,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const paginatedResult = {
        data: [service],
        total: 1,
        page: params.page,
        limit: params.limit,
        totalPages: 1
      }

      MockServiceRepository.findAllPaginated.mockResolvedValue(paginatedResult)

      const result = await servicesUseCase.executeFindAllPaginated(params)
      expect(result).toEqual(paginatedResult)
      expect(MockServiceRepository.findAllPaginated).toHaveBeenCalledWith(params)
    })
  })

  describe('fetchProfessionalsOfferingService', () => {
    it('should return professionals offering a service', async () => {
      const serviceId = faker.string.uuid()
      const professionalsOfferingService: ProfessionalsOfferingService = {
        id: serviceId,
        offers: [{
          id: faker.string.uuid(),
          estimatedTime: 60,
          price: new Prisma.Decimal(100),
          professional: {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            specialization: faker.person.jobType(),
            profilePhotoUrl: faker.internet.url(),
            paymentMethods: [
              { name: 'Cartão de Crédito' }
            ]
          }
        }]
      }

      MockServiceRepository.fetchProfessionalsOfferingService.mockResolvedValue({
        professionalsOfferingService
      })

      const result = await servicesUseCase.fetchProfessionalsOfferingService(serviceId)
      expect(result).toEqual({ professionalsOfferingService })
      expect(MockServiceRepository.fetchProfessionalsOfferingService).toHaveBeenCalledWith(serviceId)
    })

    it('should throw an error if service is not found', async () => {
      const serviceId = faker.string.uuid()
      MockServiceRepository.fetchProfessionalsOfferingService.mockResolvedValue({
        professionalsOfferingService: null
      })

      const promise = servicesUseCase.fetchProfessionalsOfferingService(serviceId)
      await expect(promise).rejects.toThrow('Not Found')
    })
  })
})
