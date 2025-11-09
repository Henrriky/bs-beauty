/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type PaymentRecord, Prisma as PrismaNamespace } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PaymentRecordsController } from '../../../controllers/payment-records.controller'
import { makePaymentRecordUseCaseFactory } from '../../../factory/make-payment-record-use-case.factory'
import { mockRequest, mockResponse } from '../utils/test-utilts'
import * as PaymentRecordQuerySchemaMod from '../../../utils/validation/zod-schemas/pagination/payment-records/payment-records-query.schema'

vi.mock('@/factory/make-payment-record-use-case.factory')

describe('PaymentRecordsController (Unit Tests)', () => {
  let req: any
  let res: any
  let next: any
  let useCaseMock: any

  const mockPaymentRecord: PaymentRecord = {
    id: 'payment-123',
    totalValue: new PrismaNamespace.Decimal(150.00),
    paymentMethod: 'CREDIT_CARD',
    customerId: 'customer-123',
    professionalId: 'professional-123',
    createdAt: new Date('2025-01-15T09:00:00'),
    updatedAt: new Date('2025-01-15T10:00:00')
  }

  beforeEach(() => {
    vi.clearAllMocks()

    req = mockRequest()
    res = mockResponse()
    next = vi.fn()

    useCaseMock = {
      executeFindById: vi.fn(),
      executeFindByProfessionalId: vi.fn(),
      executefindByProfessionalIdPaginated: vi.fn(),
      executeCreate: vi.fn(),
      executeUpdate: vi.fn(),
      executeDelete: vi.fn()
    }

    vi.mocked(makePaymentRecordUseCaseFactory).mockReturnValue(useCaseMock)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be defined', () => {
    expect(PaymentRecordsController).toBeDefined()
  })

  describe('handleFindById', () => {
    it('should return payment record by id', async () => {
      // arrange
      const paymentRecordId = 'payment-123'
      req.params.id = paymentRecordId
      useCaseMock.executeFindById.mockResolvedValueOnce(mockPaymentRecord)

      // act
      await PaymentRecordsController.handleFindById(req, res, next)

      // assert
      expect(useCaseMock.executeFindById).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeFindById).toHaveBeenCalledWith(paymentRecordId)
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith(mockPaymentRecord)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeFindById fails', async () => {
      // arrange
      const error = new Error('Payment record not found')
      const paymentRecordId = 'payment-123'
      req.params.id = paymentRecordId
      useCaseMock.executeFindById.mockRejectedValueOnce(error)

      // act
      await PaymentRecordsController.handleFindById(req, res, next)

      // assert
      expect(useCaseMock.executeFindById).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleFindByProfessionalId', () => {
    it('should return payment records for a professional', async () => {
      // arrange
      const professionalId = 'professional-123'
      const mockRecords = {
        paymentRecords: [mockPaymentRecord]
      }
      req.params.professionalId = professionalId
      useCaseMock.executeFindByProfessionalId.mockResolvedValueOnce(mockRecords)

      // act
      await PaymentRecordsController.handleFindByProfessionalId(req, res, next)

      // assert
      expect(useCaseMock.executeFindByProfessionalId).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeFindByProfessionalId).toHaveBeenCalledWith(professionalId)
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith(mockRecords)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeFindByProfessionalId fails', async () => {
      // arrange
      const error = new Error('Professional not found')
      const professionalId = 'professional-123'
      req.params.professionalId = professionalId
      useCaseMock.executeFindByProfessionalId.mockRejectedValueOnce(error)

      // act
      await PaymentRecordsController.handleFindByProfessionalId(req, res, next)

      // assert
      expect(useCaseMock.executeFindByProfessionalId).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleFindByProfessionalIdPaginated', () => {
    it('should return paginated payment records for a professional', async () => {
      // arrange
      const professionalId = 'professional-123'
      const mockResult = {
        data: [mockPaymentRecord],
        total: 1,
        page: 1,
        totalPages: 1,
        limit: 10
      }
      req.params.professionalId = professionalId
      req.query = { page: '1', limit: '10' }

      const parseSpy = vi.spyOn(PaymentRecordQuerySchemaMod.paymentRecordQuerySchema, 'parse')
      parseSpy.mockReturnValueOnce({ page: 1, limit: 10 })

      useCaseMock.executefindByProfessionalIdPaginated.mockResolvedValueOnce(mockResult)

      // act
      await PaymentRecordsController.handleFindByProfessionalIdPaginated(req, res, next)

      // assert
      expect(parseSpy).toHaveBeenCalledTimes(1)
      expect(parseSpy).toHaveBeenCalledWith(req.query)
      expect(useCaseMock.executefindByProfessionalIdPaginated).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executefindByProfessionalIdPaginated).toHaveBeenCalledWith(
        professionalId,
        {
          page: 1,
          limit: 10,
          filters: {}
        }
      )
      expect(res.send).toHaveBeenCalledWith(mockResult)
      expect(next).not.toHaveBeenCalled()
    })

    it('should return paginated payment records with filters', async () => {
      // arrange
      const professionalId = 'professional-123'
      const mockResult = {
        data: [mockPaymentRecord],
        total: 1,
        page: 1,
        totalPages: 1,
        limit: 10
      }
      req.params.professionalId = professionalId
      req.query = { page: '1', limit: '10', q: 'search-term' }

      const parseSpy = vi.spyOn(PaymentRecordQuerySchemaMod.paymentRecordQuerySchema, 'parse')
      parseSpy.mockReturnValueOnce({ page: 1, limit: 10, q: 'search-term' })

      useCaseMock.executefindByProfessionalIdPaginated.mockResolvedValueOnce(mockResult)

      // act
      await PaymentRecordsController.handleFindByProfessionalIdPaginated(req, res, next)

      // assert
      expect(useCaseMock.executefindByProfessionalIdPaginated).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executefindByProfessionalIdPaginated).toHaveBeenCalledWith(
        professionalId,
        {
          page: 1,
          limit: 10,
          filters: { q: 'search-term' }
        }
      )
      expect(res.send).toHaveBeenCalledWith(mockResult)
    })

    it('should call next with an error if executefindByProfessionalIdPaginated fails', async () => {
      // arrange
      const error = new Error('Query failed')
      const professionalId = 'professional-123'
      req.params.professionalId = professionalId
      req.query = { page: '1', limit: '10' }

      const parseSpy = vi.spyOn(PaymentRecordQuerySchemaMod.paymentRecordQuerySchema, 'parse')
      parseSpy.mockReturnValueOnce({ page: 1, limit: 10 })

      useCaseMock.executefindByProfessionalIdPaginated.mockRejectedValueOnce(error)

      // act
      await PaymentRecordsController.handleFindByProfessionalIdPaginated(req, res, next)

      // assert
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleCreate', () => {
    it('should create a payment record successfully', async () => {
      // arrange
      const paymentRecordToCreate = {
        totalValue: 150.00,
        paymentMethod: 'CREDIT_CARD',
        customerId: 'customer-123',
        professionalId: 'professional-123'
      }
      req.body = paymentRecordToCreate
      useCaseMock.executeCreate.mockResolvedValueOnce(mockPaymentRecord)

      // act
      await PaymentRecordsController.handleCreate(req, res, next)

      // assert
      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeCreate).toHaveBeenCalledWith(paymentRecordToCreate)
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
      expect(res.send).toHaveBeenCalledWith(mockPaymentRecord)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeCreate fails', async () => {
      // arrange
      const error = new Error('Payment creation failed')
      const paymentRecordToCreate = {
        totalValue: 150.00,
        paymentMethod: 'PIX',
        customerId: 'customer-123',
        professionalId: 'professional-123'
      }
      req.body = paymentRecordToCreate
      useCaseMock.executeCreate.mockRejectedValueOnce(error)

      // act
      await PaymentRecordsController.handleCreate(req, res, next)

      // assert
      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleUpdate', () => {
    it('should update a payment record successfully', async () => {
      // arrange
      const paymentRecordId = 'payment-123'
      const paymentRecordToUpdate = {
        totalValue: 200.00,
        paymentMethod: 'PIX'
      }
      const updatedPaymentRecord: PaymentRecord = {
        ...mockPaymentRecord,
        totalValue: new PrismaNamespace.Decimal(200.00),
        paymentMethod: 'PIX',
        updatedAt: new Date('2025-01-15T11:00:00')
      }
      req.params.id = paymentRecordId
      req.body = paymentRecordToUpdate
      useCaseMock.executeUpdate.mockResolvedValueOnce(updatedPaymentRecord)

      // act
      await PaymentRecordsController.handleUpdate(req, res, next)

      // assert
      expect(useCaseMock.executeUpdate).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeUpdate).toHaveBeenCalledWith(paymentRecordId, paymentRecordToUpdate)
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith(updatedPaymentRecord)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeUpdate fails', async () => {
      // arrange
      const error = new Error('Payment update failed')
      const paymentRecordId = 'payment-123'
      const paymentRecordToUpdate = {
        totalValue: 200.00
      }
      req.params.id = paymentRecordId
      req.body = paymentRecordToUpdate
      useCaseMock.executeUpdate.mockRejectedValueOnce(error)

      // act
      await PaymentRecordsController.handleUpdate(req, res, next)

      // assert
      expect(useCaseMock.executeUpdate).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleDelete', () => {
    it('should delete a payment record successfully', async () => {
      // arrange
      const paymentRecordId = 'payment-123'
      req.params.id = paymentRecordId
      useCaseMock.executeDelete.mockResolvedValueOnce(mockPaymentRecord)

      // act
      await PaymentRecordsController.handleDelete(req, res, next)

      // assert
      expect(useCaseMock.executeDelete).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeDelete).toHaveBeenCalledWith(paymentRecordId)
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith(mockPaymentRecord)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeDelete fails', async () => {
      // arrange
      const error = new Error('Payment deletion failed')
      const paymentRecordId = 'payment-123'
      req.params.id = paymentRecordId
      useCaseMock.executeDelete.mockRejectedValueOnce(error)

      // act
      await PaymentRecordsController.handleDelete(req, res, next)

      // assert
      expect(useCaseMock.executeDelete).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
