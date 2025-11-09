import { VerifyUserUseCase } from '@/services/use-cases/auth/verify-user.use-case'
import { CustomError } from '@/utils/errors/custom.error.util'
import { UserType } from '@prisma/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MockCustomerRepository } from '../../utils/mocks/repository'
import { MockCodeValidationService } from '../../utils/mocks/services'

describe('VerifyUserUseCase', () => {
  let verifyUserUseCase: VerifyUserUseCase

  // Test data constants
  const validInput = {
    email: '  Test@Example.com  ',
    code: '  123456  '
  }

  const normalizedEmail = 'test@example.com'
  const normalizedCode = '123456'

  const mockPayload = { passwordHash: 'hashed-password-123' }

  beforeEach(() => {
    vi.clearAllMocks()

    verifyUserUseCase = new VerifyUserUseCase(MockCustomerRepository, MockCodeValidationService)
  })

  it('should be defined', () => {
    expect(VerifyUserUseCase).toBeDefined()
  })

  describe('execute', () => {
    it('should create account successfully when code is valid and customer does not exist', async () => {
      // arrange
      MockCodeValidationService.verifyCodeAndConsume.mockResolvedValue({
        ok: true,
        payload: mockPayload
      })
      MockCustomerRepository.findByEmail.mockResolvedValue(null)
      MockCustomerRepository.create.mockResolvedValue({} as any)

      // act
      const result = await verifyUserUseCase.execute(validInput)

      // assert
      expect(MockCodeValidationService.verifyCodeAndConsume).toHaveBeenCalledWith({
        purpose: 'register',
        recipientId: normalizedEmail,
        code: normalizedCode
      })
      expect(MockCustomerRepository.findByEmail).toHaveBeenCalledWith(normalizedEmail)
      expect(MockCustomerRepository.create).toHaveBeenCalledWith({
        email: normalizedEmail,
        userType: UserType.CUSTOMER,
        passwordHash: mockPayload.passwordHash,
        registerCompleted: false
      })
      expect(result).toEqual({ message: 'Account created' })
    })

    it('should return message when customer already exists', async () => {
      // arrange
      const input = {
        email: normalizedEmail,
        code: normalizedCode
      }

      MockCodeValidationService.verifyCodeAndConsume.mockResolvedValue({
        ok: true,
        payload: mockPayload
      })
      MockCustomerRepository.findByEmail.mockResolvedValue({ id: 'existing-id' } as any)

      // act
      const result = await verifyUserUseCase.execute(input)

      // assert
      expect(MockCustomerRepository.create).not.toHaveBeenCalled()
      expect(result).toEqual({ message: 'Account already exists' })
    })

    it('should throw CustomError when code validation fails with INVALID_CODE', async () => {
      // arrange
      const input = {
        email: normalizedEmail,
        code: normalizedCode
      }

      MockCodeValidationService.verifyCodeAndConsume.mockResolvedValue({
        ok: false,
        reason: 'INVALID_CODE'
      })

      // act & assert
      await expect(verifyUserUseCase.execute(input)).rejects.toEqual(
        expect.objectContaining({
          message: 'Bad Request',
          statusCode: 400,
          details: 'Invalid code'
        })
      )

      expect(MockCustomerRepository.findByEmail).not.toHaveBeenCalled()
      expect(MockCustomerRepository.create).not.toHaveBeenCalled()
    })

    it('should throw CustomError when code validation fails with other reason', async () => {
      // arrange
      const input = {
        email: normalizedEmail,
        code: normalizedCode
      }

      MockCodeValidationService.verifyCodeAndConsume.mockResolvedValue({
        ok: false,
        reason: 'EXPIRED_OR_NOT_FOUND'
      })

      // act & assert
      await expect(verifyUserUseCase.execute(input)).rejects.toEqual(
        expect.objectContaining({
          message: 'Bad Request',
          statusCode: 400,
          details: 'Code expired or not found'
        })
      )
    })

    it('should throw CustomError when password hash is missing from payload', async () => {
      // arrange
      const input = {
        email: normalizedEmail,
        code: normalizedCode
      }

      MockCodeValidationService.verifyCodeAndConsume.mockResolvedValue({
        ok: true,
        payload: {}
      })
      MockCustomerRepository.findByEmail.mockResolvedValue(null)

      // act & assert
      await expect(verifyUserUseCase.execute(input)).rejects.toEqual(
        expect.objectContaining({
          message: 'Internal Server Error',
          statusCode: 500,
          details: 'Missing password hash payload'
        })
      )

      expect(MockCustomerRepository.create).not.toHaveBeenCalled()
    })

    it('should throw error when code validation service throws unexpected error', async () => {
      // arrange
      const input = {
        email: normalizedEmail,
        code: normalizedCode
      }

      const unexpectedError = new Error('Redis connection failed')
      MockCodeValidationService.verifyCodeAndConsume.mockRejectedValue(unexpectedError)

      // act & assert
      await expect(verifyUserUseCase.execute(input)).rejects.toThrow(unexpectedError)

      expect(MockCustomerRepository.findByEmail).not.toHaveBeenCalled()
      expect(MockCustomerRepository.create).not.toHaveBeenCalled()
    })

    it('should throw error when customer repository create fails', async () => {
      // arrange
      MockCodeValidationService.verifyCodeAndConsume.mockResolvedValue({
        ok: true,
        payload: mockPayload
      })
      MockCustomerRepository.findByEmail.mockResolvedValue(null)

      const dbError = new Error('Database connection failed')
      MockCustomerRepository.create.mockRejectedValue(dbError)

      // act & assert
      await expect(verifyUserUseCase.execute(validInput)).rejects.toThrow(dbError)

      expect(MockCodeValidationService.verifyCodeAndConsume).toHaveBeenCalledWith({
        purpose: 'register',
        recipientId: normalizedEmail,
        code: normalizedCode
      })
      expect(MockCustomerRepository.findByEmail).toHaveBeenCalledWith(normalizedEmail)
      expect(MockCustomerRepository.create).toHaveBeenCalledWith({
        email: normalizedEmail,
        userType: UserType.CUSTOMER,
        passwordHash: mockPayload.passwordHash,
        registerCompleted: false
      })
    })
  })
})
