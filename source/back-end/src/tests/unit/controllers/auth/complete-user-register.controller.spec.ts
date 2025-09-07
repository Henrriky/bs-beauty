/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { faker } from '@faker-js/faker'
import { UserType } from '@prisma/client'
import { type Response } from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { CompleteUserRegisterController } from '../../../../controllers/auth/complete-user-register.controller'
import { makeCompleteUserRegisterUseCase } from '../../../../factory/auth/make-complete-user-register.use-case.factory'
import { CustomerSchemas } from '../../../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { type MockRequest, mockRequest, mockResponse } from '../../utils/test-utilts'
import { type CompleteUserRegisterUseCase } from '../../../../services/use-cases/auth/complete-user-register.use-case'
import { createMock } from '../../utils/mocks'

vi.mock('@/factory/auth/make-complete-user-register.use-case.factory', () => ({
  makeCompleteUserRegisterUseCase: vi.fn()
}))

describe('CompleteUserRegisterController', () => {
  let req: MockRequest
  let res: Response
  let usecaseMock: CompleteUserRegisterUseCase

  beforeEach(() => {
    vi.clearAllMocks()

    req = mockRequest({
      headers: {},
      body: {}
    })

    res = mockResponse()

    const result = createMock<CompleteUserRegisterUseCase>()
    usecaseMock = result.usecase

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
        userType: UserType.CUSTOMER,
        registerCompleted: false
      } as any

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
        registerCompleted: true,
        userType: UserType.CUSTOMER
      } as any

      // act
      await CompleteUserRegisterController.handle(req as any, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith({ message: 'User already complete register' })
    })

    it('should return 400 for an invalid userType', async () => {
      // arrange
      req.user = {
        userType: 'INVALID_USER_TYPE',
        registerCompleted: false
      } as any

      // act
      await CompleteUserRegisterController.handle(req, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith({
        message: 'Invalid user type provided: INVALID_USER_TYPE'
      })
    })

    it('should return 400 if Zod validation fails', async () => {
      // arrange
      req.user = {
        sub: 'valid-user-id',
        userType: UserType.CUSTOMER,
        registerCompleted: false
      } as any

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
        userType: UserType.CUSTOMER,
        registerCompleted: false
      } as any

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
        userType: UserType.CUSTOMER,
        registerCompleted: false
      } as any

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
