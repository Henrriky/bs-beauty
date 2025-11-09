/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type Customer, type Prisma, UserType, DiscoverySource, NotificationChannel } from '@prisma/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CustomersUseCase } from '../../../services/customers.use-case'
import { type CustomerRepository } from '../../../repository/protocols/customer.repository'
import { RecordExistence } from '../../../utils/validation/record-existence.validation.util'
import { type PaginatedRequest, type PaginatedResult } from '../../../types/pagination'
import { type CustomersFilters } from '../../../types/customers/customers-filters'

vi.mock('@/utils/validation/record-existence.validation.util')

describe('CustomersUseCase (Unit Tests)', () => {
  let customersUseCase: CustomersUseCase
  let customerRepositoryMock: CustomerRepository

  const mockCustomer: Customer = {
    id: 'customer-123',
    name: 'John Doe',
    registerCompleted: true,
    birthdate: new Date('1990-01-01'),
    email: 'john.doe@example.com',
    passwordHash: 'hashed_password',
    googleId: null,
    phone: '+5511999999999',
    profilePhotoUrl: 'https://example.com/photo.jpg',
    userType: UserType.CUSTOMER,
    referrerId: null,
    referralCount: 0,
    alwaysAllowImageUse: false,
    discoverySource: DiscoverySource.INSTAGRAM,
    notificationPreference: NotificationChannel.ALL,
    createdAt: new Date('2025-01-01T10:00:00'),
    updatedAt: new Date('2025-01-01T10:00:00')
  }

  beforeEach(() => {
    vi.clearAllMocks()

    customerRepositoryMock = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByEmailOrPhone: vi.fn(),
      findByEmail: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateByEmailAndGoogleId: vi.fn(),
      updateByEmail: vi.fn(),
      updateOrCreate: vi.fn(),
      delete: vi.fn(),
      findAllPaginated: vi.fn(),
      findBirthdayCustomersOnCurrentDate: vi.fn()
    }

    customersUseCase = new CustomersUseCase(customerRepositoryMock)
  })

  describe('executeFindAll', () => {
    it('should return all customers', async () => {
      // arrange
      const mockCustomers: Customer[] = [mockCustomer]
      vi.mocked(customerRepositoryMock.findAll).mockResolvedValueOnce(mockCustomers)

      // act
      const result = await customersUseCase.executeFindAll()

      // assert
      expect(customerRepositoryMock.findAll).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateManyRecordsExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateManyRecordsExistence).toHaveBeenCalledWith(mockCustomers, 'customers')
      expect(result).toEqual({ customers: mockCustomers })
    })

    it('should validate when no customers found', async () => {
      // arrange
      vi.mocked(customerRepositoryMock.findAll).mockResolvedValueOnce([])

      // act
      await customersUseCase.executeFindAll()

      // assert
      expect(customerRepositoryMock.findAll).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateManyRecordsExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateManyRecordsExistence).toHaveBeenCalledWith([], 'customers')
    })
  })

  describe('executeFindById', () => {
    it('should return a customer by id', async () => {
      // arrange
      const customerId = 'customer-123'
      vi.mocked(customerRepositoryMock.findById).mockResolvedValueOnce(mockCustomer)

      // act
      const result = await customersUseCase.executeFindById(customerId)

      // assert
      expect(customerRepositoryMock.findById).toHaveBeenCalledTimes(1)
      expect(customerRepositoryMock.findById).toHaveBeenCalledWith(customerId)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledWith(mockCustomer, 'Customer')
      expect(result).toEqual(mockCustomer)
    })

    it('should validate record existence when customer not found', async () => {
      // arrange
      const customerId = 'non-existent-customer'
      vi.mocked(customerRepositoryMock.findById).mockResolvedValueOnce(null)

      // act
      const result = await customersUseCase.executeFindById(customerId)

      // assert
      expect(customerRepositoryMock.findById).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledWith(null, 'Customer')
      expect(result).toBeNull()
    })
  })

  describe('executeCreate', () => {
    it('should create a new customer successfully', async () => {
      // arrange
      const customerToCreate: Prisma.CustomerCreateInput = {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+5511988888888'
      }
      const newCustomer: Customer = {
        ...mockCustomer,
        id: 'customer-456',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+5511988888888'
      }
      vi.mocked(customerRepositoryMock.findByEmailOrPhone).mockResolvedValueOnce(null)
      vi.mocked(customerRepositoryMock.create).mockResolvedValueOnce(newCustomer)

      // act
      const result = await customersUseCase.executeCreate(customerToCreate)

      // assert
      expect(customerRepositoryMock.findByEmailOrPhone).toHaveBeenCalledTimes(1)
      expect(customerRepositoryMock.findByEmailOrPhone).toHaveBeenCalledWith('jane.smith@example.com', '+5511988888888')
      expect(RecordExistence.validateRecordNonExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordNonExistence).toHaveBeenCalledWith(null, 'Customer')
      expect(customerRepositoryMock.create).toHaveBeenCalledTimes(1)
      expect(customerRepositoryMock.create).toHaveBeenCalledWith(customerToCreate)
      expect(result).toEqual(newCustomer)
    })

    it('should validate that customer does not already exist', async () => {
      // arrange
      const customerToCreate: Prisma.CustomerCreateInput = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+5511999999999'
      }
      vi.mocked(customerRepositoryMock.findByEmailOrPhone).mockResolvedValueOnce(mockCustomer)
      vi.mocked(customerRepositoryMock.create).mockResolvedValueOnce(mockCustomer)

      // act
      await customersUseCase.executeCreate(customerToCreate)

      // assert
      expect(customerRepositoryMock.findByEmailOrPhone).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordNonExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordNonExistence).toHaveBeenCalledWith(mockCustomer, 'Customer')
    })

    it('should handle customer creation with only email', async () => {
      // arrange
      const customerToCreate: Prisma.CustomerCreateInput = {
        email: 'new.user@example.com'
      }
      const newCustomer: Customer = {
        ...mockCustomer,
        id: 'customer-789',
        email: 'new.user@example.com',
        phone: null
      }
      vi.mocked(customerRepositoryMock.findByEmailOrPhone).mockResolvedValueOnce(null)
      vi.mocked(customerRepositoryMock.create).mockResolvedValueOnce(newCustomer)

      // act
      const result = await customersUseCase.executeCreate(customerToCreate)

      // assert
      expect(customerRepositoryMock.findByEmailOrPhone).toHaveBeenCalledTimes(1)
      expect(customerRepositoryMock.findByEmailOrPhone).toHaveBeenCalledWith('new.user@example.com', '')
      expect(customerRepositoryMock.create).toHaveBeenCalledTimes(1)
      expect(result).toEqual(newCustomer)
    })

    it('should handle customer creation with only phone', async () => {
      // arrange
      const customerToCreate: Prisma.CustomerCreateInput = {
        email: 'generated@example.com',
        phone: '+5511977777777'
      }
      const newCustomer: Customer = {
        ...mockCustomer,
        id: 'customer-999',
        email: 'generated@example.com',
        phone: '+5511977777777'
      }
      vi.mocked(customerRepositoryMock.findByEmailOrPhone).mockResolvedValueOnce(null)
      vi.mocked(customerRepositoryMock.create).mockResolvedValueOnce(newCustomer)

      // act
      const result = await customersUseCase.executeCreate(customerToCreate)

      // assert
      expect(customerRepositoryMock.findByEmailOrPhone).toHaveBeenCalledTimes(1)
      expect(customerRepositoryMock.findByEmailOrPhone).toHaveBeenCalledWith('generated@example.com', '+5511977777777')
      expect(customerRepositoryMock.create).toHaveBeenCalledTimes(1)
      expect(result).toEqual(newCustomer)
    })
  })

  describe('executeUpdate', () => {
    it('should update a customer successfully', async () => {
      // arrange
      const customerId = 'customer-123'
      const customerToUpdate: Prisma.CustomerUpdateInput = {
        name: 'John Updated',
        phone: '+5511966666666'
      }
      const updatedCustomer: Customer = {
        ...mockCustomer,
        name: 'John Updated',
        phone: '+5511966666666',
        updatedAt: new Date('2025-01-02T10:00:00')
      }
      vi.mocked(customerRepositoryMock.findById).mockResolvedValueOnce(mockCustomer)
      vi.mocked(customerRepositoryMock.update).mockResolvedValueOnce(updatedCustomer)

      // act
      const result = await customersUseCase.executeUpdate(customerId, customerToUpdate)

      // assert
      expect(customerRepositoryMock.findById).toHaveBeenCalledTimes(1)
      expect(customerRepositoryMock.findById).toHaveBeenCalledWith(customerId)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledWith(mockCustomer, 'Customer')
      expect(customerRepositoryMock.update).toHaveBeenCalledTimes(1)
      expect(customerRepositoryMock.update).toHaveBeenCalledWith(customerId, customerToUpdate)
      expect(result).toEqual(updatedCustomer)
    })

    it('should validate customer exists before updating', async () => {
      // arrange
      const customerId = 'non-existent-customer'
      const customerToUpdate: Prisma.CustomerUpdateInput = {
        name: 'Updated Name'
      }
      vi.mocked(customerRepositoryMock.findById).mockResolvedValueOnce(null)
      vi.mocked(customerRepositoryMock.update).mockResolvedValueOnce(mockCustomer)

      // act
      await customersUseCase.executeUpdate(customerId, customerToUpdate)

      // assert
      expect(customerRepositoryMock.findById).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledWith(null, 'Customer')
    })
  })

  describe('executeDelete', () => {
    it('should delete a customer successfully', async () => {
      // arrange
      const customerId = 'customer-123'
      vi.mocked(customerRepositoryMock.findById).mockResolvedValueOnce(mockCustomer)
      vi.mocked(customerRepositoryMock.delete).mockResolvedValueOnce(mockCustomer)

      // act
      const result = await customersUseCase.executeDelete(customerId)

      // assert
      expect(customerRepositoryMock.findById).toHaveBeenCalledTimes(1)
      expect(customerRepositoryMock.findById).toHaveBeenCalledWith(customerId)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledWith(mockCustomer, 'Customer')
      expect(customerRepositoryMock.delete).toHaveBeenCalledTimes(1)
      expect(customerRepositoryMock.delete).toHaveBeenCalledWith(customerId)
      expect(result).toEqual(mockCustomer)
    })

    it('should validate customer exists before deleting', async () => {
      // arrange
      const customerId = 'non-existent-customer'
      vi.mocked(customerRepositoryMock.findById).mockResolvedValueOnce(null)
      vi.mocked(customerRepositoryMock.delete).mockResolvedValueOnce(mockCustomer)

      // act
      await customersUseCase.executeDelete(customerId)

      // assert
      expect(customerRepositoryMock.findById).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledWith(null, 'Customer')
    })
  })

  describe('executeFindAllPaginated', () => {
    it('should return paginated customers with default parameters', async () => {
      // arrange
      const params: PaginatedRequest<CustomersFilters> = {
        page: 1,
        limit: 10,
        filters: {}
      }
      const mockResult: PaginatedResult<Customer> = {
        data: [mockCustomer],
        total: 1,
        page: 1,
        totalPages: 1,
        limit: 10
      }
      vi.mocked(customerRepositoryMock.findAllPaginated).mockResolvedValueOnce(mockResult)

      // act
      const result = await customersUseCase.executeFindAllPaginated(params)

      // assert
      expect(customerRepositoryMock.findAllPaginated).toHaveBeenCalledTimes(1)
      expect(customerRepositoryMock.findAllPaginated).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockResult)
    })

    it('should return paginated customers with filters', async () => {
      // arrange
      const params: PaginatedRequest<CustomersFilters> = {
        page: 2,
        limit: 20,
        filters: {
          name: 'John',
          email: 'john@example.com'
        }
      }
      const mockResult: PaginatedResult<Customer> = {
        data: [mockCustomer],
        total: 100,
        page: 2,
        totalPages: 5,
        limit: 20
      }
      vi.mocked(customerRepositoryMock.findAllPaginated).mockResolvedValueOnce(mockResult)

      // act
      const result = await customersUseCase.executeFindAllPaginated(params)

      // assert
      expect(customerRepositoryMock.findAllPaginated).toHaveBeenCalledTimes(1)
      expect(customerRepositoryMock.findAllPaginated).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockResult)
    })

    it('should return empty paginated result when no customers match', async () => {
      // arrange
      const params: PaginatedRequest<CustomersFilters> = {
        page: 1,
        limit: 10,
        filters: {}
      }
      const mockResult: PaginatedResult<Customer> = {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 10
      }
      vi.mocked(customerRepositoryMock.findAllPaginated).mockResolvedValueOnce(mockResult)

      // act
      const result = await customersUseCase.executeFindAllPaginated(params)

      // assert
      expect(customerRepositoryMock.findAllPaginated).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockResult)
    })
  })
})
