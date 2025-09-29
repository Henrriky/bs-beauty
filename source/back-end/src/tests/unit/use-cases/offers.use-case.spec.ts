import { OffersUseCase } from '@/services/offers.use-case'
import {
  MockAppointmentRepository,
  MockOfferRepository,
  MockServiceRepository,
  MockShiftRepository
} from '../utils/mocks/repository'
import { faker } from '@faker-js/faker'
import { Prisma, type Offer, type Service, ServiceStatus, type Shift } from '@prisma/client'
import { DateFormatter } from '@/utils/formatting/date.formatting.util'

describe('OffersUseCase (Unit Tests)', () => {
  let offersUseCase: OffersUseCase

  beforeEach(() => {
    offersUseCase = new OffersUseCase(
      MockOfferRepository,
      MockShiftRepository,
      MockAppointmentRepository,
      MockServiceRepository
    )
  })

  it('should be defined', () => {
    expect(offersUseCase).toBeDefined()
  })

  describe('executeFindAll', () => {
    it('should return all offers', async () => {
      const offers: Offer[] = [
        {
          id: faker.string.uuid(),
          estimatedTime: 60,
          price: new Prisma.Decimal(100),
          isOffering: true,
          serviceId: faker.string.uuid(),
          professionalId: faker.string.uuid(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        },
        {
          id: faker.string.uuid(),
          estimatedTime: 90,
          price: new Prisma.Decimal(150),
          isOffering: true,
          serviceId: faker.string.uuid(),
          professionalId: faker.string.uuid(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        }
      ]

      MockOfferRepository.findAll.mockResolvedValue(offers)

      const result = await offersUseCase.executeFindAll()
      expect(result).toEqual({ offers })
      expect(MockOfferRepository.findAll).toHaveBeenCalled()
    })

    it('should throw an error if no offers are found', async () => {
      MockOfferRepository.findAll.mockResolvedValue([])

      const promise = offersUseCase.executeFindAll()
      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeFindById', () => {
    it('should return an offer by id', async () => {
      const offer: Offer = {
        id: faker.string.uuid(),
        estimatedTime: 60,
        price: new Prisma.Decimal(100),
        isOffering: true,
        serviceId: faker.string.uuid(),
        professionalId: faker.string.uuid(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockOfferRepository.findById.mockResolvedValue(offer)

      const result = await offersUseCase.executeFindById(offer.id)
      expect(result).toEqual(offer)
      expect(MockOfferRepository.findById).toHaveBeenCalledWith(offer.id)
    })

    it('should throw an error if offer is not found', async () => {
      const offerId = faker.string.uuid()
      MockOfferRepository.findById.mockResolvedValue(null)

      const promise = offersUseCase.executeFindById(offerId)
      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeFindByServiceId', () => {
    it('should return an offer by service id', async () => {
      const serviceId = faker.string.uuid()
      const offer: Offer = {
        id: faker.string.uuid(),
        estimatedTime: 60,
        price: new Prisma.Decimal(100),
        isOffering: true,
        serviceId,
        professionalId: faker.string.uuid(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockOfferRepository.findByServiceId.mockResolvedValue(offer)

      const result = await offersUseCase.executeFindByServiceId(serviceId)
      expect(result).toEqual(offer)
      expect(MockOfferRepository.findByServiceId).toHaveBeenCalledWith(serviceId)
    })

    it('should throw an error if offer is not found by service id', async () => {
      const serviceId = faker.string.uuid()
      MockOfferRepository.findByServiceId.mockResolvedValue(null)

      const promise = offersUseCase.executeFindByServiceId(serviceId)
      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeFindByProfessionalId', () => {
    it('should return offers by professional id', async () => {
      const professionalId = faker.string.uuid()
      const offers: Offer[] = [
        {
          id: faker.string.uuid(),
          estimatedTime: 60,
          price: new Prisma.Decimal(100),
          isOffering: true,
          serviceId: faker.string.uuid(),
          professionalId,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        }
      ]

      MockOfferRepository.findByProfessionalId.mockResolvedValue(offers)

      const result = await offersUseCase.executeFindByProfessionalId(professionalId)
      expect(result).toEqual({ offers })
      expect(MockOfferRepository.findByProfessionalId).toHaveBeenCalledWith(professionalId)
    })

    it('should throw an error if no offers are found by professional id', async () => {
      const professionalId = faker.string.uuid()
      MockOfferRepository.findByProfessionalId.mockResolvedValue([])

      const promise = offersUseCase.executeFindByProfessionalId(professionalId)
      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeCreate', () => {
    it('should create an offer for approved service', async () => {
      const serviceId = faker.string.uuid()
      const professionalId = faker.string.uuid()

      // Simular como o código realmente usa os dados
      const offerToCreate = {
        estimatedTime: 60,
        price: new Prisma.Decimal(100),
        isOffering: true,
        serviceId,
        professionalId
      } as unknown as Prisma.OfferCreateInput

      const service: Service = {
        id: serviceId,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        status: ServiceStatus.APPROVED,
        createdBy: null,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const createdOffer: Offer = {
        id: faker.string.uuid(),
        estimatedTime: 60,
        price: new Prisma.Decimal(100),
        isOffering: true,
        serviceId,
        professionalId,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockOfferRepository.findByProfessionalAndServiceId.mockResolvedValue(null)
      MockServiceRepository.findById.mockResolvedValue(service)
      MockOfferRepository.create.mockResolvedValue(createdOffer)

      const result = await offersUseCase.executeCreate(offerToCreate)

      expect(result).toEqual(createdOffer)
      expect(MockOfferRepository.findByProfessionalAndServiceId).toHaveBeenCalledWith(serviceId, professionalId)
      expect(MockServiceRepository.findById).toHaveBeenCalledWith(serviceId)
      expect(MockOfferRepository.create).toHaveBeenCalledWith(offerToCreate)
    })

    it('should throw an error if offer already exists', async () => {
      const serviceId = faker.string.uuid()
      const professionalId = faker.string.uuid()

      const offerToCreate = {
        estimatedTime: 60,
        price: new Prisma.Decimal(100),
        isOffering: true,
        serviceId,
        professionalId
      } as unknown as Prisma.OfferCreateInput

      const existingOffer: Offer = {
        id: faker.string.uuid(),
        estimatedTime: 60,
        price: new Prisma.Decimal(100),
        isOffering: true,
        serviceId,
        professionalId,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockOfferRepository.findByProfessionalAndServiceId.mockResolvedValue(existingOffer)

      const promise = offersUseCase.executeCreate(offerToCreate)
      await expect(promise).rejects.toThrow('Bad Request')
    })

    it('should throw an error if service is not found', async () => {
      const serviceId = faker.string.uuid()
      const professionalId = faker.string.uuid()

      const offerToCreate = {
        estimatedTime: 60,
        price: new Prisma.Decimal(100),
        isOffering: true,
        serviceId,
        professionalId
      } as unknown as Prisma.OfferCreateInput

      MockOfferRepository.findByProfessionalAndServiceId.mockResolvedValue(null)
      MockServiceRepository.findById.mockResolvedValue(null)

      const promise = offersUseCase.executeCreate(offerToCreate)
      await expect(promise).rejects.toThrow('Not Found')
    })

    it('should throw an error if service is not approved', async () => {
      const serviceId = faker.string.uuid()
      const professionalId = faker.string.uuid()

      const offerToCreate = {
        estimatedTime: 60,
        price: new Prisma.Decimal(100),
        isOffering: true,
        serviceId,
        professionalId
      } as unknown as Prisma.OfferCreateInput

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

      MockOfferRepository.findByProfessionalAndServiceId.mockResolvedValue(null)
      MockServiceRepository.findById.mockResolvedValue(service)

      const promise = offersUseCase.executeCreate(offerToCreate)
      await expect(promise).rejects.toThrow('Bad Request')
    })
  })

  describe('executeUpdate', () => {
    it('should update an offer', async () => {
      const offerId = faker.string.uuid()
      const offerToUpdate: Prisma.OfferUpdateInput = {
        price: new Prisma.Decimal(120),
        estimatedTime: 75
      }

      const existingOffer: Offer = {
        id: offerId,
        estimatedTime: 60,
        price: new Prisma.Decimal(100),
        isOffering: true,
        serviceId: faker.string.uuid(),
        professionalId: faker.string.uuid(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const updatedOffer: Offer = {
        ...existingOffer,
        price: new Prisma.Decimal(120),
        estimatedTime: 75,
        updatedAt: faker.date.recent()
      }

      MockOfferRepository.findById.mockResolvedValue(existingOffer)
      MockOfferRepository.update.mockResolvedValue(updatedOffer)

      const result = await offersUseCase.executeUpdate(offerId, offerToUpdate)

      expect(result).toEqual(updatedOffer)
      expect(MockOfferRepository.findById).toHaveBeenCalledWith(offerId)
      expect(MockOfferRepository.update).toHaveBeenCalledWith(offerId, offerToUpdate)
    })

    it('should throw an error if offer to update is not found', async () => {
      const offerId = faker.string.uuid()
      const offerToUpdate: Prisma.OfferUpdateInput = {
        price: new Prisma.Decimal(120)
      }

      MockOfferRepository.findById.mockResolvedValue(null)

      const promise = offersUseCase.executeUpdate(offerId, offerToUpdate)
      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeDelete', () => {
    it('should delete an offer', async () => {
      const offerId = faker.string.uuid()
      const offer: Offer = {
        id: offerId,
        estimatedTime: 60,
        price: new Prisma.Decimal(100),
        isOffering: true,
        serviceId: faker.string.uuid(),
        professionalId: faker.string.uuid(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockOfferRepository.findById.mockResolvedValue(offer)
      MockOfferRepository.delete.mockResolvedValue(offer)

      const result = await offersUseCase.executeDelete(offerId)

      expect(result).toEqual(offer)
      expect(MockOfferRepository.findById).toHaveBeenCalledWith(offerId)
      expect(MockOfferRepository.delete).toHaveBeenCalledWith(offerId)
    })

    it('should throw an error if offer to delete is not found', async () => {
      const offerId = faker.string.uuid()

      MockOfferRepository.findById.mockResolvedValue(null)

      const promise = offersUseCase.executeDelete(offerId)
      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeFindByProfessionalIdPaginated', () => {
    it('should return paginated offers by professional id', async () => {
      const professionalId = faker.string.uuid()
      const params = {
        page: 1,
        limit: 10,
        filters: {
          isOffering: true
        }
      }

      const offer: Offer = {
        id: faker.string.uuid(),
        estimatedTime: 60,
        price: new Prisma.Decimal(100),
        isOffering: true,
        serviceId: faker.string.uuid(),
        professionalId,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const paginatedResult = {
        data: [offer],
        total: 1,
        page: params.page,
        limit: params.limit,
        totalPages: 1
      }

      MockOfferRepository.findByProfessionalIdPaginated.mockResolvedValue(paginatedResult)

      const result = await offersUseCase.executeFindByProfessionalIdPaginated(professionalId, params)

      expect(result).toEqual(paginatedResult)
      expect(MockOfferRepository.findByProfessionalIdPaginated).toHaveBeenCalledWith(professionalId, params)
    })
  })

  describe('executeFetchAvailableSchedulingToOfferByDay', () => {
    it('should return available scheduling when offer exists and professional works on day', async () => {
      const customerId = faker.string.uuid()
      const serviceOfferingId = faker.string.uuid()
      const professionalId = faker.string.uuid()
      const dayToFetch = new Date('2025-09-20T00:00:00.000Z')
      const dayOfWeekToFetch = DateFormatter.formatDayOfDateToWeekDay(dayToFetch)

      const offer: Offer = {
        id: serviceOfferingId,
        estimatedTime: 60,
        price: new Prisma.Decimal(100),
        isOffering: true,
        serviceId: faker.string.uuid(),
        professionalId,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const shift: Shift = {
        id: faker.string.uuid(),
        weekDay: dayOfWeekToFetch,
        isBusy: false,
        shiftStart: new Date('2025-09-20T08:00:00.000Z'),
        shiftEnd: new Date('2025-09-20T18:00:00.000Z'),
        professionalId
      }

      MockOfferRepository.findById.mockResolvedValue(offer)
      MockShiftRepository.findByProfessionalAndWeekDay.mockResolvedValue(shift)
      MockAppointmentRepository.findNonFinishedByUserAndDay.mockResolvedValue({
        validAppointmentsOnDay: []
      })

      const result = await offersUseCase.executeFetchAvailableSchedulingToOfferByDay({
        customerId,
        serviceOfferingId,
        dayToFetchAvailableSchedulling: dayToFetch
      })

      expect(result).toHaveProperty('availableSchedulling')
      expect(Array.isArray(result.availableSchedulling)).toBe(true)
      expect(MockOfferRepository.findById).toHaveBeenCalledWith(serviceOfferingId)
      expect(MockShiftRepository.findByProfessionalAndWeekDay).toHaveBeenCalledWith(professionalId, dayOfWeekToFetch)
    })

    it('should throw an error if offer does not exist or is not offering', async () => {
      const customerId = faker.string.uuid()
      const serviceOfferingId = faker.string.uuid()
      const dayToFetch = new Date('2025-09-20T00:00:00.000Z')

      MockOfferRepository.findById.mockResolvedValue(null)

      const promise = offersUseCase.executeFetchAvailableSchedulingToOfferByDay({
        customerId,
        serviceOfferingId,
        dayToFetchAvailableSchedulling: dayToFetch
      })

      await expect(promise).rejects.toThrow('Unable to fetch available scheduling because offer not exists or is not being offering')
    })

    it('should throw an error if professional does not work on the day', async () => {
      const customerId = faker.string.uuid()
      const serviceOfferingId = faker.string.uuid()
      const professionalId = faker.string.uuid()
      const dayToFetch = new Date('2025-09-20T00:00:00.000Z')

      const offer: Offer = {
        id: serviceOfferingId,
        estimatedTime: 60,
        price: new Prisma.Decimal(100),
        isOffering: true,
        serviceId: faker.string.uuid(),
        professionalId,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockOfferRepository.findById.mockResolvedValue(offer)
      MockShiftRepository.findByProfessionalAndWeekDay.mockResolvedValue(null)

      const promise = offersUseCase.executeFetchAvailableSchedulingToOfferByDay({
        customerId,
        serviceOfferingId,
        dayToFetchAvailableSchedulling: dayToFetch
      })

      await expect(promise).rejects.toThrow('Unable to fetch available scheduling because professional does not work on this day or not exists')
    })
  })
})
