import { PaymentRecordsUseCase } from '@/services/payment-records.use-case'
import {
  MockPaymentRecordRepository,
  MockCustomerRepository,
  MockProfessionalRepository
} from '../utils/mocks/repository'
import { faker } from '@faker-js/faker'
import { type PaymentRecord, type Customer, type Professional, NotificationChannel } from '@prisma/client'
import { CustomError } from '@/utils/errors/custom.error.util'
import { type CreatePaymentRecordInput, type UpdatePaymentRecordInput } from '@/repository/protocols/payment-record.repository'

describe('PaymentRecordsUseCase (Unit Tests)', () => {
  let paymentRecordsUseCase: PaymentRecordsUseCase

  beforeEach(() => {
    paymentRecordsUseCase = new PaymentRecordsUseCase(
      MockPaymentRecordRepository,
      MockCustomerRepository,
      MockProfessionalRepository
    )
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(paymentRecordsUseCase).toBeDefined()
  })

  describe('executeFindById', () => {
    it('should return a payment record by id', async () => {
      const paymentRecord: PaymentRecord = {
        id: faker.string.uuid(),
        paymentMethod: 'CREDIT_CARD',
        customerId: faker.string.uuid(),
        professionalId: faker.string.uuid(),
        totalValue: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }) as any,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockPaymentRecordRepository.findById.mockResolvedValue(paymentRecord)

      const result = await paymentRecordsUseCase.executeFindById(paymentRecord.id)

      expect(result).toEqual(paymentRecord)
      expect(MockPaymentRecordRepository.findById).toHaveBeenCalledWith(paymentRecord.id)
    })

    it('should throw an error if payment record is not found', async () => {
      const paymentRecordId = faker.string.uuid()
      MockPaymentRecordRepository.findById.mockResolvedValue(null)

      const promise = paymentRecordsUseCase.executeFindById(paymentRecordId)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockPaymentRecordRepository.findById).toHaveBeenCalledWith(paymentRecordId)
    })
  })

  describe('executeFindByProfessionalId', () => {
    it('should return payment records by professional id', async () => {
      const professionalId = faker.string.uuid()
      const paymentRecords: PaymentRecord[] = [
        {
          id: faker.string.uuid(),
          paymentMethod: 'CREDIT_CARD',
          customerId: faker.string.uuid(),
          professionalId,
          totalValue: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }) as any,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        },
        {
          id: faker.string.uuid(),
          paymentMethod: 'PIX',
          customerId: faker.string.uuid(),
          professionalId,
          totalValue: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }) as any,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        }
      ]

      MockPaymentRecordRepository.findByProfessionalId.mockResolvedValue(paymentRecords)

      const result = await paymentRecordsUseCase.executeFindByProfessionalId(professionalId)

      expect(result).toEqual(paymentRecords)
      expect(MockPaymentRecordRepository.findByProfessionalId).toHaveBeenCalledWith(professionalId)
    })

    it('should throw an error if no payment records are found', async () => {
      const professionalId = faker.string.uuid()
      MockPaymentRecordRepository.findByProfessionalId.mockResolvedValue([])

      const promise = paymentRecordsUseCase.executeFindByProfessionalId(professionalId)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockPaymentRecordRepository.findByProfessionalId).toHaveBeenCalledWith(professionalId)
    })
  })

  describe('executefindByProfessionalIdPaginated', () => {
    it('should return paginated payment records by professional id', async () => {
      const professionalId = faker.string.uuid()
      const paymentRecords: PaymentRecord[] = Array.from({ length: 3 }, () => ({
        id: faker.string.uuid(),
        paymentMethod: 'CREDIT_CARD',
        customerId: faker.string.uuid(),
        professionalId,
        totalValue: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }) as any,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }))

      const mockPaginatedResult = {
        data: paymentRecords,
        total: 3,
        page: 1,
        totalPages: 1,
        limit: 10
      }

      MockPaymentRecordRepository.findByProfessionalIdPaginated.mockResolvedValue(mockPaginatedResult)

      const params = {
        page: 1,
        limit: 10,
        filters: {}
      }

      const result = await paymentRecordsUseCase.executefindByProfessionalIdPaginated(professionalId, params)

      expect(result).toEqual(mockPaginatedResult)
      expect(MockPaymentRecordRepository.findByProfessionalIdPaginated).toHaveBeenCalledWith(professionalId, params)
    })

    it('should return empty paginated result when no records found', async () => {
      const professionalId = faker.string.uuid()
      const mockPaginatedResult = {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 10
      }

      MockPaymentRecordRepository.findByProfessionalIdPaginated.mockResolvedValue(mockPaginatedResult)

      const params = {
        page: 1,
        limit: 10,
        filters: {}
      }

      const result = await paymentRecordsUseCase.executefindByProfessionalIdPaginated(professionalId, params)

      expect(result).toEqual(mockPaginatedResult)
      expect(MockPaymentRecordRepository.findByProfessionalIdPaginated).toHaveBeenCalledWith(professionalId, params)
    })
  })

  describe('executeCreate', () => {
    it('should create a new payment record successfully', async () => {
      const customerId = faker.string.uuid()
      const professionalId = faker.string.uuid()

      const customer: Customer = {
        id: customerId,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        googleId: null,
        registerCompleted: true,
        birthdate: null,
        passwordHash: null,
        phone: faker.phone.number(),
        profilePhotoUrl: null,
        userType: 'CUSTOMER',
        referrerId: null,
        referralCount: 0,
        alwaysAllowImageUse: false,
        discoverySource: null,
        notificationPreference: NotificationChannel.ALL,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const professional: Professional = {
        id: professionalId,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        googleId: null,
        registerCompleted: true,
        paymentMethods: null,
        socialMedia: null,
        passwordHash: null,
        contact: faker.phone.number(),
        specialization: null,
        profilePhotoUrl: null,
        userType: 'PROFESSIONAL',
        notificationPreference: NotificationChannel.ALL,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const paymentRecordData: CreatePaymentRecordInput = {
        paymentMethod: 'CREDIT_CARD',
        customerId,
        professionalId,
        items: [
          {
            quantity: 1,
            discount: 0,
            price: 150.0,
            offerId: faker.string.uuid()
          }
        ],
        totalValue: 150.0
      }

      const createdPaymentRecord: PaymentRecord = {
        id: faker.string.uuid(),
        paymentMethod: 'CREDIT_CARD',
        customerId,
        professionalId,
        totalValue: 150.0 as any,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      MockProfessionalRepository.findById.mockResolvedValue(professional)
      MockCustomerRepository.findById.mockResolvedValue(customer)
      MockPaymentRecordRepository.create.mockResolvedValue(createdPaymentRecord)

      const result = await paymentRecordsUseCase.executeCreate(paymentRecordData)

      expect(result).toEqual(createdPaymentRecord)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(professionalId)
      expect(MockCustomerRepository.findById).toHaveBeenCalledWith(customerId)
      expect(MockPaymentRecordRepository.create).toHaveBeenCalledWith(paymentRecordData)
    })

    it('should throw an error if professional is not found', async () => {
      const customerId = faker.string.uuid()
      const professionalId = faker.string.uuid()

      const paymentRecordData: CreatePaymentRecordInput = {
        paymentMethod: 'CREDIT_CARD',
        customerId,
        professionalId,
        items: [],
        totalValue: 150.0
      }

      MockProfessionalRepository.findById.mockResolvedValue(null)

      const promise = paymentRecordsUseCase.executeCreate(paymentRecordData)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(professionalId)
      expect(MockPaymentRecordRepository.create).not.toHaveBeenCalled()
    })

    it('should throw an error if customer is not found', async () => {
      const customerId = faker.string.uuid()
      const professionalId = faker.string.uuid()

      const professional: Professional = {
        id: professionalId,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        googleId: null,
        registerCompleted: true,
        paymentMethods: null,
        socialMedia: null,
        passwordHash: null,
        contact: faker.phone.number(),
        specialization: null,
        profilePhotoUrl: null,
        userType: 'PROFESSIONAL',
        notificationPreference: NotificationChannel.ALL,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const paymentRecordData: CreatePaymentRecordInput = {
        paymentMethod: 'CREDIT_CARD',
        customerId,
        professionalId,
        items: [],
        totalValue: 150.0
      }

      MockProfessionalRepository.findById.mockResolvedValue(professional)
      MockCustomerRepository.findById.mockResolvedValue(null)

      const promise = paymentRecordsUseCase.executeCreate(paymentRecordData)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(professionalId)
      expect(MockCustomerRepository.findById).toHaveBeenCalledWith(customerId)
      expect(MockPaymentRecordRepository.create).not.toHaveBeenCalled()
    })
  })

  describe('executeUpdate', () => {
    it('should update a payment record successfully', async () => {
      const paymentRecordId = faker.string.uuid()
      const existingPaymentRecord: PaymentRecord = {
        id: paymentRecordId,
        paymentMethod: 'CREDIT_CARD',
        customerId: faker.string.uuid(),
        professionalId: faker.string.uuid(),
        totalValue: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }) as any,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const updateData: UpdatePaymentRecordInput = {
        paymentMethod: 'PIX',
        totalValue: 140.0
      }

      const updatedPaymentRecord: PaymentRecord = {
        ...existingPaymentRecord,
        paymentMethod: 'PIX',
        totalValue: 140.0 as any,
        updatedAt: new Date()
      }

      MockPaymentRecordRepository.findById.mockResolvedValue(existingPaymentRecord)
      MockPaymentRecordRepository.update.mockResolvedValue(updatedPaymentRecord)

      const result = await paymentRecordsUseCase.executeUpdate(paymentRecordId, updateData)

      expect(result).toEqual(updatedPaymentRecord)
      expect(MockPaymentRecordRepository.findById).toHaveBeenCalledWith(paymentRecordId)
      expect(MockPaymentRecordRepository.update).toHaveBeenCalledWith(paymentRecordId, updateData)
    })

    it('should throw an error if payment record to update is not found', async () => {
      const paymentRecordId = faker.string.uuid()
      const updateData: UpdatePaymentRecordInput = {
        totalValue: 140.0
      }

      MockPaymentRecordRepository.findById.mockResolvedValue(null)

      const promise = paymentRecordsUseCase.executeUpdate(paymentRecordId, updateData)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockPaymentRecordRepository.findById).toHaveBeenCalledWith(paymentRecordId)
      expect(MockPaymentRecordRepository.update).not.toHaveBeenCalled()
    })
  })

  describe('executeDelete', () => {
    it('should delete a payment record successfully', async () => {
      const paymentRecordId = faker.string.uuid()
      const paymentRecordToDelete: PaymentRecord = {
        id: paymentRecordId,
        paymentMethod: 'CREDIT_CARD',
        customerId: faker.string.uuid(),
        professionalId: faker.string.uuid(),
        totalValue: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }) as any,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockPaymentRecordRepository.findById.mockResolvedValue(paymentRecordToDelete)
      MockPaymentRecordRepository.delete.mockResolvedValue(paymentRecordToDelete)

      const result = await paymentRecordsUseCase.executeDelete(paymentRecordId)

      expect(result).toEqual(paymentRecordToDelete)
      expect(MockPaymentRecordRepository.findById).toHaveBeenCalledWith(paymentRecordId)
      expect(MockPaymentRecordRepository.delete).toHaveBeenCalledWith(paymentRecordId)
    })

    it('should throw an error if payment record to delete is not found', async () => {
      const paymentRecordId = faker.string.uuid()
      MockPaymentRecordRepository.findById.mockResolvedValue(null)

      const promise = paymentRecordsUseCase.executeDelete(paymentRecordId)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockPaymentRecordRepository.findById).toHaveBeenCalledWith(paymentRecordId)
      expect(MockPaymentRecordRepository.delete).not.toHaveBeenCalled()
    })
  })
})
