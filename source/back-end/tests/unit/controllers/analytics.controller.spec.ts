import { AnalyticsController } from '../../../src/controllers/analytics.controller'
import { makeAppointmentServicesUseCaseFactory } from '../../../src/factory/make-appointment-services-use-case.factory'
import { makeCustomersUseCaseFactory } from '../../../src/factory/make-customers-use-case.factory'
import { makeServiceUseCaseFactory } from '../../../src/factory/make-service-use-case.factory'
import { makeProfessionalsUseCaseFactory } from '../../../src/factory/make-professionals-use-case.factory'
import { makeOffersUseCaseFactory } from '../../../src/factory/make-offers-use-case.factory'
import { makeAppointmentsUseCaseFactory } from '../../../src/factory/make-appointments-use-case.factory'
import { type AppointmentService } from '@prisma/client'
import { vi } from 'vitest'

vi.mock('../../../src/factory/make-appointment-services-use-case.factory.ts')
vi.mock('../../../src/factory/make-customers-use-case.factory.ts')
vi.mock('../../../src/factory/make-service-use-case.factory.ts')
vi.mock('../../../src/factory/make-professionals-use-case.factory.ts')
vi.mock('../../../src/factory/make-offers-use-case.factory.ts')
vi.mock('../../../src/factory/make-appointments-use-case.factory.ts')

describe('AnalyticsController', () => {
  let req: any
  let res: any
  let next: any
  let appointmentServicesUseCaseMock: any
  let customerUseCaseMock: any
  let serviceUseCaseMock: any
  let professionalUseCaseMock: any
  let offerUseCaseMock: any
  let appointmentUseCaseMock: any

  beforeEach(() => {
    vi.clearAllMocks()

    req = {
      params: {}
    }

    res = {
      send: vi.fn()
    }

    next = vi.fn()

    appointmentServicesUseCaseMock = {
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

    appointmentUseCaseMock = {
      executeFindById: vi.fn()
    }

    vi.mocked(makeAppointmentServicesUseCaseFactory).mockReturnValue(appointmentServicesUseCaseMock)
    vi.mocked(makeCustomersUseCaseFactory).mockReturnValue(customerUseCaseMock)
    vi.mocked(makeServiceUseCaseFactory).mockReturnValue(serviceUseCaseMock)
    vi.mocked(makeProfessionalsUseCaseFactory).mockReturnValue(professionalUseCaseMock)
    vi.mocked(makeOffersUseCaseFactory).mockReturnValue(offerUseCaseMock)
    vi.mocked(makeAppointmentsUseCaseFactory).mockReturnValue(appointmentUseCaseMock)
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
      const appointmentServices = [
        { id: '1', status: 'PENDING', serviceOfferedId: '1' },
        { id: '2', status: 'FINISHED', serviceOfferedId: '2' }
      ] as AppointmentService[]
      appointmentServicesUseCaseMock.executeFindAll.mockResolvedValue({ appointmentServices })

      const customers = [{ id: '1' }, { id: '2' }]
      customerUseCaseMock.executeFindAll.mockResolvedValue({ customers })

      const services = [{ id: '1' }, { id: '2' }]
      serviceUseCaseMock.executeFindAll.mockResolvedValue({ services })

      const professionals = [{ id: '1' }, { id: '2' }]
      professionalUseCaseMock.executeFindAll.mockResolvedValue({ professionals })

      const offer = { id: '1', price: 100 }
      offerUseCaseMock.executeFindById.mockResolvedValue(offer)

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
      appointmentServicesUseCaseMock.executeFindAll.mockRejectedValue(error)

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

      const appointmentServices = [
        { id: '1', status: 'PENDING', serviceOfferedId: '1', appointmentId: '1' },
        { id: '2', status: 'FINISHED', serviceOfferedId: '1', appointmentId: '2' }
      ] as AppointmentService[]
      appointmentServicesUseCaseMock.executeFindByServiceOfferedId.mockResolvedValue({ appointmentServices })

      const appointment = { id: '1', customerId: '1' }
      appointmentUseCaseMock.executeFindById.mockResolvedValue(appointment)

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
