import { AnalyticsController } from '../../../controllers/analytics.controller'
import { makeCustomersUseCaseFactory } from '../../../factory/make-customers-use-case.factory'
import { makeServiceUseCaseFactory } from '../../../factory/make-service-use-case.factory'
import { makeProfessionalsUseCaseFactory } from '../../../factory/make-professionals-use-case.factory'
import { makeOffersUseCaseFactory } from '../../../factory/make-offers-use-case.factory'
import { makeAppointmentsUseCaseFactory } from '../../../factory/make-appointments-use-case.factory'
import { vi } from 'vitest'
import { type Appointment } from '@prisma/client'

vi.mock('@/services/appointments.use-case.ts')
vi.mock('@/factory/make-appointments-use-case.factory')
vi.mock('@/factory/make-customers-use-case.factory.ts')
vi.mock('@/factory/make-service-use-case.factory.ts')
vi.mock('@/factory/make-professionals-use-case.factory.ts')
vi.mock('@/factory/make-offers-use-case.factory.ts')
vi.mock('@/factory/make-appointments-use-case.factory.ts')

describe('AnalyticsController', () => {
  let req: any
  let res: any
  let next: any
  let appointmentsUseCaseMock: any
  let customerUseCaseMock: any
  let serviceUseCaseMock: any
  let professionalUseCaseMock: any
  let offerUseCaseMock: any

  beforeEach(() => {
    vi.clearAllMocks()

    req = {
      params: {}
    }

    res = {
      send: vi.fn()
    }

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

    vi.mocked(makeAppointmentsUseCaseFactory).mockReturnValue(appointmentsUseCaseMock)
    vi.mocked(makeCustomersUseCaseFactory).mockReturnValue(customerUseCaseMock)
    vi.mocked(makeServiceUseCaseFactory).mockReturnValue(serviceUseCaseMock)
    vi.mocked(makeProfessionalsUseCaseFactory).mockReturnValue(professionalUseCaseMock)
    vi.mocked(makeOffersUseCaseFactory).mockReturnValue(offerUseCaseMock)
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
})
