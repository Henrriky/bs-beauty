import { faker } from '@faker-js/faker'
import { UserType } from '@prisma/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { makeCompleteUserRegisterUseCase } from '../../../../src/factory/auth/make-complete-user-register.use-case.factory'
import { CustomerSchemas } from '../../../../src/utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { CompleteUserRegisterController } from '../../../../src/controllers/auth/complete-user-register.controller'

vi.mock('../../../../src/factory/auth/make-complete-user-register.use-case.factory', () => ({
  makeCompleteUserRegisterUseCase: vi.fn()
}))

describe('CompleteUserRegisterController', () => {
  let req: any
  let res: any
  let usecaseMock: any

  beforeEach(() => {
    vi.clearAllMocks()

    req = {
      headers: {},
      body: {}
    }

    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
      json: vi.fn()
    }

    usecaseMock = {
      execute: vi.fn()
    }
    vi.mocked(makeCompleteUserRegisterUseCase).mockReturnValue(usecaseMock)
  })

  it('should be defined', () => {
    expect(CompleteUserRegisterController).toBeDefined()
  })

  describe('handle', () => {
    it('should return 400 if user ID is missing', async () => {
      // arrange
      req.user = {
        sub: undefined,
        role: UserType.CUSTOMER,
        registerCompleted: false
      }

      vi.spyOn(CustomerSchemas.customerCompleteRegisterBodySchema, 'parse').mockReturnValue({
        name: faker.person.fullName(),
        birthdate: faker.date.birthdate(),
        phone: faker.phone.number()
      })

      // act
      await CompleteUserRegisterController.handle(req as any, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith({ message: 'User ID is missing' })
    })

    it('should return 400 if user has already completed registration', async () => {
      // arrange
      req.user = {
        sub: 'valid-user-id',
        registerCompleted: true
      }

      // act
      await CompleteUserRegisterController.handle(req as any, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith({ message: 'User already complete register' })
    })

    it('should return 400 for an invalid role', async () => {
      // arrange
      req.user = {
        sub: 'valid-user-id',
        role: 'INVALID_ROLE',
        registerCompleted: false
      }

      // act
      await CompleteUserRegisterController.handle(req, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith({
        message: 'Invalid role provided: INVALID_ROLE'
      })
    })

    it('should return 400 if Zod validation fails', async () => {
      // arrange
      req.user = {
        sub: 'valid-user-id',
        role: UserType.CUSTOMER,
        registerCompleted: false
      }

      vi.spyOn(CustomerSchemas.customerCompleteRegisterBodySchema, 'parse').mockImplementation(() => {
        throw new z.ZodError([
          { path: ['field'], message: 'Invalid field', code: 'custom' }
        ])
      })

      // act
      await CompleteUserRegisterController.handle(req, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 400,
        message: 'Validation Error',
        errors: [{ field: 'field', message: 'Invalid field' }]
      })
    })

    it('should return 500 if an unexpected error occurs', async () => {
      // arrange
      req.user = {
        sub: 'valid-user-id',
        role: UserType.CUSTOMER,
        registerCompleted: false
      }

      vi.spyOn(CustomerSchemas.customerCompleteRegisterBodySchema, 'parse').mockImplementation(() => {
        throw new Error('Unexpected error')
      })

      // act
      await CompleteUserRegisterController.handle(req, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith({
        message: 'Error trying to complete user register, please check back-end logs...'
      })
    })

    it('should return 204 if the use case succeeds', async () => {
      // arrange
      req.user = {
        sub: 'valid-user-id',
        role: UserType.CUSTOMER,
        registerCompleted: false
      }

      vi.spyOn(CustomerSchemas.customerCompleteRegisterBodySchema, 'parse').mockReturnValue({
        name: faker.person.fullName(),
        birthdate: faker.date.birthdate(),
        phone: faker.phone.number()
      })

      // act
      await CompleteUserRegisterController.handle(req, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalledTimes(1)
    })
  })
})
