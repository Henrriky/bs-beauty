import { RegisterUserUseCase } from '@/services/use-cases/auth/register-user.use-case'
import { CustomError } from '@/utils/errors/custom.error.util'
import { UserType } from '@prisma/client'
import bcrypt from 'bcrypt'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { MockCustomerRepository, MockProfessionalRepository } from '../../utils/mocks/repository'
import { MockCodeValidationService, MockEmailService } from '../../utils/mocks/services'

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn()
  }
}))

describe('RegisterUserUseCase', () => {
  let registerUserUseCase: RegisterUserUseCase

  const mockUserInput = {
    email: faker.internet.email(),
    password: faker.internet.password()
  }

  const mockHashedPassword = faker.string.alphanumeric(60)

  const mockExistingCustomer = {
    id: faker.string.uuid(),
    email: mockUserInput.email,
    name: faker.person.fullName(),
    passwordHash: faker.internet.password(),
    googleId: null,
    registerCompleted: true,
    userType: UserType.CUSTOMER,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }

  const mockExistingProfessional = {
    id: faker.string.uuid(),
    email: mockUserInput.email,
    name: faker.person.fullName(),
    passwordHash: faker.internet.password(),
    googleId: null,
    registerCompleted: true,
    userType: UserType.PROFESSIONAL,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(bcrypt.hash).mockResolvedValue(mockHashedPassword as any)

    registerUserUseCase = new RegisterUserUseCase(
      MockCustomerRepository,
      MockProfessionalRepository,
      MockCodeValidationService,
      MockEmailService
    )
  })

  it('should be defined', () => {
    expect(RegisterUserUseCase).toBeDefined()
  })

  describe('executeRegisterCustomer', () => {
    it('should successfully register a new customer when email is not in use', async () => {
      // arrange
      vi.mocked(MockCustomerRepository.findByEmail).mockResolvedValueOnce(null)
      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValueOnce(null)
      vi.mocked(MockCodeValidationService.allowResendAndStartCooldown).mockResolvedValueOnce(true)

      // act
      await registerUserUseCase.executeRegisterCustomer(mockUserInput)

      // assert
      expect(MockCustomerRepository.findByEmail).toHaveBeenCalledWith(mockUserInput.email)
      expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(mockUserInput.email)
      expect(MockCodeValidationService.allowResendAndStartCooldown).toHaveBeenCalledWith({
        purpose: 'register',
        recipientId: mockUserInput.email,
        cooldownSeconds: 60
      })
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInput.password, 10)
      expect(MockCodeValidationService.savePendingCode).toHaveBeenCalledWith(
        expect.objectContaining({
          purpose: 'register',
          recipientId: mockUserInput.email,
          payload: { passwordHash: mockHashedPassword },
          timeToLiveSeconds: 600
        })
      )
      expect(MockEmailService.sendVerificationCode).toHaveBeenCalledWith(
        expect.objectContaining({
          to: mockUserInput.email,
          expirationCodeTime: 600,
          purpose: 'register'
        })
      )
    })

    it('should throw error when customer with email already exists', async () => {
      // arrange
      vi.mocked(MockCustomerRepository.findByEmail).mockResolvedValueOnce(mockExistingCustomer as any)
      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValueOnce(null)

      // act & assert
      await expect(
        registerUserUseCase.executeRegisterCustomer(mockUserInput)
      ).rejects.toThrow(
        new CustomError('Bad Request', 400, `User with email '${mockUserInput.email}' already exists`)
      )

      expect(MockCustomerRepository.findByEmail).toHaveBeenCalledWith(mockUserInput.email)
      expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(mockUserInput.email)
      expect(MockCodeValidationService.allowResendAndStartCooldown).not.toHaveBeenCalled()
      expect(bcrypt.hash).not.toHaveBeenCalled()
    })

    it('should throw error when professional with email already exists', async () => {
      // arrange
      vi.mocked(MockCustomerRepository.findByEmail).mockResolvedValueOnce(null)
      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValueOnce(mockExistingProfessional as any)

      // act & assert
      await expect(
        registerUserUseCase.executeRegisterCustomer(mockUserInput)
      ).rejects.toThrow(
        new CustomError('Bad Request', 400, `User with email '${mockUserInput.email}' already exists`)
      )

      expect(MockCustomerRepository.findByEmail).toHaveBeenCalledWith(mockUserInput.email)
      expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(mockUserInput.email)
      expect(MockCodeValidationService.allowResendAndStartCooldown).not.toHaveBeenCalled()
    })

    it('should throw error when both customer and professional with email exist', async () => {
      // arrange
      vi.mocked(MockCustomerRepository.findByEmail).mockResolvedValueOnce(mockExistingCustomer as any)
      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValueOnce(mockExistingProfessional as any)

      // act & assert
      await expect(
        registerUserUseCase.executeRegisterCustomer(mockUserInput)
      ).rejects.toThrow(
        new CustomError('Bad Request', 400, `User with email '${mockUserInput.email}' already exists`)
      )

      expect(MockCustomerRepository.findByEmail).toHaveBeenCalledWith(mockUserInput.email)
      expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(mockUserInput.email)
    })

    it('should throw error when resend is not allowed due to cooldown', async () => {
      // arrange
      vi.mocked(MockCustomerRepository.findByEmail).mockResolvedValueOnce(null)
      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValueOnce(null)
      vi.mocked(MockCodeValidationService.allowResendAndStartCooldown).mockResolvedValueOnce(false)

      // act & assert
      await expect(
        registerUserUseCase.executeRegisterCustomer(mockUserInput)
      ).rejects.toThrow(
        new CustomError('Too Many Requests', 429, 'Please wait before requesting another code')
      )

      expect(MockCodeValidationService.allowResendAndStartCooldown).toHaveBeenCalledWith({
        purpose: 'register',
        recipientId: mockUserInput.email,
        cooldownSeconds: 60
      })
      expect(bcrypt.hash).not.toHaveBeenCalled()
      expect(MockCodeValidationService.savePendingCode).not.toHaveBeenCalled()
      expect(MockEmailService.sendVerificationCode).not.toHaveBeenCalled()
    })

    it('should propagate repository errors', async () => {
      // arrange
      const repositoryError = new Error('Database connection failed')
      vi.mocked(MockCustomerRepository.findByEmail).mockRejectedValueOnce(repositoryError)

      // act & assert
      await expect(
        registerUserUseCase.executeRegisterCustomer(mockUserInput)
      ).rejects.toThrow(repositoryError.message)

      expect(MockCustomerRepository.findByEmail).toHaveBeenCalledWith(mockUserInput.email)
    })

    it('should propagate bcrypt errors', async () => {
      // arrange
      const bcryptError = new Error('Bcrypt hash failed')
      vi.mocked(MockCustomerRepository.findByEmail).mockResolvedValueOnce(null)
      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValueOnce(null)
      vi.mocked(MockCodeValidationService.allowResendAndStartCooldown).mockResolvedValueOnce(true)
      vi.mocked(bcrypt.hash).mockRejectedValueOnce(bcryptError)

      // act & assert
      await expect(
        registerUserUseCase.executeRegisterCustomer(mockUserInput)
      ).rejects.toThrow(bcryptError.message)

      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInput.password, 10)
    })
  })

  describe('executeRegisterProfessional', () => {
    it('should successfully register a professional', async () => {
      // arrange
      vi.mocked(MockProfessionalRepository.updateProfessionalByEmail).mockResolvedValueOnce(mockExistingProfessional as any)

      // act
      await registerUserUseCase.executeRegisterProfessional(mockUserInput)

      // assert
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInput.password, 10)
      expect(MockProfessionalRepository.updateProfessionalByEmail).toHaveBeenCalledWith(
        mockUserInput.email,
        {
          email: mockUserInput.email,
          passwordHash: mockHashedPassword
        }
      )
    })

    it('should propagate bcrypt errors during professional registration', async () => {
      // arrange
      const bcryptError = new Error('Bcrypt hash failed')
      vi.mocked(bcrypt.hash).mockRejectedValueOnce(bcryptError)

      // act & assert
      await expect(
        registerUserUseCase.executeRegisterProfessional(mockUserInput)
      ).rejects.toThrow(bcryptError.message)

      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInput.password, 10)
      expect(MockProfessionalRepository.updateProfessionalByEmail).not.toHaveBeenCalled()
    })

    it('should propagate repository errors during professional registration', async () => {
      // arrange
      const repositoryError = new Error('Repository update failed')
      vi.mocked(MockProfessionalRepository.updateProfessionalByEmail).mockRejectedValueOnce(repositoryError)

      // act & assert
      await expect(
        registerUserUseCase.executeRegisterProfessional(mockUserInput)
      ).rejects.toThrow(repositoryError.message)

      expect(MockProfessionalRepository.updateProfessionalByEmail).toHaveBeenCalledWith(
        mockUserInput.email,
        {
          email: mockUserInput.email,
          passwordHash: mockHashedPassword
        }
      )
    })
  })

  describe('executeFindProfessionalByEmail', () => {
    it('should return professional when found by email', async () => {
      // arrange
      const email = 'test@example.com'
      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValueOnce(mockExistingProfessional as any)

      // act
      const result = await registerUserUseCase.executeFindProfessionalByEmail(email)

      // assert
      expect(result).toEqual(mockExistingProfessional)
      expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(email)
    })

    it('should throw error when professional is not found', async () => {
      // arrange
      const email = 'notfound@example.com'
      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValueOnce(null)

      // act & assert
      await expect(
        registerUserUseCase.executeFindProfessionalByEmail(email)
      ).rejects.toThrow(
        new CustomError('Bad Request', 400, `Professional with email '${email}' does not exists`)
      )

      expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(email)
    })

    it('should propagate repository errors during professional search', async () => {
      // arrange
      const email = 'error@example.com'
      const repositoryError = new Error('Repository find failed')
      vi.mocked(MockProfessionalRepository.findByEmail).mockRejectedValueOnce(repositoryError)

      // act & assert
      await expect(
        registerUserUseCase.executeFindProfessionalByEmail(email)
      ).rejects.toThrow(repositoryError.message)

      expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(email)
    })
  })
})
