import { VerifyPasswordResetUseCase } from '@/services/use-cases/auth/verify-password-reset.use-case'
import { CustomError } from '@/utils/errors/custom.error.util'
import { UserType } from '@prisma/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MockCustomerRepository, MockProfessionalRepository } from '../../utils/mocks/repository'
import { MockCodeValidationService, MockPasswordResetTicketService } from '../../utils/mocks/services'

describe('VerifyPasswordResetUseCase', () => {
  let verifyPasswordResetUseCase: VerifyPasswordResetUseCase

  // Test data constants
  const validInput = {
    email: 'test@example.com',
    code: '123456'
  }

  const mockPayload = { userId: 'user-123' }
  const mockTicket = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

  const mockCustomer = {
    id: 'user-123',
    email: 'test@example.com',
    userType: UserType.CUSTOMER,
    passwordHash: 'hashed-password'
  }

  const mockProfessional = {
    id: 'user-123',
    email: 'test@example.com',
    userType: UserType.PROFESSIONAL,
    passwordHash: 'hashed-password'
  }

  beforeEach(() => {
    vi.clearAllMocks()

    verifyPasswordResetUseCase = new VerifyPasswordResetUseCase(
      MockCustomerRepository,
      MockProfessionalRepository,
      MockCodeValidationService,
      MockPasswordResetTicketService
    )
  })

  it('should be defined', () => {
    expect(VerifyPasswordResetUseCase).toBeDefined()
  })

  describe('execute', () => {
    it('should generate ticket successfully when code is valid and customer exists', async () => {
      // arrange
      MockCodeValidationService.verifyCodeAndConsume.mockResolvedValue({
        ok: true,
        payload: mockPayload
      })
      MockCustomerRepository.findById.mockResolvedValue(mockCustomer as any)
      MockProfessionalRepository.findById.mockResolvedValue(null)
      MockPasswordResetTicketService.create.mockResolvedValue(mockTicket)

      // act
      const result = await verifyPasswordResetUseCase.execute(validInput)

      // assert
      expect(MockCodeValidationService.verifyCodeAndConsume).toHaveBeenCalledWith({
        purpose: 'passwordReset',
        recipientId: validInput.email,
        code: validInput.code
      })
      expect(MockCustomerRepository.findById).toHaveBeenCalledWith(mockPayload.userId)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(mockPayload.userId)
      expect(MockPasswordResetTicketService.create).toHaveBeenCalledWith(
        { email: validInput.email, userId: mockCustomer.id },
        15 * 60
      )
      expect(result).toEqual({ ticket: mockTicket })
    })

    it('should generate ticket successfully when code is valid and professional exists', async () => {
      // arrange
      MockCodeValidationService.verifyCodeAndConsume.mockResolvedValue({
        ok: true,
        payload: mockPayload
      })
      MockCustomerRepository.findById.mockResolvedValue(null)
      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional as any)
      MockPasswordResetTicketService.create.mockResolvedValue(mockTicket)

      // act
      const result = await verifyPasswordResetUseCase.execute(validInput)

      // assert
      expect(MockCustomerRepository.findById).toHaveBeenCalledWith(mockPayload.userId)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(mockPayload.userId)
      expect(MockPasswordResetTicketService.create).toHaveBeenCalledWith(
        { email: validInput.email, userId: mockProfessional.id },
        15 * 60
      )
      expect(result).toEqual({ ticket: mockTicket })
    })

    it('should throw CustomError when code validation fails with INVALID_CODE', async () => {
      // arrange
      MockCodeValidationService.verifyCodeAndConsume.mockResolvedValue({
        ok: false,
        reason: 'INVALID_CODE'
      })

      // act & assert
      await expect(verifyPasswordResetUseCase.execute(validInput)).rejects.toEqual(
        expect.objectContaining({
          message: 'Bad Request',
          statusCode: 400,
          details: 'Invalid code'
        })
      )

      expect(MockCustomerRepository.findById).not.toHaveBeenCalled()
      expect(MockProfessionalRepository.findById).not.toHaveBeenCalled()
      expect(MockPasswordResetTicketService.create).not.toHaveBeenCalled()
    })

    it('should throw CustomError when code validation fails with EXPIRED_OR_NOT_FOUND', async () => {
      // arrange
      MockCodeValidationService.verifyCodeAndConsume.mockResolvedValue({
        ok: false,
        reason: 'EXPIRED_OR_NOT_FOUND'
      })

      // act & assert
      await expect(verifyPasswordResetUseCase.execute(validInput)).rejects.toEqual(
        expect.objectContaining({
          message: 'Bad Request',
          statusCode: 400,
          details: 'Code expired or not found'
        })
      )

      expect(MockCustomerRepository.findById).not.toHaveBeenCalled()
      expect(MockProfessionalRepository.findById).not.toHaveBeenCalled()
      expect(MockPasswordResetTicketService.create).not.toHaveBeenCalled()
    })

    it('should throw CustomError when user is not found in any repository', async () => {
      // arrange
      MockCodeValidationService.verifyCodeAndConsume.mockResolvedValue({
        ok: true,
        payload: mockPayload
      })
      MockCustomerRepository.findById.mockResolvedValue(null)
      MockProfessionalRepository.findById.mockResolvedValue(null)

      // act & assert
      await expect(verifyPasswordResetUseCase.execute(validInput)).rejects.toEqual(
        expect.objectContaining({
          message: 'Bad Request',
          statusCode: 400,
          details: 'User not found'
        })
      )

      expect(MockCustomerRepository.findById).toHaveBeenCalledWith(mockPayload.userId)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(mockPayload.userId)
      expect(MockPasswordResetTicketService.create).not.toHaveBeenCalled()
    })
  })
})