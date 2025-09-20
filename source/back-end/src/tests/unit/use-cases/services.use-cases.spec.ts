import { ServicesUseCase } from '@/services/services.use-case'
import { MockServiceRepository } from '../utils/mocks/repository'
import { faker } from '@faker-js/faker'
import { Prisma, type Service } from '@prisma/client'
import { type ProfessionalsOfferingService } from '@/repository/types/service-repository.types'

describe('ServicesUseCase (Unit Tests)', () => {
  let servicesUseCase: ServicesUseCase

  beforeEach(() => {
    servicesUseCase = new ServicesUseCase(MockServiceRepository)
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
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        },
        {
          id: faker.string.uuid(),
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          category: faker.commerce.department(),
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
    it('should create a service', async () => {
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
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockServiceRepository.create.mockResolvedValue(createdService)

      const result = await servicesUseCase.executeCreate(serviceToCreate)
      expect(result).toEqual(createdService)
      expect(MockServiceRepository.create).toHaveBeenCalledWith(serviceToCreate)
    })
  })

  describe('executeUpdate', () => {
    it('should update a service', async () => {
      const serviceId = faker.string.uuid()
      const serviceToUpdate: Prisma.ServiceUpdateInput = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription()
      }

      const existingService: Service = {
        id: serviceId,
        name: 'Old name',
        description: 'Old description',
        category: faker.commerce.department(),
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

      const result = await servicesUseCase.executeUpdate(serviceId, serviceToUpdate)
      expect(result).toEqual(updatedService)
      expect(MockServiceRepository.findById).toHaveBeenCalledWith(serviceId)
      expect(MockServiceRepository.update).toHaveBeenCalledWith(serviceId, serviceToUpdate)
    })

    it('should throw an error if service to update is not found', async () => {
      const serviceId = faker.string.uuid()
      const serviceToUpdate: Prisma.ServiceUpdateInput = {
        name: faker.commerce.productName()
      }

      MockServiceRepository.findById.mockResolvedValue(null)

      const promise = servicesUseCase.executeUpdate(serviceId, serviceToUpdate)
      await expect(promise).rejects.toThrow('Not Found')
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
            profilePhotoUrl: faker.internet.url()
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
