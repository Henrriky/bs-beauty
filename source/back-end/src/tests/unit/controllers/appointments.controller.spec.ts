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
        profilePhotoUrl: faker.image.url(),
        permissions: []
      }
    })
    res = mockResponse()
    next = vi.fn()

    useCaseMock = {
      executeFindAll: vi.fn(),
      executeFindAllPaginated: vi.fn(),
      executeFindById: vi.fn(),
      executeFindByCustomerOrProfessionalId: vi.fn(),
      executeFindByServiceOfferedId: vi.fn(),
      executeCreate: vi.fn(),
      executeUpdate: vi.fn(),
      executeFinishAppointment: vi.fn(),
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

  describe('handleFindAll', () => {
    it('should find all appointments with pagination for manager with viewAll', async () => {
      req.user.userType = $Enums.UserType.MANAGER
      req.query = {
        page: '1',
        limit: '10',
        viewAll: 'true'
      }

      const mockResult = {
        data: [{
          id: faker.string.uuid(),
          customerId: faker.string.uuid(),
          serviceOfferedId: faker.string.uuid(),
          status: Status.PENDING,
          appointmentDate: new Date(),
          observation: '',
          allowImageUse: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }],
        total: 1,
        page: 1,
        totalPages: 1,
        limit: 10
      }

      useCaseMock.executeFindAllPaginated.mockResolvedValue(mockResult)

      await AppointmentController.handleFindAll(req, res, next)

      expect(useCaseMock.executeFindAllPaginated).toHaveBeenCalledWith(
        { page: 1, limit: 10, filters: { from: undefined, to: undefined, status: undefined, viewAll: true } },
        { userId: req.user.id, viewAll: true }
      )
      expect(res.send).toHaveBeenCalledWith(mockResult)
      expect(next).not.toHaveBeenCalled()
    })

    it('should find all appointments for professional without viewAll', async () => {
      req.user.userType = $Enums.UserType.PROFESSIONAL
      req.query = {
        page: '1',
        limit: '10',
        viewAll: 'true' // Should be ignored for non-manager
      }

      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 10
      }

      useCaseMock.executeFindAllPaginated.mockResolvedValue(mockResult)

      await AppointmentController.handleFindAll(req, res, next)

      expect(useCaseMock.executeFindAllPaginated).toHaveBeenCalledWith(
        { page: 1, limit: 10, filters: { from: undefined, to: undefined, status: undefined, viewAll: true } },
        { userId: req.user.id, viewAll: false }
      )
      expect(res.send).toHaveBeenCalledWith(mockResult)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with error when use case throws', async () => {
      req.query = { page: '1', limit: '10' }
      const error = new CustomError('Error fetching appointments', 500)
      useCaseMock.executeFindAllPaginated.mockRejectedValue(error)

      await AppointmentController.handleFindAll(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleFindById', () => {
    it('should find appointment by id', async () => {
      const appointmentId = faker.string.uuid()
      req.params = { id: appointmentId }

      const mockAppointment = {
        id: appointmentId,
        customerId: faker.string.uuid(),
        serviceOfferedId: faker.string.uuid(),
        status: Status.PENDING,
        appointmentDate: new Date(),
        observation: '',
        allowImageUse: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        customer: {
          id: faker.string.uuid(),
          name: faker.person.firstName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          birthdate: new Date(),
          registerCompleted: true,
          alwaysAllowImageUse: false,
          notificationPreference: $Enums.NotificationChannel.IN_APP,
          discoverySource: $Enums.DiscoverySource.GOOGLE,
          profilePhotoUrl: faker.image.url(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        offer: {
          id: faker.string.uuid(),
          estimatedTime: 60,
          price: faker.commerce.price({ min: 50, max: 200, dec: 2 }) as any,
          professionalId: faker.string.uuid(),
          service: {
            name: faker.commerce.productName()
          },
          professional: {
            id: faker.string.uuid(),
            userType: $Enums.UserType.PROFESSIONAL,
            registerCompleted: true,
            name: faker.person.firstName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            profilePhotoUrl: faker.image.url(),
            birthdate: new Date(),
            cpf: '12345678901',
            emailVerified: true,
            password: faker.internet.password(),
            passwordHash: faker.internet.password(),
            googleId: null,
            notificationPreference: $Enums.NotificationChannel.IN_APP,
            paymentMethods: [],
            discoverySource: null,
            alwaysAllowImageUse: false,
            isCommissioned: false,
            commissionRate: null,
            socialMedia: null,
            contact: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            specialization: 'Especialização'
          }
        }
      }

      useCaseMock.executeFindById.mockResolvedValue(mockAppointment)

      await AppointmentController.handleFindById(req, res, next)

      expect(useCaseMock.executeFindById).toHaveBeenCalledWith(appointmentId)
      expect(res.send).toHaveBeenCalledWith(mockAppointment)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with error when use case throws', async () => {
      req.params = { id: faker.string.uuid() }
      const error = new CustomError('Appointment not found', 404)
      useCaseMock.executeFindById.mockRejectedValue(error)

      await AppointmentController.handleFindById(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleFindByCustomerOrProfessionalId', () => {
    it('should find appointments by customer or professional id', async () => {
      const mockAppointments = [
        {
          id: faker.string.uuid(),
          customerId: req.user.id,
          serviceOfferedId: faker.string.uuid(),
          status: Status.PENDING,
          appointmentDate: new Date(),
          observation: '',
          allowImageUse: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      useCaseMock.executeFindByCustomerOrProfessionalId.mockResolvedValue({
        appointments: mockAppointments
      })

      await AppointmentController.handleFindByCustomerOrProfessionalId(req, res, next)

      expect(useCaseMock.executeFindByCustomerOrProfessionalId).toHaveBeenCalledWith(req.user.id)
      expect(res.send).toHaveBeenCalledWith({ appointments: mockAppointments })
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with error when use case throws', async () => {
      const error = new CustomError('Error fetching appointments', 500)
      useCaseMock.executeFindByCustomerOrProfessionalId.mockRejectedValue(error)

      await AppointmentController.handleFindByCustomerOrProfessionalId(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleFindByServiceOfferedId', () => {
    it('should find appointments by service offered id', async () => {
      const serviceOfferedId = faker.string.uuid()
      req.params = { serviceOfferedId }

      const mockAppointments = [
        {
          id: faker.string.uuid(),
          customerId: faker.string.uuid(),
          serviceOfferedId,
          status: Status.PENDING,
          appointmentDate: new Date(),
          observation: '',
          allowImageUse: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      useCaseMock.executeFindByServiceOfferedId.mockResolvedValue({
        appointments: mockAppointments
      })

      await AppointmentController.handleFindByServiceOfferedId(req, res, next)

      expect(useCaseMock.executeFindByServiceOfferedId).toHaveBeenCalledWith(serviceOfferedId)
      expect(res.send).toHaveBeenCalledWith({ appointments: mockAppointments })
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with error when use case throws', async () => {
      req.params = { serviceOfferedId: faker.string.uuid() }
      const error = new CustomError('Error fetching appointments', 500)
      useCaseMock.executeFindByServiceOfferedId.mockRejectedValue(error)

      await AppointmentController.handleFindByServiceOfferedId(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleUpdate', () => {
    it('should update an appointment', async () => {
      const appointmentId = faker.string.uuid()
      req.params = { id: appointmentId }
      req.body = {
        observation: 'Updated observation',
        status: Status.CONFIRMED
      }

      const mockUpdatedAppointment: Appointment = {
        id: appointmentId,
        customerId: faker.string.uuid(),
        serviceOfferedId: faker.string.uuid(),
        status: Status.CONFIRMED,
        appointmentDate: new Date(),
        observation: 'Updated observation',
        allowImageUse: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      useCaseMock.executeUpdate.mockResolvedValue(mockUpdatedAppointment)

      await AppointmentController.handleUpdate(req, res, next)

      expect(useCaseMock.executeUpdate).toHaveBeenCalledWith(appointmentId, req.body, req.user)
      expect(res.send).toHaveBeenCalledWith(mockUpdatedAppointment)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with error when use case throws', async () => {
      req.params = { id: faker.string.uuid() }
      req.body = { observation: 'Updated' }
      const error = new CustomError('Error updating appointment', 500)
      useCaseMock.executeUpdate.mockRejectedValue(error)

      await AppointmentController.handleUpdate(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleFinishAppointment', () => {
    it('should finish an appointment', async () => {
      const appointmentId = faker.string.uuid()
      req.params = { id: appointmentId }

      const mockFinishedAppointment: Appointment = {
        id: appointmentId,
        customerId: faker.string.uuid(),
        serviceOfferedId: faker.string.uuid(),
        status: Status.FINISHED,
        appointmentDate: new Date(),
        observation: '',
        allowImageUse: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      useCaseMock.executeFinishAppointment.mockResolvedValue(mockFinishedAppointment)

      await AppointmentController.handleFinishAppointment(req, res, next)

      expect(useCaseMock.executeFinishAppointment).toHaveBeenCalledWith(req.user, appointmentId)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith(mockFinishedAppointment)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with error when use case throws', async () => {
      req.params = { id: faker.string.uuid() }
      const error = new CustomError('Error finishing appointment', 500)
      useCaseMock.executeFinishAppointment.mockRejectedValue(error)

      await AppointmentController.handleFinishAppointment(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleDelete', () => {
    it('should delete an appointment', async () => {
      const appointmentId = faker.string.uuid()
      req.params = { id: appointmentId }

      const mockDeletedAppointment: Appointment = {
        id: appointmentId,
        customerId: faker.string.uuid(),
        serviceOfferedId: faker.string.uuid(),
        status: Status.CANCELLED,
        appointmentDate: new Date(),
        observation: '',
        allowImageUse: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      useCaseMock.executeDelete.mockResolvedValue(mockDeletedAppointment)

      await AppointmentController.handleDelete(req, res, next)

      expect(useCaseMock.executeDelete).toHaveBeenCalledWith(req.user.id, appointmentId)
      expect(res.send).toHaveBeenCalledWith(mockDeletedAppointment)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with error when use case throws', async () => {
      req.params = { id: faker.string.uuid() }
      const error = new CustomError('Error deleting appointment', 500)
      useCaseMock.executeDelete.mockRejectedValue(error)

      await AppointmentController.handleDelete(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
