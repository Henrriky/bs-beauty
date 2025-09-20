/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { faker } from '@faker-js/faker'
import { type Customer, type Prisma, UserType } from '@prisma/client'
import { type Response } from 'express'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CustomersController } from '../../../controllers/customers.controller'
import { makeCustomersUseCaseFactory } from '../../../factory/make-customers-use-case.factory'
import { mockRequest, type MockRequest, mockResponse } from '../utils/test-utilts'
import * as CustomersQuerySchemaMod from '../../../utils/validation/zod-schemas/pagination/customers/customers-query.schema'
import { z } from 'zod'

vi.mock('@/factory/make-customers-use-case.factory')

interface usecaseType {
  executeFindAll: ReturnType<typeof vi.fn>
  executeFindById: ReturnType<typeof vi.fn>
  executeCreate: ReturnType<typeof vi.fn>
  executeUpdate: ReturnType<typeof vi.fn>
  executeDelete: ReturnType<typeof vi.fn>
  executeFindAllPaginated: ReturnType<typeof vi.fn>
}

describe('CustomerController', () => {
  let req: MockRequest
  let res: Response
  let next: any
  let usecaseMock: usecaseType

  beforeEach(() => {
    vi.clearAllMocks()
    req = mockRequest()
    res = mockResponse()
    next = vi.fn()

    usecaseMock = {
      executeFindAll: vi.fn(),
      executeFindById: vi.fn(),
      executeCreate: vi.fn(),
      executeUpdate: vi.fn(),
      executeDelete: vi.fn(),
      executeFindAllPaginated: vi.fn()
    }

    vi.mocked(makeCustomersUseCaseFactory)
      .mockReturnValue(usecaseMock as unknown as ReturnType<typeof makeCustomersUseCaseFactory>)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be defined', () => {
    expect(CustomersController).toBeDefined()
  })

  describe('handleFindAll', () => {
    it('should return a list of customers', async () => {
      // arrange
      const customers = [
        {
          id: 'random-uuid',
          name: 'John Doe',
          email: 'johndoe@example.com',
          registerCompleted: true,
          googleId: 'google-id-1'
        },
        {
          id: 'random-uuid-2',
          name: 'Anne Doe',
          email: 'annedoe@example.com',
          registerCompleted: true,
          googleId: 'google-id-2'
        }
      ] as Customer[]
      usecaseMock.executeFindAll.mockResolvedValue({ customers })

      // act
      await CustomersController.handleFindAll(req, res, next)

      // assert
      expect(res.send).toHaveBeenCalledWith({ customers })
      expect(usecaseMock.executeFindAll).toHaveBeenCalledTimes(1)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeFindAll fails', async () => {
      // arrange
      const error = new Error('Database connection failed')
      usecaseMock.executeFindAll.mockRejectedValueOnce(error)

      // act
      await CustomersController.handleFindAll(req, res, next)

      // assert
      expect(usecaseMock.executeFindAll).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleFindById', () => {
    it('should return a customer', async () => {
      // arrange
      const customerId = 'random-uuid'
      req.params.id = customerId
      const customer: Customer = {
        id: 'random-uuid',
        name: 'John Doe',
        email: 'johndoe@example.com',
        registerCompleted: true,
        googleId: 'google-id-1',
        birthdate: null,
        phone: null,
        profilePhotoUrl: null,
        userType: 'MANAGER',
        referrerId: null,
        referralCount: 0,
        createdAt: new Date(),
        alwaysAllowImageUse: false,
        updatedAt: new Date()
      }
      usecaseMock.executeFindById.mockResolvedValueOnce(customer)

      // act
      await CustomersController.handleFindById(req, res, next)

      // assert
      expect(req.params.id).toBe(customerId)
      expect(res.send).toHaveBeenCalledWith(customer)
      expect(usecaseMock.executeFindById).toHaveBeenCalledTimes(1)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeFindById fails', async () => {
      // arrange
      const error = new Error('Database connection failed')
      usecaseMock.executeFindById.mockRejectedValueOnce(error)

      // act
      await CustomersController.handleFindById(req, res, next)

      // assert
      expect(usecaseMock.executeFindById).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleCreate', () => {
    it('should create a customer', async () => {
      // arrange
      const newCustomer: Prisma.CustomerCreateInput = {
        name: 'Usuário',
        email: 'newuser@example.com',
        registerCompleted: true,
        googleId: 'google-id-123',
        userType: UserType.CUSTOMER,
        birthdate: faker.date.birthdate()
      }
      req.body = newCustomer
      usecaseMock.executeCreate.mockResolvedValueOnce(newCustomer)

      // act
      await CustomersController.handleCreate(req, res, next)

      // assert
      expect(req.body).toEqual(newCustomer)
      expect(res.send).toHaveBeenCalledWith(newCustomer)
      expect(usecaseMock.executeCreate).toHaveBeenCalledTimes(1)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeCreate fails', async () => {
      // arrange
      const error = new Error('Database connection failed')
      usecaseMock.executeCreate.mockRejectedValueOnce(error)

      // act
      await CustomersController.handleCreate(req, res, next)

      // assert
      expect(usecaseMock.executeCreate).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleUpdate', () => {
    it('should update a customer', async () => {
      // arrange
      const customerToUpdate: Prisma.CustomerUpdateInput = {
        name: 'Usuário',
        email: 'newuser@example.com',
        registerCompleted: true,
        googleId: 'google-id-123'
      }
      const customerId = 'random-uuid'
      req.body = customerToUpdate
      req.params.id = customerId
      usecaseMock.executeUpdate.mockResolvedValueOnce(customerToUpdate)

      // act
      await CustomersController.handleUpdate(req, res, next)

      // assert
      expect(req.body).toEqual(customerToUpdate)
      expect(req.params.id).toBe(customerId)
      expect(res.send).toHaveBeenCalledWith(customerToUpdate)
      expect(usecaseMock.executeUpdate).toHaveBeenCalledTimes(1)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeUpdate fails', async () => {
      // arrange
      const error = new Error('Database connection failed')
      usecaseMock.executeUpdate.mockRejectedValueOnce(error)

      // act
      await CustomersController.handleUpdate(req, res, next)

      // assert
      expect(usecaseMock.executeUpdate).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleDelete', () => {
    it('should delete a customer', async () => {
      // arrange
      const customerId = 'random-uuid'
      req.params.id = customerId
      usecaseMock.executeDelete.mockResolvedValueOnce(undefined)

      // act
      await CustomersController.handleDelete(req, res, next)

      // assert
      expect(req.params.id).toBe(customerId)
      expect(usecaseMock.executeDelete).toHaveBeenCalledTimes(1)
      expect(res.send).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeDelete fails', async () => {
      // arrange
      const error = new Error('Database connection failed')
      const serviceId = 'random-uuid'
      req.params.id = serviceId
      usecaseMock.executeDelete.mockRejectedValueOnce(error)

      // act
      await CustomersController.handleDelete(req, res, next)

      // assert
      expect(usecaseMock.executeDelete).toHaveBeenCalledTimes(1)
      expect(usecaseMock.executeDelete).toHaveBeenCalledWith(serviceId)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleFindAllPaginated', () => {
    it('should parse query with Zod and call usecase with page, limit and filters', async () => {
      const parseSpy = vi.spyOn(CustomersQuerySchemaMod.customerQuerySchema, 'parse')

      parseSpy.mockReturnValueOnce({ page: 2, limit: 10, name: 'john' })

      const pagedResult = {
        data: [{ id: '1', name: 'John' }],
        page: 2,
        limit: 10,
        total: 11,
        totalPages: 2
      }
      usecaseMock.executeFindAllPaginated.mockResolvedValueOnce(pagedResult)

      await CustomersController.handleFindAllPaginated(req, res, next)

      expect(makeCustomersUseCaseFactory).toHaveBeenCalledTimes(1)
      expect(parseSpy).toHaveBeenCalledWith(req.query)
      expect(usecaseMock.executeFindAllPaginated).toHaveBeenCalledWith({
        page: 2,
        limit: 10,
        filters: { name: 'john' }
      })
      expect(res.send).toHaveBeenCalledWith(pagedResult)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next when Zod parse throws (invalid query)', async () => {
      const parseSpy = vi.spyOn(CustomersQuerySchemaMod.customerQuerySchema, 'parse')
      const zodErr = new z.ZodError([])

      parseSpy.mockImplementationOnce(() => { throw zodErr })

      await CustomersController.handleFindAllPaginated(req, res, next)

      expect(makeCustomersUseCaseFactory).toHaveBeenCalledTimes(1)
      expect(usecaseMock.executeFindAllPaginated).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(zodErr)
    })

    it('should call next when usecase throws', async () => {
      const parseSpy = vi.spyOn(CustomersQuerySchemaMod.customerQuerySchema, 'parse')
      parseSpy.mockReturnValueOnce({ page: 1, limit: 20 })

      const err = new Error('DB down')
      usecaseMock.executeFindAllPaginated.mockRejectedValueOnce(err)

      await CustomersController.handleFindAllPaginated(req, res, next)

      expect(usecaseMock.executeFindAllPaginated).toHaveBeenCalledWith({
        page: 1, limit: 20, filters: {}
      })
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(err)
    })

    it('should pass empty filters when schema returns only page/limit', async () => {
      const parseSpy = vi.spyOn(CustomersQuerySchemaMod.customerQuerySchema, 'parse')
      parseSpy.mockReturnValueOnce({ page: 1, limit: 50 })

      const result = { data: [], page: 1, limit: 50, total: 0, totalPages: 0 }
      usecaseMock.executeFindAllPaginated.mockResolvedValueOnce(result)

      await CustomersController.handleFindAllPaginated(req, res, next)

      expect(usecaseMock.executeFindAllPaginated).toHaveBeenCalledWith({
        page: 1, limit: 50, filters: {}
      })
      expect(res.send).toHaveBeenCalledWith(result)
      expect(next).not.toHaveBeenCalled()
    })

    it('should forward multiple filters returned by schema', async () => {
      const parseSpy = vi.spyOn(CustomersQuerySchemaMod.customerQuerySchema, 'parse')
      parseSpy.mockReturnValueOnce({
        page: 3,
        limit: 5,
        name: 'john',
        email: 'john@ex.com'
      })

      const result = { data: [{ id: '1', name: 'John' }], page: 3, limit: 5, total: 1, totalPages: 1 }
      usecaseMock.executeFindAllPaginated.mockResolvedValueOnce(result)

      await CustomersController.handleFindAllPaginated(req, res, next)

      expect(usecaseMock.executeFindAllPaginated).toHaveBeenCalledWith({
        page: 3,
        limit: 5,
        filters: { name: 'john', email: 'john@ex.com' }
      })
      expect(res.send).toHaveBeenCalledWith(result)
      expect(next).not.toHaveBeenCalled()
    })

    it('should return empty page results correctly', async () => {
      const parseSpy = vi.spyOn(CustomersQuerySchemaMod.customerQuerySchema, 'parse')
      parseSpy.mockReturnValueOnce({ page: 2, limit: 10 })

      const emptyResult = { data: [], page: 2, limit: 10, total: 0, totalPages: 0 }
      usecaseMock.executeFindAllPaginated.mockResolvedValueOnce(emptyResult)

      await CustomersController.handleFindAllPaginated(req, res, next)

      expect(makeCustomersUseCaseFactory).toHaveBeenCalledTimes(1)
      expect(usecaseMock.executeFindAllPaginated).toHaveBeenCalledWith({
        page: 2,
        limit: 10,
        filters: {}
      })
      expect(res.send).toHaveBeenCalledWith(emptyResult)
      expect(next).not.toHaveBeenCalled()
    })
  })
})
