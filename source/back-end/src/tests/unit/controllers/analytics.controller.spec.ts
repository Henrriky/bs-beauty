import { AnalyticsController } from '../../../controllers/analytics.controller'
import { makeCustomersUseCaseFactory } from '../../../factory/make-customers-use-case.factory'
import { makeServiceUseCaseFactory } from '../../../factory/make-service-use-case.factory'
import { makeProfessionalsUseCaseFactory } from '../../../factory/make-professionals-use-case.factory'
import { makeOffersUseCaseFactory } from '../../../factory/make-offers-use-case.factory'
import { makeAppointmentsUseCaseFactory } from '../../../factory/make-appointments-use-case.factory'
import { makeRatingsUseCaseFactory } from '../../../factory/make-ratings-use-case.factory'
import { makeAnalyticsUseCaseFactory } from '../../../factory/make-analytics-use-case.factory'
import { vi } from 'vitest'
import { type Appointment } from '@prisma/client'
import { mockRequest, mockResponse, type MockRequest } from '../utils/test-utilts'
import { type Response } from 'express'

vi.mock('@/services/appointments.use-case.ts')
vi.mock('@/factory/make-appointments-use-case.factory')
vi.mock('@/factory/make-customers-use-case.factory.ts')
vi.mock('@/factory/make-service-use-case.factory.ts')
vi.mock('@/factory/make-professionals-use-case.factory.ts')
vi.mock('@/factory/make-offers-use-case.factory.ts')
vi.mock('@/factory/make-appointments-use-case.factory.ts')
vi.mock('@/factory/make-ratings-use-case.factory.ts')
vi.mock('@/factory/make-analytics-use-case.factory.ts')

describe('AnalyticsController', () => {
  let req: MockRequest
  let res: Response
  let next: any
  let appointmentsUseCaseMock: any
  let customerUseCaseMock: any
  let serviceUseCaseMock: any
  let professionalUseCaseMock: any
  let offerUseCaseMock: any
  let ratingsUseCaseMock: any
  let analyticsUseCaseMock: any

  beforeEach(() => {
    vi.clearAllMocks()

    req = mockRequest()

    res = mockResponse()

    next = vi.fn()

    appointmentsUseCaseMock = {
      executeFindAll: vi.fn(),
      executeFindByServiceOfferedId: vi.fn()
    }

    customerUseCaseMock = {
      executeFindAll: vi.fn()
    }

    serviceUseCaseMock = {
      executeFindAll: vi.fn()
    }

    professionalUseCaseMock = {
      executeFindAll: vi.fn()
    }

    offerUseCaseMock = {
      executeFindById: vi.fn(),
      executeFindByProfessionalId: vi.fn()
    }

    ratingsUseCaseMock = {
      executeGetMeanScore: vi.fn()
    }

    analyticsUseCaseMock = {
      executeGetTopProfessionalsRatingsAnalytics: vi.fn(),
      executeGetCustomerAmountPerRatingScore: vi.fn(),
      executeGetMeanRatingByService: vi.fn(),
      executeGetMeanRatingOfProfessionals: vi.fn(),
      executeGetAppointmentNumberOnDateRangeByStatusProfessionalAndServices: vi.fn(),
      executeGetEstimatedAppointmentTimeByProfessionalAndServices: vi.fn(),
      executeGetAppointmentCancelationRateByProfessional: vi.fn()
    }

    vi.mocked(makeAppointmentsUseCaseFactory).mockReturnValue(appointmentsUseCaseMock)
    vi.mocked(makeCustomersUseCaseFactory).mockReturnValue(customerUseCaseMock)
    vi.mocked(makeServiceUseCaseFactory).mockReturnValue(serviceUseCaseMock)
    vi.mocked(makeProfessionalsUseCaseFactory).mockReturnValue(professionalUseCaseMock)
    vi.mocked(makeOffersUseCaseFactory).mockReturnValue(offerUseCaseMock)
    vi.mocked(makeRatingsUseCaseFactory).mockReturnValue(ratingsUseCaseMock)
    vi.mocked(makeAnalyticsUseCaseFactory).mockReturnValue(analyticsUseCaseMock)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be defined', () => {
    expect(AnalyticsController).toBeDefined()
  })

  describe('handleFindAll', () => {
    it('should return analytics data', async () => {
      // arrange
      const appointments = [
        { id: '1', status: 'PENDING', serviceOfferedId: '1' },
        { id: '2', status: 'FINISHED', serviceOfferedId: '2' }
      ] as Appointment[]
      appointmentsUseCaseMock.executeFindAll.mockResolvedValue({ appointments })

      const offer = { id: '1', price: 100 }
      offerUseCaseMock.executeFindById.mockResolvedValue(offer)

      const customers = [{ id: '1' }, { id: '2' }]
      customerUseCaseMock.executeFindAll.mockResolvedValue({ customers })

      const services = [{ id: '1' }, { id: '2' }]
      serviceUseCaseMock.executeFindAll.mockResolvedValue({ services })

      const professionals = [{ id: '1' }, { id: '2' }]
      professionalUseCaseMock.executeFindAll.mockResolvedValue({ professionals })

      // act
      await AnalyticsController.handleFindAll(req, res, next)

      // assert
      expect(res.send).toHaveBeenCalledWith({
        totalAppointments: 2,
        newAppointments: 1,
        finishedAppointments: 1,
        totalCustomers: 2,
        numberOfServices: 2,
        numberOfProfessionals: 2,
        totalRevenue: 100
      })
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle errors and call next', async () => {
      // arrange
      const error = new Error('Database connection failed')
      appointmentsUseCaseMock.executeFindAll.mockRejectedValue(error)

      // act
      await AnalyticsController.handleFindAll(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(error)
      expect(res.send).not.toHaveBeenCalled()
    })
  })

  describe('handleFindByProfessionalId', () => {
    it('should return analytics data for a specific professional', async () => {
      // arrange
      const professionalId = '1'
      req.params.id = professionalId

      const offers = [{ id: '1', price: 100 }]
      offerUseCaseMock.executeFindByProfessionalId.mockResolvedValue({ offers })

      const appointments = [
        { id: '1', status: 'PENDING', serviceOfferedId: '1' },
        { id: '2', status: 'FINISHED', serviceOfferedId: '2' }
      ] as Appointment[]
      appointmentsUseCaseMock.executeFindByServiceOfferedId.mockResolvedValue({ appointments })

      // act
      await AnalyticsController.handleFindByProfessionalId(req, res, next)

      // assert
      expect(res.send).toHaveBeenCalledWith({
        totalAppointments: 2,
        newAppointments: 1,
        finishedAppointments: 1,
        totalCustomers: 1,
        numberOfServices: 1,
        totalRevenue: 100
      })
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle errors and call next', async () => {
      // arrange
      const professionalId = '1'
      req.params.id = professionalId

      const error = new Error('Database connection failed')
      offerUseCaseMock.executeFindByProfessionalId.mockRejectedValue(error)

      // act
      await AnalyticsController.handleFindByProfessionalId(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(error)
      expect(res.send).not.toHaveBeenCalled()
    })
  })

  describe('handleGetRatingsAnalytics', () => {
    it('should return ratings analytics', async () => {
      // arrange
      const professionals = [
        { id: '1', name: 'Professional 1', meanRating: 4.5, ratingCount: 10 },
        { id: '2', name: 'Professional 2', meanRating: 4.8, ratingCount: 15 }
      ]
      const salonRating = { meanScore: 4.6, ratingCount: 25 }

      analyticsUseCaseMock.executeGetTopProfessionalsRatingsAnalytics.mockResolvedValue(professionals)
      ratingsUseCaseMock.executeGetMeanScore.mockResolvedValue(salonRating)

      // act
      await AnalyticsController.handleGetRatingsAnalytics(req, res, next)

      // assert
      expect(res.send).toHaveBeenCalledWith({ professionals, salonRating })
      expect(analyticsUseCaseMock.executeGetTopProfessionalsRatingsAnalytics).toHaveBeenCalledWith(5)
      expect(ratingsUseCaseMock.executeGetMeanScore).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle errors and call next', async () => {
      // arrange
      const error = new Error('Failed to get ratings analytics')
      analyticsUseCaseMock.executeGetTopProfessionalsRatingsAnalytics.mockRejectedValue(error)

      // act
      await AnalyticsController.handleGetRatingsAnalytics(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(error)
      expect(res.send).not.toHaveBeenCalled()
    })
  })

  describe('handleGetCustomerAmountPerRatingScore', () => {
    it('should return customer amount per rating score', async () => {
      // arrange
      req.user = {
        id: 'user-1',
        userType: 'MANAGER',
        email: 'manager@example.com',
        name: 'Manager User',
        registerCompleted: true,
        userId: 'user-1',
        profilePhotoUrl: null,
        permissions: []
      }
      req.query = {
        professionalId: 'prof-1',
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-01-31T23:59:59Z'
      }

      const customerCountPerRating = { 1: 0, 2: 1, 3: 2, 4: 5, 5: 10 }
      analyticsUseCaseMock.executeGetCustomerAmountPerRatingScore.mockResolvedValue(customerCountPerRating)

      // act
      await AnalyticsController.handleGetCustomerAmountPerRatingScore(req, res, next)

      // assert
      expect(res.send).toHaveBeenCalledWith(customerCountPerRating)
      expect(analyticsUseCaseMock.executeGetCustomerAmountPerRatingScore).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle errors and call next', async () => {
      // arrange
      req.user = {
        id: 'user-1',
        userType: 'MANAGER',
        email: 'manager@example.com',
        name: 'Manager User',
        registerCompleted: true,
        userId: 'user-1',
        profilePhotoUrl: null,
        permissions: []
      }
      const error = new Error('Failed to get customer amount per rating score')
      analyticsUseCaseMock.executeGetCustomerAmountPerRatingScore.mockRejectedValue(error)

      // act
      await AnalyticsController.handleGetCustomerAmountPerRatingScore(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(error)
      expect(res.send).not.toHaveBeenCalled()
    })
  })

  describe('handleGetMeanRatingByService', () => {
    it('should return mean rating by service', async () => {
      // arrange
      req.body = { amount: 5 }
      const meanRatingByService = [
        { service: { id: '1', name: 'Service 1' }, meanRating: 4.5 },
        { service: { id: '2', name: 'Service 2' }, meanRating: 4.8 }
      ]
      analyticsUseCaseMock.executeGetMeanRatingByService.mockResolvedValue(meanRatingByService)

      // act
      await AnalyticsController.handleGetMeanRatingByService(req, res, next)

      // assert
      expect(res.send).toHaveBeenCalledWith(meanRatingByService)
      expect(analyticsUseCaseMock.executeGetMeanRatingByService).toHaveBeenCalledWith(5)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle errors and call next', async () => {
      // arrange
      const error = new Error('Failed to get mean rating by service')
      analyticsUseCaseMock.executeGetMeanRatingByService.mockRejectedValue(error)

      // act
      await AnalyticsController.handleGetMeanRatingByService(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(error)
      expect(res.send).not.toHaveBeenCalled()
    })
  })

  describe('handleGetMeanRatingOfProfessionals', () => {
    it('should return mean rating of professionals', async () => {
      // arrange
      req.body = { amount: 10 }
      const meanRatingByProfessional = [
        { professional: { id: '1', name: 'Professional 1' }, meanRating: 4.7 },
        { professional: { id: '2', name: 'Professional 2' }, meanRating: 4.9 }
      ]
      analyticsUseCaseMock.executeGetMeanRatingOfProfessionals.mockResolvedValue(meanRatingByProfessional)

      // act
      await AnalyticsController.handleGetMeanRatingOfProfessionals(req, res, next)

      // assert
      expect(res.send).toHaveBeenCalledWith(meanRatingByProfessional)
      expect(analyticsUseCaseMock.executeGetMeanRatingOfProfessionals).toHaveBeenCalledWith(10)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle errors and call next', async () => {
      // arrange
      const error = new Error('Failed to get mean rating of professionals')
      analyticsUseCaseMock.executeGetMeanRatingOfProfessionals.mockRejectedValue(error)

      // act
      await AnalyticsController.handleGetMeanRatingOfProfessionals(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(error)
      expect(res.send).not.toHaveBeenCalled()
    })
  })

  describe('handleGetAppointmentAmountInDateRangeByStatusAndProfessional', () => {
    it('should return appointment amount in date range', async () => {
      // arrange
      req.user = {
        id: 'user-1',
        userType: 'MANAGER',
        email: 'manager@example.com',
        name: 'Manager User',
        registerCompleted: true,
        userId: 'user-1',
        profilePhotoUrl: null,
        permissions: []
      }
      req.body = {
        startDate: '2025-01-01T00:00:00.000Z',
        endDate: '2025-01-31T23:59:59.999Z',
        statusList: ['FINISHED', 'PENDING'],
        professionalId: '550e8400-e29b-41d4-a716-446655440000',
        serviceIds: ['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002']
      }

      const result = {
        groupBy: 'day',
        data: [{ period: '2025-01-01', count: 10 }]
      }
      analyticsUseCaseMock.executeGetAppointmentNumberOnDateRangeByStatusProfessionalAndServices.mockResolvedValue(result)

      // act
      await AnalyticsController.handleGetAppointmentAmountInDateRangeByStatusAndProfessional(req, res, next)

      // assert
      expect(res.json).toHaveBeenCalledWith(result)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle errors and call next', async () => {
      // arrange
      req.user = {
        id: 'user-1',
        userType: 'MANAGER',
        email: 'manager@example.com',
        name: 'Manager User',
        registerCompleted: true,
        userId: 'user-1',
        profilePhotoUrl: null,
        permissions: []
      }
      req.body = {
        startDate: '2025-01-01T00:00:00.000Z',
        endDate: '2025-01-31T23:59:59.999Z'
      }
      const error = new Error('Failed to get appointment amount')
      analyticsUseCaseMock.executeGetAppointmentNumberOnDateRangeByStatusProfessionalAndServices.mockRejectedValue(error)

      // act
      await AnalyticsController.handleGetAppointmentAmountInDateRangeByStatusAndProfessional(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(error)
      expect(res.json).not.toHaveBeenCalled()
    })
  })

  describe('handleGetEstimatedAppointmentTimeInDateRangeByProfessional', () => {
    it('should return estimated appointment time', async () => {
      // arrange
      req.user = {
        id: 'user-1',
        userType: 'MANAGER',
        email: 'manager@example.com',
        name: 'Manager User',
        registerCompleted: true,
        userId: 'user-1',
        profilePhotoUrl: null,
        permissions: []
      }
      req.body = {
        startDate: '2025-01-01T00:00:00.000Z',
        endDate: '2025-01-31T23:59:59.999Z',
        professionalId: '550e8400-e29b-41d4-a716-446655440000',
        serviceIds: ['550e8400-e29b-41d4-a716-446655440001']
      }

      const result = {
        groupBy: 'week',
        data: [{ period: '2025-01-01', estimatedTimeInMinutes: 480 }]
      }
      analyticsUseCaseMock.executeGetEstimatedAppointmentTimeByProfessionalAndServices.mockResolvedValue(result)

      // act
      await AnalyticsController.handleGetEstimatedAppointmentTimeInDateRangeByProfessional(req, res, next)

      // assert
      expect(res.json).toHaveBeenCalledWith(result)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle errors and call next', async () => {
      // arrange
      req.user = {
        id: 'user-1',
        userType: 'MANAGER',
        email: 'manager@example.com',
        name: 'Manager User',
        registerCompleted: true,
        userId: 'user-1',
        profilePhotoUrl: null,
        permissions: []
      }
      req.body = {
        startDate: '2025-01-01T00:00:00.000Z',
        endDate: '2025-01-31T23:59:59.999Z'
      }
      const error = new Error('Failed to get estimated time')
      analyticsUseCaseMock.executeGetEstimatedAppointmentTimeByProfessionalAndServices.mockRejectedValue(error)

      // act
      await AnalyticsController.handleGetEstimatedAppointmentTimeInDateRangeByProfessional(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(error)
      expect(res.json).not.toHaveBeenCalled()
    })
  })

  describe('handleGetAppointmentCancelationRateByProfessional', () => {
    it('should return appointment cancelation rate', async () => {
      // arrange
      req.user = {
        id: 'user-1',
        userType: 'MANAGER',
        email: 'manager@example.com',
        name: 'Manager User',
        registerCompleted: true,
        userId: 'user-1',
        profilePhotoUrl: null,
        permissions: []
      }
      req.body = {
        startDate: '2025-01-01T00:00:00.000Z',
        endDate: '2025-01-31T23:59:59.999Z',
        professionalId: '550e8400-e29b-41d4-a716-446655440000',
        serviceIds: ['550e8400-e29b-41d4-a716-446655440001']
      }

      const cancelationRate = {
        totalAppointments: 100,
        canceledAppointments: 10
      }
      analyticsUseCaseMock.executeGetAppointmentCancelationRateByProfessional.mockResolvedValue(cancelationRate)

      // act
      await AnalyticsController.handleGetAppointmentCancelationRateByProfessional(req, res, next)

      // assert
      expect(res.json).toHaveBeenCalledWith(cancelationRate)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle errors and call next', async () => {
      // arrange
      req.user = {
        id: 'user-1',
        userType: 'MANAGER',
        email: 'manager@example.com',
        name: 'Manager User',
        registerCompleted: true,
        userId: 'user-1',
        profilePhotoUrl: null,
        permissions: []
      }
      req.body = {
        startDate: '2025-01-01T00:00:00.000Z',
        endDate: '2025-01-31T23:59:59.999Z'
      }
      const error = new Error('Failed to get cancelation rate')
      analyticsUseCaseMock.executeGetAppointmentCancelationRateByProfessional.mockRejectedValue(error)

      // act
      await AnalyticsController.handleGetAppointmentCancelationRateByProfessional(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(error)
      expect(res.json).not.toHaveBeenCalled()
    })
  })
})
