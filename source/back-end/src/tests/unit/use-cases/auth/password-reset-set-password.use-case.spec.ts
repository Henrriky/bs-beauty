import { PasswordResetSetPasswordUseCase } from '@/services/use-cases/auth/password-reset-set-password.use-case'
import { faker } from '@faker-js/faker'
import { UserType } from '@prisma/client'
import bcrypt from 'bcrypt'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MockCustomerRepository, MockProfessionalRepository } from '../../utils/mocks/repository'
import { MockPasswordResetTicketService } from '../../utils/mocks/services'

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn()
  }
}))

describe('PasswordResetSetPasswordUseCase', () => {
  let passwordResetSetPasswordUseCase: PasswordResetSetPasswordUseCase

  // Test data constants
  const validTicket = faker.string.alphanumeric(32)
  const newPassword = 'NewPassword@123'
  const hashedPassword = faker.string.alphanumeric(60)
  const userId = faker.string.uuid()

  const mockTicketData = {
    userId,
    email: faker.internet.email()
  }

  const mockCustomer = {
    id: userId,
    email: mockTicketData.email,
    userType: UserType.CUSTOMER,
    passwordHash: 'old-hashed-password',
    name: faker.person.fullName(),
    registerCompleted: true,
    profilePhotoUrl: null,
    googleId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockProfessional = {
    id: userId,
    email: mockTicketData.email,
    userType: UserType.PROFESSIONAL,
    passwordHash: 'old-hashed-password',
    name: faker.person.fullName(),
    registerCompleted: true,
    profilePhotoUrl: null,
    googleId: null,
    contact: faker.phone.number(),
    specialization: faker.person.jobTitle(),
    socialMedia: [],
    paymentMethods: [],
    notificationPreference: 'EMAIL',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  beforeEach(() => {
    vi.clearAllMocks()

    passwordResetSetPasswordUseCase = new PasswordResetSetPasswordUseCase(
      MockCustomerRepository,
      MockProfessionalRepository,
      MockPasswordResetTicketService
    )

    // Setup default bcrypt mock
    vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never)
  })

  it('should be defined', () => {
    expect(PasswordResetSetPasswordUseCase).toBeDefined()
  })

  describe('execute', () => {
    it('should reset password successfully for customer', async () => {
      // arrange
      vi.mocked(MockPasswordResetTicketService.consume).mockResolvedValueOnce(mockTicketData)
      vi.mocked(MockCustomerRepository.findById).mockResolvedValueOnce(mockCustomer as any)
      vi.mocked(MockProfessionalRepository.findById).mockResolvedValueOnce(null)
      vi.mocked(MockCustomerRepository.update).mockResolvedValueOnce(mockCustomer as any)

      // act
      await passwordResetSetPasswordUseCase.execute({
        ticket: validTicket,
        newPassword
      })

      // assert
      expect(MockPasswordResetTicketService.consume).toHaveBeenCalledWith(validTicket)
      expect(MockCustomerRepository.findById).toHaveBeenCalledWith(userId)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(userId)
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10)
      expect(MockCustomerRepository.update).toHaveBeenCalledWith(userId, {
        passwordHash: hashedPassword
      })
      expect(MockProfessionalRepository.update).not.toHaveBeenCalled()
    })

    it('should reset password successfully for professional', async () => {
      // arrange
      vi.mocked(MockPasswordResetTicketService.consume).mockResolvedValueOnce(mockTicketData)
      vi.mocked(MockCustomerRepository.findById).mockResolvedValueOnce(null)
      vi.mocked(MockProfessionalRepository.findById).mockResolvedValueOnce(mockProfessional as any)
      vi.mocked(MockProfessionalRepository.update).mockResolvedValueOnce(mockProfessional as any)

      // act
      await passwordResetSetPasswordUseCase.execute({
        ticket: validTicket,
        newPassword
      })

      // assert
      expect(MockPasswordResetTicketService.consume).toHaveBeenCalledWith(validTicket)
      expect(MockCustomerRepository.findById).toHaveBeenCalledWith(userId)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(userId)
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10)
      expect(MockProfessionalRepository.update).toHaveBeenCalledWith(userId, {
        passwordHash: hashedPassword
      })
      expect(MockCustomerRepository.update).not.toHaveBeenCalled()
    })

    it('should throw error when ticket is expired or not found', async () => {
      // arrange
      vi.mocked(MockPasswordResetTicketService.consume).mockResolvedValueOnce(null)

      // act & assert
      await expect(
        passwordResetSetPasswordUseCase.execute({
          ticket: 'invalid-ticket',
          newPassword
        })
      ).rejects.toThrow(
        expect.objectContaining({
          message: 'Bad Request',
          statusCode: 400,
          details: 'EXPIRED_OR_NOT_FOUND'
        })
      )

      expect(MockPasswordResetTicketService.consume).toHaveBeenCalledWith('invalid-ticket')
      expect(MockCustomerRepository.findById).not.toHaveBeenCalled()
      expect(MockProfessionalRepository.findById).not.toHaveBeenCalled()
      expect(MockCustomerRepository.update).not.toHaveBeenCalled()
      expect(MockProfessionalRepository.update).not.toHaveBeenCalled()
    })

    it('should throw error when user is not found in both repositories', async () => {
      // arrange
      vi.mocked(MockPasswordResetTicketService.consume).mockResolvedValueOnce(mockTicketData)
      vi.mocked(MockCustomerRepository.findById).mockResolvedValueOnce(null)
      vi.mocked(MockProfessionalRepository.findById).mockResolvedValueOnce(null)

      // act & assert
      await expect(
        passwordResetSetPasswordUseCase.execute({
          ticket: validTicket,
          newPassword
        })
      ).rejects.toThrow(
        expect.objectContaining({
          message: 'Bad Request',
          statusCode: 400,
          details: 'EXPIRED_OR_NOT_FOUND'
        })
      )

      expect(MockPasswordResetTicketService.consume).toHaveBeenCalledWith(validTicket)
      expect(MockCustomerRepository.findById).toHaveBeenCalledWith(userId)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(userId)
      expect(MockCustomerRepository.update).not.toHaveBeenCalled()
      expect(MockProfessionalRepository.update).not.toHaveBeenCalled()
    })

    it('should handle bcrypt hashing correctly', async () => {
      // arrange
      const customHashedPassword = 'custom-hashed-password'
      vi.mocked(bcrypt.hash).mockResolvedValue(customHashedPassword as never)
      vi.mocked(MockPasswordResetTicketService.consume).mockResolvedValueOnce(mockTicketData)
      vi.mocked(MockCustomerRepository.findById).mockResolvedValueOnce(mockCustomer as any)
      vi.mocked(MockProfessionalRepository.findById).mockResolvedValueOnce(null)
      vi.mocked(MockCustomerRepository.update).mockResolvedValueOnce(mockCustomer as any)

      const customPassword = 'CustomPassword@456'

      // act
      await passwordResetSetPasswordUseCase.execute({
        ticket: validTicket,
        newPassword: customPassword
      })

      // assert
      expect(bcrypt.hash).toHaveBeenCalledWith(customPassword, 10)
      expect(MockCustomerRepository.update).toHaveBeenCalledWith(userId, {
        passwordHash: customHashedPassword
      })
    })

    it('should propagate repository errors when updating customer', async () => {
      // arrange
      const repositoryError = new Error('Database connection failed')
      vi.mocked(MockPasswordResetTicketService.consume).mockResolvedValueOnce(mockTicketData)
      vi.mocked(MockCustomerRepository.findById).mockResolvedValueOnce(mockCustomer as any)
      vi.mocked(MockProfessionalRepository.findById).mockResolvedValueOnce(null)
      vi.mocked(MockCustomerRepository.update).mockRejectedValueOnce(repositoryError)

      // act & assert
      await expect(
        passwordResetSetPasswordUseCase.execute({
          ticket: validTicket,
          newPassword
        })
      ).rejects.toThrow('Database connection failed')

      expect(MockCustomerRepository.update).toHaveBeenCalledWith(userId, {
        passwordHash: hashedPassword
      })
    })

    it('should propagate repository errors when updating professional', async () => {
      // arrange
      const repositoryError = new Error('Database connection failed')
      vi.mocked(MockPasswordResetTicketService.consume).mockResolvedValueOnce(mockTicketData)
      vi.mocked(MockCustomerRepository.findById).mockResolvedValueOnce(null)
      vi.mocked(MockProfessionalRepository.findById).mockResolvedValueOnce(mockProfessional as any)
      vi.mocked(MockProfessionalRepository.update).mockRejectedValueOnce(repositoryError)

      // act & assert
      await expect(
        passwordResetSetPasswordUseCase.execute({
          ticket: validTicket,
          newPassword
        })
      ).rejects.toThrow('Database connection failed')

      expect(MockProfessionalRepository.update).toHaveBeenCalledWith(userId, {
        passwordHash: hashedPassword
      })
    })

    it('should propagate bcrypt errors', async () => {
      // arrange
      const bcryptError = new Error('Bcrypt hashing failed')
      vi.mocked(bcrypt.hash).mockRejectedValue(bcryptError as never)
      vi.mocked(MockPasswordResetTicketService.consume).mockResolvedValueOnce(mockTicketData)
      vi.mocked(MockCustomerRepository.findById).mockResolvedValueOnce(mockCustomer as any)
      vi.mocked(MockProfessionalRepository.findById).mockResolvedValueOnce(null)

      // act & assert
      await expect(
        passwordResetSetPasswordUseCase.execute({
          ticket: validTicket,
          newPassword
        })
      ).rejects.toThrow('Bcrypt hashing failed')

      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10)
      expect(MockCustomerRepository.update).not.toHaveBeenCalled()
      expect(MockProfessionalRepository.update).not.toHaveBeenCalled()
    })

    it('should handle ticket service errors', async () => {
      // arrange
      const ticketError = new Error('Ticket service unavailable')
      vi.mocked(MockPasswordResetTicketService.consume).mockRejectedValueOnce(ticketError)

      // act & assert
      await expect(
        passwordResetSetPasswordUseCase.execute({
          ticket: validTicket,
          newPassword
        })
      ).rejects.toThrow('Ticket service unavailable')

      expect(MockPasswordResetTicketService.consume).toHaveBeenCalledWith(validTicket)
      expect(MockCustomerRepository.findById).not.toHaveBeenCalled()
      expect(MockProfessionalRepository.findById).not.toHaveBeenCalled()
    })
  })
})