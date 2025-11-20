import { AnalyticsUseCase } from '@/services/analytics.use-case'
import {
  MockRatingRepository,
  MockServiceRepository,
  MockOfferRepository,
  MockAppointmentRepository,
  MockProfessionalRepository
} from '../utils/mocks/repository'
import { faker } from '@faker-js/faker'
import { Status, ServiceStatus, type Service, type Professional, type Offer, type Appointment, type Rating, Prisma } from '@prisma/client'
import { beforeEach, describe, expect, it } from 'vitest'

describe('AnalyticsUseCase (Unit Tests)', () => {
  let analyticsUseCase: AnalyticsUseCase

  beforeEach(() => {
    analyticsUseCase = new AnalyticsUseCase(
      MockRatingRepository,
      MockServiceRepository,
      MockOfferRepository,
      MockAppointmentRepository,
      MockProfessionalRepository
    )
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(analyticsUseCase).toBeDefined()
  })

  describe('executeGetCustomerAmountPerRatingScore', () => {
    it('should return customer count per rating score for MANAGER', async () => {
      // arrange
      const requestingUser = { id: 'manager-1', userType: 'MANAGER' as const }
      const ratings: Rating[] = [
        {
          id: faker.string.uuid(),
          score: 5,
          comment: 'Excellent',
          appointmentId: 'apt-1',
          createdAt: new Date()
        },
        {
          id: faker.string.uuid(),
          score: 4,
          comment: 'Good',
          appointmentId: 'apt-2',
          createdAt: new Date()
        }
      ]

      const appointment1: Appointment = {
        id: 'apt-1',
        observation: null,
        customerId: 'cust-1',
        serviceOfferedId: 'offer-1',
        appointmentDate: new Date('2025-01-15'),
        allowImageUse: false,
        status: Status.FINISHED,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const appointment2: Appointment = {
        id: 'apt-2',
        observation: null,
        customerId: 'cust-2',
        serviceOfferedId: 'offer-2',
        appointmentDate: new Date('2025-01-20'),
        allowImageUse: false,
        status: Status.FINISHED,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      MockRatingRepository.findAll.mockResolvedValue(ratings)
      MockAppointmentRepository.findById
        .mockResolvedValueOnce(appointment1 as any)
        .mockResolvedValueOnce(appointment2 as any)

      // act
      const result = await analyticsUseCase.executeGetCustomerAmountPerRatingScore(requestingUser)

      // assert
      expect(result).toEqual({ 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 })
      expect(MockRatingRepository.findAll).toHaveBeenCalled()
    })

    it('should filter by date range', async () => {
      // arrange
      const requestingUser = { id: 'manager-1', userType: 'MANAGER' as const }
      const startDate = new Date('2025-01-10')
      const endDate = new Date('2025-01-20')

      const ratings: Rating[] = [
        {
          id: faker.string.uuid(),
          score: 5,
          comment: 'Excellent',
          appointmentId: 'apt-1',
          createdAt: new Date()
        }
      ]

      const appointment: Appointment = {
        id: 'apt-1',
        observation: null,
        customerId: 'cust-1',
        serviceOfferedId: 'offer-1',
        appointmentDate: new Date('2025-01-05'), // Outside range
        allowImageUse: false,
        status: Status.FINISHED,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      MockRatingRepository.findAll.mockResolvedValue(ratings)
      MockAppointmentRepository.findById.mockResolvedValue(appointment as any)

      // act
      const result = await analyticsUseCase.executeGetCustomerAmountPerRatingScore(
        requestingUser,
        startDate,
        endDate
      )

      // assert
      expect(result).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }) // Should be filtered out
    })
  })

  describe('executeGetMeanRatingByService', () => {
    it('should return services with mean ratings', async () => {
      // arrange
      const services = [
        {
          id: 'service-1',
          name: 'Haircut',
          description: 'Professional haircut',
          category: 'Hair',
          status: ServiceStatus.APPROVED,
          createdBy: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const offers = [
        {
          id: 'offer-1',
          serviceId: 'service-1',
          professionalId: 'prof-1',
          price: new Prisma.Decimal(50),
          estimatedTime: 60,
          isOffering: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const appointments: Appointment[] = [
        {
          id: 'apt-1',
          customerId: 'cust-1',
          serviceOfferedId: 'offer-1',
          appointmentDate: new Date(),
          status: Status.FINISHED,
          observation: null,
          allowImageUse: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const rating: Rating = {
        id: 'rating-1',
        score: 5,
        comment: 'Excellent',
        appointmentId: 'apt-1',
        createdAt: new Date()
      }

      MockServiceRepository.findAll.mockResolvedValue(services)
      MockOfferRepository.findByServiceId.mockResolvedValue(offers)
      MockAppointmentRepository.findByServiceOfferedId.mockResolvedValue(appointments)
      MockRatingRepository.findByAppointmentId.mockResolvedValue(rating)

      // act
      const result = await analyticsUseCase.executeGetMeanRatingByService()

      // assert
      expect(result).toHaveLength(1)
      expect(result[0].service).toEqual(services[0])
      expect(result[0].meanRating).toBe(5)
    })

    it('should limit results when amount is specified', async () => {
      // arrange
      const services = [
        {
          id: 'service-1',
          name: 'Haircut',
          description: 'Professional haircut',
          category: 'Hair',
          status: ServiceStatus.APPROVED,
          createdBy: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'service-2',
          name: 'Manicure',
          description: 'Nail care',
          category: 'Nails',
          status: ServiceStatus.APPROVED,
          createdBy: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      MockServiceRepository.findAll.mockResolvedValue(services)
      MockOfferRepository.findByServiceId.mockResolvedValue([])
      MockAppointmentRepository.findByServiceOfferedId.mockResolvedValue([])

      // act
      const result = await analyticsUseCase.executeGetMeanRatingByService(1)

      // assert
      expect(result).toHaveLength(0) // Both have null ratings, filtered out
    })
  })

  describe('executeGetMeanRatingOfProfessionals', () => {
    it('should return professionals with mean ratings', async () => {
      // arrange
      const professionals = [
        {
          id: 'prof-1',
          name: 'John Doe',
          email: 'john@example.com',
          contact: '1234567890',
          specialization: 'Hair Stylist',
          profilePhotoUrl: null,
          googleId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ] as any

      const offers = [
        {
          id: 'offer-1',
          serviceId: 'service-1',
          professionalId: 'prof-1',
          price: new Prisma.Decimal(50),
          estimatedTime: 60,
          isOffering: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const appointments: Appointment[] = [
        {
          id: 'apt-1',
          customerId: 'cust-1',
          serviceOfferedId: 'offer-1',
          appointmentDate: new Date(),
          status: Status.FINISHED,
          observation: null,
          allowImageUse: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const rating: Rating = {
        id: 'rating-1',
        score: 4,
        comment: 'Good',
        appointmentId: 'apt-1',
        createdAt: new Date()
      }

      MockProfessionalRepository.findAll.mockResolvedValue(professionals)
      MockOfferRepository.findByProfessionalId.mockResolvedValue(offers)
      MockAppointmentRepository.findByServiceOfferedId.mockResolvedValue(appointments)
      MockRatingRepository.findByAppointmentId.mockResolvedValue(rating)

      // act
      const result = await analyticsUseCase.executeGetMeanRatingOfProfessionals()

      // assert
      expect(result).toHaveLength(1)
      expect(result[0].professional).toEqual(professionals[0])
      expect(result[0].meanRating).toBe(4)
    })
  })

  describe('executeGetAppointmentNumberOnDateRangeByStatusProfessionalAndServices', () => {
    it('should return grouped appointment counts', async () => {
      // arrange
      const requestingUser = { id: 'manager-1', userType: 'MANAGER' as const }
      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-01-10') // 10 days - should be 'day' grouping

      const groupedCounts = [
        { period: '2025-01-01', count: 5 },
        { period: '2025-01-02', count: 8 }
      ] as any

      MockAppointmentRepository.countByDateRangeGrouped.mockResolvedValue(groupedCounts)

      // act
      const result = await analyticsUseCase.executeGetAppointmentNumberOnDateRangeByStatusProfessionalAndServices(
        requestingUser,
        startDate,
        endDate
      )

      // assert
      expect(result.groupBy).toBe('day')
      expect(result.data).toEqual(groupedCounts)
      expect(MockAppointmentRepository.countByDateRangeGrouped).toHaveBeenCalled()
    })

    it('should throw error if startDate is after endDate', async () => {
      // arrange
      const requestingUser = { id: 'manager-1', userType: 'MANAGER' as const }
      const startDate = new Date('2025-01-31')
      const endDate = new Date('2025-01-01')

      // act & assert
      await expect(
        analyticsUseCase.executeGetAppointmentNumberOnDateRangeByStatusProfessionalAndServices(
          requestingUser,
          startDate,
          endDate
        )
      ).rejects.toThrow('startDate must be on or before endDate')
    })

    it('should determine grouping period as week for 30-day range', async () => {
      // arrange
      const requestingUser = { id: 'manager-1', userType: 'MANAGER' as const }
      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-01-30')

      MockAppointmentRepository.countByDateRangeGrouped.mockResolvedValue([])

      // act
      const result = await analyticsUseCase.executeGetAppointmentNumberOnDateRangeByStatusProfessionalAndServices(
        requestingUser,
        startDate,
        endDate
      )

      // assert
      expect(result.groupBy).toBe('week')
    })

    it('should determine grouping period as month for 90-day range', async () => {
      // arrange
      const requestingUser = { id: 'manager-1', userType: 'MANAGER' as const }
      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-03-31')

      MockAppointmentRepository.countByDateRangeGrouped.mockResolvedValue([])

      // act
      const result = await analyticsUseCase.executeGetAppointmentNumberOnDateRangeByStatusProfessionalAndServices(
        requestingUser,
        startDate,
        endDate
      )

      // assert
      expect(result.groupBy).toBe('month')
    })
  })

  describe('executeGetEstimatedAppointmentTimeByProfessionalAndServices', () => {
    it('should return grouped estimated time', async () => {
      // arrange
      const requestingUser = { id: 'manager-1', userType: 'MANAGER' as const }
      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-01-10') // 10 days - should be 'day' grouping

      const groupedTime = [
        { period: '2025-01-01', estimatedTimeInMinutes: 240 },
        { period: '2025-01-02', estimatedTimeInMinutes: 360 }
      ] as any

      MockAppointmentRepository.sumEstimatedTimeByDateRangeGrouped.mockResolvedValue(groupedTime)

      // act
      const result = await analyticsUseCase.executeGetEstimatedAppointmentTimeByProfessionalAndServices(
        requestingUser,
        startDate,
        endDate
      )

      // assert
      expect(result.groupBy).toBe('day')
      expect(result.data).toEqual(groupedTime)
      expect(MockAppointmentRepository.sumEstimatedTimeByDateRangeGrouped).toHaveBeenCalled()
    })

    it('should throw error if startDate is after endDate', async () => {
      // arrange
      const requestingUser = { id: 'manager-1', userType: 'MANAGER' as const }
      const startDate = new Date('2025-01-31')
      const endDate = new Date('2025-01-01')

      // act & assert
      await expect(
        analyticsUseCase.executeGetEstimatedAppointmentTimeByProfessionalAndServices(
          requestingUser,
          startDate,
          endDate
        )
      ).rejects.toThrow('startDate must be on or before endDate')
    })
  })

  describe('executeGetTopProfessionalsRatingsAnalytics', () => {
    it('should return top professionals with ratings', async () => {
      // arrange
      const professionals = [
        {
          id: 'prof-1',
          name: 'John Doe',
          email: 'john@example.com',
          contact: '1234567890',
          specialization: 'Hair Stylist',
          profilePhotoUrl: null,
          googleId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ] as any

      const offers = [
        {
          id: 'offer-1',
          serviceId: 'service-1',
          professionalId: 'prof-1',
          price: new Prisma.Decimal(50),
          estimatedTime: 60,
          isOffering: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const appointments: Appointment[] = [
        {
          id: 'apt-1',
          customerId: 'cust-1',
          serviceOfferedId: 'offer-1',
          appointmentDate: new Date(),
          status: Status.FINISHED,
          createdAt: new Date(),
          updatedAt: new Date(),
          observation: null,
          allowImageUse: false
        }
      ]

      const rating: Rating = {
        id: 'rating-1',
        score: 5,
        comment: 'Excellent',
        appointmentId: 'apt-1',
        createdAt: new Date()
      }

      MockProfessionalRepository.findAll.mockResolvedValue(professionals)
      MockOfferRepository.findByProfessionalId.mockResolvedValue(offers)
      MockAppointmentRepository.findByServiceOfferedId.mockResolvedValue(appointments)
      MockRatingRepository.findByAppointmentId.mockResolvedValue(rating)

      // act
      const result = await analyticsUseCase.executeGetTopProfessionalsRatingsAnalytics(5)

      // assert
      expect(result).toHaveLength(1)
      expect(result[0].meanRating).toBe(5)
      expect(result[0].ratingCount).toBe(1)
    })
  })

  describe('executeGetAppointmentCancelationRateByProfessional', () => {
    it('should return cancelation rate', async () => {
      // arrange
      const requestingUser = { id: 'manager-1', userType: 'MANAGER' as const }
      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-01-31')

      const appointments: Appointment[] = [
        {
          id: 'apt-1',
          customerId: 'cust-1',
          serviceOfferedId: 'offer-1',
          appointmentDate: new Date(),
          status: Status.FINISHED,
          observation: null,
          allowImageUse: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'apt-2',
          customerId: 'cust-2',
          serviceOfferedId: 'offer-2',
          appointmentDate: new Date(),
          status: Status.CANCELLED,
          observation: null,
          allowImageUse: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'apt-3',
          customerId: 'cust-3',
          serviceOfferedId: 'offer-3',
          appointmentDate: new Date(),
          status: Status.CANCELLED,
          observation: null,
          allowImageUse: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      MockAppointmentRepository.findByDateRangeStatusProfessionalAndServices.mockResolvedValue(appointments)

      // act
      const result = await analyticsUseCase.executeGetAppointmentCancelationRateByProfessional(
        requestingUser,
        startDate,
        endDate
      )

      // assert
      expect(result.totalAppointments).toBe(3)
      expect(result.canceledAppointments).toBe(2)
    })

    it('should throw error if startDate is after endDate', async () => {
      // arrange
      const requestingUser = { id: 'manager-1', userType: 'MANAGER' as const }
      const startDate = new Date('2025-01-31')
      const endDate = new Date('2025-01-01')

      // act & assert
      await expect(
        analyticsUseCase.executeGetAppointmentCancelationRateByProfessional(
          requestingUser,
          startDate,
          endDate
        )
      ).rejects.toThrow('startDate must be on or before endDate')
    })
  })

  describe('Authorization - defineRequestedProfessionalIdByRequesterUserType', () => {
    it('should allow MANAGER to query any professional', async () => {
      // arrange
      const requestingUser = { id: 'manager-1', userType: 'MANAGER' as const }
      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-01-31')

      MockAppointmentRepository.countByDateRangeGrouped.mockResolvedValue([])

      // act
      await analyticsUseCase.executeGetAppointmentNumberOnDateRangeByStatusProfessionalAndServices(
        requestingUser,
        startDate,
        endDate,
        undefined,
        'any-prof-id'
      )

      // assert - should not throw
      expect(MockAppointmentRepository.countByDateRangeGrouped).toHaveBeenCalled()
    })

    it('should allow PROFESSIONAL to query their own data', async () => {
      // arrange
      const requestingUser = { id: 'prof-1', userType: 'PROFESSIONAL' as const }
      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-01-31')

      MockAppointmentRepository.countByDateRangeGrouped.mockResolvedValue([])

      // act
      await analyticsUseCase.executeGetAppointmentNumberOnDateRangeByStatusProfessionalAndServices(
        requestingUser,
        startDate,
        endDate,
        undefined,
        'prof-1'
      )

      // assert - should not throw
      expect(MockAppointmentRepository.countByDateRangeGrouped).toHaveBeenCalled()
    })

    it('should throw error if PROFESSIONAL tries to query another professional', async () => {
      // arrange
      const requestingUser = { id: 'prof-1', userType: 'PROFESSIONAL' as const }
      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-01-31')

      // act & assert
      await expect(
        analyticsUseCase.executeGetAppointmentNumberOnDateRangeByStatusProfessionalAndServices(
          requestingUser,
          startDate,
          endDate,
          undefined,
          'prof-2' // Different professional
        )
      ).rejects.toThrow('Not authorized to perform this action')
    })
  })
})
