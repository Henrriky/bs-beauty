import { type Response } from 'express'
import { type AppointmentsUseCase } from '@/services/appointments.use-case'
import { type Mocked } from 'vitest'
import { $Enums, type Appointment, Status } from '@prisma/client'
import { faker } from '@faker-js/faker'

import { mockRequest, mockResponse, type MockRequest } from '../utils/test-utilts'
import { makeAppointmentsUseCaseFactory } from '@/factory/make-appointments-use-case.factory'
import { AppointmentController } from '@/controllers/appointments.controller'
import { CustomError } from '@/utils/errors/custom.error.util'

vi.mock('@/factory/make-appointments-use-case.factory')

describe('AppointmentsController', () => {
  let req: MockRequest
  let res: Response
  let next: any
  let useCaseMock: Mocked<AppointmentsUseCase>

  beforeEach(() => {
    vi.clearAllMocks()

    req = mockRequest({
      user: {
        id: 'mocked-id',
        userId: 'mocked-id',
        sub: 'mocked-id',
        userType: $Enums.UserType.MANAGER,
        email: faker.internet.email(),
        name: faker.person.firstName(),
        registerCompleted: true,
        profilePhotoUrl: faker.image.url()
      }
    })
    res = mockResponse()
    next = vi.fn()

    useCaseMock = {
      executeFindAll: vi.fn(),
      executeFindById: vi.fn(),
      executeFindByCustomerOrProfessionalId: vi.fn(),
      executeFindByServiceOfferedId: vi.fn(),
      executeCreate: vi.fn(),
      executeUpdate: vi.fn(),
      executeDelete: vi.fn()
    } as unknown as Mocked<AppointmentsUseCase>

    vi.mocked(makeAppointmentsUseCaseFactory).mockReturnValue(useCaseMock)
  })

  it('should be defined', () => {
    expect(AppointmentController).toBeDefined()
  })

  describe('handleCreate', () => {
    it('should create an appointment', async () => {
      const ONE_HOUR_IN_MILLISECONDS = 1000 * 60 * 60
      const appointmentDateOneHourInFuture = new Date(new Date().getTime() + ONE_HOUR_IN_MILLISECONDS)
      const appointmentToCreate: Appointment = {
        id: faker.string.uuid(),
        customerId: faker.string.uuid(),
        serviceOfferedId: faker.string.uuid(),
        status: Status.PENDING,
        appointmentDate: appointmentDateOneHourInFuture,
        observation: '',
        allowImageUse: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      useCaseMock.executeCreate.mockResolvedValue(appointmentToCreate)
      req.body = appointmentToCreate

      await AppointmentController.handleCreate(req, res, next)

      expect(req.body).toEqual(appointmentToCreate)
      expect(res.send).toHaveBeenCalledWith(appointmentToCreate)
      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with error when use case throw an error', async () => {
      const error = new CustomError('Error creating appointment', 404)
      useCaseMock.executeCreate.mockRejectedValueOnce(error)

      await AppointmentController.handleCreate(req, res, next)

      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
