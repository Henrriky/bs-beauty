import { type NextFunction, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { z } from 'zod'
import { RegisterUserController } from '../../../../controllers/auth/register-user.controller'
import { makeRegisterUserUseCase } from '../../../../factory/auth/make-register-user.use-case.factory'
import { type RegisterUserUseCase } from '../../../../services/use-cases/auth/register-user.use-case'
import { type MockRequest, mockRequest, mockResponse } from '../../utils/test-utilts'
import { CustomerSchemas } from '../../../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { ProfessionalSchemas } from '../../../../utils/validation/zod-schemas/professional.zod-schemas.validation.utils'
import { formatValidationErrors } from '../../../../utils/formatting/zod-validation-errors.formatting.util'
import { CustomError } from '../../../../utils/errors/custom.error.util'
import { NotificationChannel, type Professional } from '@prisma/client'

vi.mock('../../../../factory/auth/make-register-user.use-case.factory', () => ({
  makeRegisterUserUseCase: vi.fn()
}))

vi.mock('../../../../utils/formatting/zod-validation-errors.formatting.util', () => ({
  formatValidationErrors: vi.fn()
}))

describe('RegisterUserController', () => {
  let req: MockRequest
  let res: Response
  let next: NextFunction
  let usecaseMock: RegisterUserUseCase

  beforeEach(() => {
    vi.clearAllMocks()

    req = mockRequest({
      headers: {},
      body: {},
      params: {}
    })

    res = mockResponse()
    next = vi.fn()

    // Create manual mock for RegisterUserUseCase
    usecaseMock = {
      executeRegisterCustomer: vi.fn(),
      executeRegisterProfessional: vi.fn(),
      executeFindProfessionalByEmail: vi.fn()
    } as any

    vi.mocked(makeRegisterUserUseCase).mockReturnValue(usecaseMock)
  })

  it('should be defined', () => {
    expect(RegisterUserController).toBeDefined()
  })

  describe('handleRegisterCustomer', () => {
    it('should register customer successfully with valid data', async () => {
      // arrange
      const validCustomerData = {
        email: faker.internet.email(),
        password: 'Test@123456',
        confirmPassword: 'Test@123456'
      }

      req.body = validCustomerData

      vi.spyOn(CustomerSchemas.registerCustomerBodySchema, 'parse').mockReturnValue(validCustomerData)
      vi.mocked(usecaseMock.executeRegisterCustomer).mockResolvedValueOnce(undefined)

      // act
      await RegisterUserController.handleRegisterCustomer(req, res, next)

      // assert
      expect(CustomerSchemas.registerCustomerBodySchema.parse).toHaveBeenCalledWith(validCustomerData)
      expect(usecaseMock.executeRegisterCustomer).toHaveBeenCalledWith(validCustomerData)
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Verification code sent to provided email'
      })
    })

    it('should call next when use case throws CustomError', async () => {
      // arrange
      const validCustomerData = {
        email: faker.internet.email(),
        password: 'Test@123456',
        confirmPassword: 'Test@123456'
      }

      req.body = validCustomerData

      vi.spyOn(CustomerSchemas.registerCustomerBodySchema, 'parse').mockReturnValue(validCustomerData)
      const customError = new CustomError('Bad Request', 400, 'User already exists')
      vi.mocked(usecaseMock.executeRegisterCustomer).mockRejectedValueOnce(customError)

      // act
      await RegisterUserController.handleRegisterCustomer(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(customError)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
    })

    it('should format validation errors when ZodError is thrown', async () => {
      // arrange
      const invalidData = {
        email: 'invalid-email',
        password: '123',
        confirmPassword: '456'
      }

      req.body = invalidData

      const zodError = new z.ZodError([])
      vi.spyOn(CustomerSchemas.registerCustomerBodySchema, 'parse').mockImplementation(() => {
        throw zodError
      })

      // act
      await RegisterUserController.handleRegisterCustomer(req, res, next)

      // assert
      expect(formatValidationErrors).toHaveBeenCalledWith(zodError, res)
      expect(usecaseMock.executeRegisterCustomer).not.toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next when unknown error is thrown', async () => {
      // arrange
      const validCustomerData = {
        email: faker.internet.email(),
        password: 'Test@123456',
        confirmPassword: 'Test@123456'
      }

      req.body = validCustomerData

      vi.spyOn(CustomerSchemas.registerCustomerBodySchema, 'parse').mockReturnValue(validCustomerData)
      const unknownError = new Error('Unknown error')
      vi.mocked(usecaseMock.executeRegisterCustomer).mockRejectedValueOnce(unknownError)

      // act
      await RegisterUserController.handleRegisterCustomer(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(unknownError)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
    })
  })

  describe('handleRegisterProfessional', () => {
    it('should register professional successfully with valid data', async () => {
      // arrange
      const validProfessionalData = {
        email: faker.internet.email(),
        password: 'Test@123456',
        confirmPassword: 'Test@123456'
      }

      req.body = validProfessionalData

      vi.spyOn(ProfessionalSchemas.registerProfessionalBodySchema, 'parse').mockReturnValue(validProfessionalData)
      vi.mocked(usecaseMock.executeRegisterProfessional).mockResolvedValueOnce(undefined)

      // act
      await RegisterUserController.handleRegisterProfessional(req, res, next)

      // assert
      expect(ProfessionalSchemas.registerProfessionalBodySchema.parse).toHaveBeenCalledWith(validProfessionalData)
      expect(usecaseMock.executeRegisterProfessional).toHaveBeenCalledWith(validProfessionalData)
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Professional registered successfully'
      })
    })

    it('should call next when use case throws CustomError', async () => {
      // arrange
      const validProfessionalData = {
        email: faker.internet.email(),
        password: 'Test@123456',
        confirmPassword: 'Test@123456'
      }

      req.body = validProfessionalData

      vi.spyOn(ProfessionalSchemas.registerProfessionalBodySchema, 'parse').mockReturnValue(validProfessionalData)
      const customError = new CustomError('Bad Request', 400, 'Professional not found')
      vi.mocked(usecaseMock.executeRegisterProfessional).mockRejectedValueOnce(customError)

      // act
      await RegisterUserController.handleRegisterProfessional(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(customError)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
    })

    it('should format validation errors when ZodError is thrown', async () => {
      // arrange
      const invalidData = {
        email: 'invalid-email',
        password: '123',
        confirmPassword: '456'
      }

      req.body = invalidData

      const zodError = new z.ZodError([])
      vi.spyOn(ProfessionalSchemas.registerProfessionalBodySchema, 'parse').mockImplementation(() => {
        throw zodError
      })

      // act
      await RegisterUserController.handleRegisterProfessional(req, res, next)

      // assert
      expect(formatValidationErrors).toHaveBeenCalledWith(zodError, res)
      expect(usecaseMock.executeRegisterProfessional).not.toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next when unknown error is thrown', async () => {
      // arrange
      const validProfessionalData = {
        email: faker.internet.email(),
        password: 'Test@123456',
        confirmPassword: 'Test@123456'
      }

      req.body = validProfessionalData

      vi.spyOn(ProfessionalSchemas.registerProfessionalBodySchema, 'parse').mockReturnValue(validProfessionalData)
      const unknownError = new Error('Unknown error')
      vi.mocked(usecaseMock.executeRegisterProfessional).mockRejectedValueOnce(unknownError)

      // act
      await RegisterUserController.handleRegisterProfessional(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(unknownError)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
    })
  })

  describe('handleFindProfessionalByEmail', () => {
    it('should find professional successfully with valid email', async () => {
      // arrange
      const email = faker.internet.email()
      const mockProfessional: Professional = {
        id: faker.string.uuid(),
        email,
        name: faker.person.fullName(),
        passwordHash: faker.string.alphanumeric(60),
        contact: faker.phone.number(),
        specialization: faker.person.jobTitle(),
        socialMedia: [],
        paymentMethods: [],
        notificationPreference: NotificationChannel.ALL,
        googleId: null,
        registerCompleted: true,
        profilePhotoUrl: null,
        userType: 'PROFESSIONAL',
        isCommissioned: false,
        commissionRate: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      req.params = { email }

      vi.mocked(usecaseMock.executeFindProfessionalByEmail).mockResolvedValueOnce(mockProfessional)

      // act
      await RegisterUserController.handleFindProfessionalByEmail(req, res, next)

      // assert
      expect(usecaseMock.executeFindProfessionalByEmail).toHaveBeenCalledWith(email)
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith({
        professional: mockProfessional
      })
    })

    it('should call next when use case throws CustomError', async () => {
      // arrange
      const email = faker.internet.email()
      req.params = { email }

      const customError = new CustomError('Bad Request', 400, 'Professional not found')
      vi.mocked(usecaseMock.executeFindProfessionalByEmail).mockRejectedValueOnce(customError)

      // act
      await RegisterUserController.handleFindProfessionalByEmail(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(customError)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
    })

    it('should format validation errors when ZodError is thrown', async () => {
      // arrange
      const email = faker.internet.email()
      req.params = { email }

      const zodError = new z.ZodError([])
      vi.mocked(usecaseMock.executeFindProfessionalByEmail).mockRejectedValueOnce(zodError)

      // act
      await RegisterUserController.handleFindProfessionalByEmail(req, res, next)

      // assert
      expect(formatValidationErrors).toHaveBeenCalledWith(zodError, res)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
    })

    it('should call next when unknown error is thrown', async () => {
      // arrange
      const email = faker.internet.email()
      req.params = { email }

      const unknownError = new Error('Unknown error')
      vi.mocked(usecaseMock.executeFindProfessionalByEmail).mockRejectedValueOnce(unknownError)

      // act
      await RegisterUserController.handleFindProfessionalByEmail(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(unknownError)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
    })
  })
})
