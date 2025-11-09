import { beforeEach, describe, expect, it, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { PasswordResetRequestUseCase } from '../../../../services/use-cases/auth/password-reset-request.use-case'
import { CustomError } from '../../../../utils/errors/custom.error.util'
import { DiscoverySource, NotificationChannel, UserType } from '@prisma/client'

describe('PasswordResetRequestUseCase', () => {
  let customerRepositoryMock: any
  let professionalRepositoryMock: any
  let codeValidationServiceMock: any
  let emailServiceMock: any
  let passwordResetRequestUseCase: PasswordResetRequestUseCase

  beforeEach(() => {
    vi.clearAllMocks()

    customerRepositoryMock = {
      findByEmail: vi.fn()
    }

    professionalRepositoryMock = {
      findByEmail: vi.fn()
    }

    codeValidationServiceMock = {
      allowResendAndStartCooldown: vi.fn(),
      savePendingCode: vi.fn()
    }

    emailServiceMock = {
      sendVerificationCode: vi.fn()
    }

    passwordResetRequestUseCase = new PasswordResetRequestUseCase(
      customerRepositoryMock,
      professionalRepositoryMock,
      codeValidationServiceMock,
      emailServiceMock
    )
  })

  it('should be defined', () => {
    expect(PasswordResetRequestUseCase).toBeDefined()
  })

  describe('execute', () => {
    it('should send password reset code for customer with valid email', async () => {
      // arrange
      const email = faker.internet.email()
      const customer = {
        id: faker.string.uuid(),
        email,
        passwordHash: faker.internet.password()
      }

      customerRepositoryMock.findByEmail.mockResolvedValueOnce(customer)
      professionalRepositoryMock.findByEmail.mockResolvedValueOnce(null)
      codeValidationServiceMock.allowResendAndStartCooldown.mockResolvedValueOnce(true)
      codeValidationServiceMock.savePendingCode.mockResolvedValueOnce(undefined)
      emailServiceMock.sendVerificationCode.mockResolvedValueOnce(undefined)

      // act
      await passwordResetRequestUseCase.execute(email)

      // assert
      expect(customerRepositoryMock.findByEmail).toHaveBeenCalledWith(email)
      expect(professionalRepositoryMock.findByEmail).toHaveBeenCalledWith(email)
      expect(codeValidationServiceMock.allowResendAndStartCooldown).toHaveBeenCalledWith({
        purpose: 'passwordReset',
        recipientId: email,
        cooldownSeconds: 60
      })
      expect(codeValidationServiceMock.savePendingCode).toHaveBeenCalledWith({
        purpose: 'passwordReset',
        recipientId: email,
        code: expect.stringMatching(/^\d{6}$/),
        payload: { userId: customer.id },
        timeToLiveSeconds: 600
      })
      expect(emailServiceMock.sendVerificationCode).toHaveBeenCalledWith({
        to: email,
        code: expect.stringMatching(/^\d{6}$/),
        expirationCodeTime: 600,
        purpose: 'passwordReset'
      })
    })

    it('should send password reset code for professional with valid email', async () => {
      // arrange
      const email = faker.internet.email()
      const professional = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email,
        passwordHash: faker.internet.password(),
        userType: UserType.PROFESSIONAL,
        discoverySource: faker.helpers.enumValue(DiscoverySource),
        notificationChannel: faker.helpers.enumValue(NotificationChannel),
        socialMedia: faker.internet.url(),
        contact: faker.phone.number(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      }

      customerRepositoryMock.findByEmail.mockResolvedValueOnce(null)
      professionalRepositoryMock.findByEmail.mockResolvedValueOnce(professional)
      codeValidationServiceMock.allowResendAndStartCooldown.mockResolvedValueOnce(true)
      codeValidationServiceMock.savePendingCode.mockResolvedValueOnce(undefined)
      emailServiceMock.sendVerificationCode.mockResolvedValueOnce(undefined)

      // act
      await passwordResetRequestUseCase.execute(email)

      // assert
      expect(customerRepositoryMock.findByEmail).toHaveBeenCalledWith(email)
      expect(professionalRepositoryMock.findByEmail).toHaveBeenCalledWith(email)
      expect(codeValidationServiceMock.allowResendAndStartCooldown).toHaveBeenCalledWith({
        purpose: 'passwordReset',
        recipientId: email,
        cooldownSeconds: 60
      })
      expect(codeValidationServiceMock.savePendingCode).toHaveBeenCalledWith({
        purpose: 'passwordReset',
        recipientId: email,
        code: expect.stringMatching(/^\d{6}$/),
        payload: { userId: professional.id },
        timeToLiveSeconds: 600
      })
      expect(emailServiceMock.sendVerificationCode).toHaveBeenCalledWith({
        to: email,
        code: expect.stringMatching(/^\d{6}$/),
        expirationCodeTime: 600,
        purpose: 'passwordReset'
      })
    })

    it('should throw error when resend cooldown is not allowed', async () => {
      // arrange
      const email = faker.internet.email()
      const customer = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email,
        passwordHash: faker.internet.password(),
        userType: UserType.CUSTOMER,
        discoverySource: faker.helpers.enumValue(DiscoverySource),
        notificationChannel: faker.helpers.enumValue(NotificationChannel),
        socialMedia: faker.internet.url(),
        contact: faker.phone.number(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      }

      customerRepositoryMock.findByEmail.mockResolvedValueOnce(customer)
      professionalRepositoryMock.findByEmail.mockResolvedValueOnce(null)
      codeValidationServiceMock.allowResendAndStartCooldown.mockResolvedValueOnce(false)

      // act & assert
      await expect(passwordResetRequestUseCase.execute(email)).rejects.toThrow(
        new CustomError('Too Many Requests', 429, 'Please wait before requesting another code')
      )

      expect(customerRepositoryMock.findByEmail).toHaveBeenCalledWith(email)
      expect(professionalRepositoryMock.findByEmail).toHaveBeenCalledWith(email)
      expect(codeValidationServiceMock.allowResendAndStartCooldown).toHaveBeenCalledWith({
        purpose: 'passwordReset',
        recipientId: email,
        cooldownSeconds: 60
      })
      expect(codeValidationServiceMock.savePendingCode).not.toHaveBeenCalled()
      expect(emailServiceMock.sendVerificationCode).not.toHaveBeenCalled()
    })

    it('should return early when user is not found', async () => {
      // arrange
      const email = faker.internet.email()

      customerRepositoryMock.findByEmail.mockResolvedValueOnce(null)
      professionalRepositoryMock.findByEmail.mockResolvedValueOnce(null)
      codeValidationServiceMock.allowResendAndStartCooldown.mockResolvedValueOnce(true)

      // act
      await passwordResetRequestUseCase.execute(email)

      // assert
      expect(customerRepositoryMock.findByEmail).toHaveBeenCalledWith(email)
      expect(professionalRepositoryMock.findByEmail).toHaveBeenCalledWith(email)
      expect(codeValidationServiceMock.allowResendAndStartCooldown).toHaveBeenCalledWith({
        purpose: 'passwordReset',
        recipientId: email,
        cooldownSeconds: 60
      })
      expect(codeValidationServiceMock.savePendingCode).not.toHaveBeenCalled()
      expect(emailServiceMock.sendVerificationCode).not.toHaveBeenCalled()
    })

    it('should return early when user exists but has no password hash', async () => {
      // arrange
      const email = faker.internet.email()
      const customer = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email,
        passwordHash: null,
        userType: UserType.CUSTOMER,
        discoverySource: faker.helpers.enumValue(DiscoverySource),
        notificationChannel: faker.helpers.enumValue(NotificationChannel),
        socialMedia: faker.internet.url(),
        contact: faker.phone.number(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      }

      customerRepositoryMock.findByEmail.mockResolvedValueOnce(customer)
      professionalRepositoryMock.findByEmail.mockResolvedValueOnce(null)
      codeValidationServiceMock.allowResendAndStartCooldown.mockResolvedValueOnce(true)

      // act
      await passwordResetRequestUseCase.execute(email)

      // assert
      expect(customerRepositoryMock.findByEmail).toHaveBeenCalledWith(email)
      expect(professionalRepositoryMock.findByEmail).toHaveBeenCalledWith(email)
      expect(codeValidationServiceMock.allowResendAndStartCooldown).toHaveBeenCalledWith({
        purpose: 'passwordReset',
        recipientId: email,
        cooldownSeconds: 60
      })
      expect(codeValidationServiceMock.savePendingCode).not.toHaveBeenCalled()
      expect(emailServiceMock.sendVerificationCode).not.toHaveBeenCalled()
    })

    it('should prioritize customer when both customer and professional exist with same email', async () => {
      // arrange
      const email = faker.internet.email()
      const customerId = faker.string.uuid()
      const professionalId = faker.string.uuid()

      const customer = {
        id: customerId,
        name: faker.person.fullName(),
        email,
        passwordHash: faker.internet.password(),
        userType: UserType.CUSTOMER,
        discoverySource: faker.helpers.enumValue(DiscoverySource),
        notificationChannel: faker.helpers.enumValue(NotificationChannel),
        socialMedia: faker.internet.url(),
        contact: faker.phone.number(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      }

      const professional = {
        id: professionalId,
        name: faker.person.fullName(),
        email,
        passwordHash: faker.internet.password(),
        userType: UserType.PROFESSIONAL,
        discoverySource: faker.helpers.enumValue(DiscoverySource),
        notificationChannel: faker.helpers.enumValue(NotificationChannel),
        socialMedia: faker.internet.url(),
        contact: faker.phone.number(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      }

      customerRepositoryMock.findByEmail.mockResolvedValueOnce(customer)
      professionalRepositoryMock.findByEmail.mockResolvedValueOnce(professional)
      codeValidationServiceMock.allowResendAndStartCooldown.mockResolvedValueOnce(true)
      codeValidationServiceMock.savePendingCode.mockResolvedValueOnce(undefined)
      emailServiceMock.sendVerificationCode.mockResolvedValueOnce(undefined)

      // act
      await passwordResetRequestUseCase.execute(email)

      // assert
      expect(codeValidationServiceMock.savePendingCode).toHaveBeenCalledWith({
        purpose: 'passwordReset',
        recipientId: email,
        code: expect.stringMatching(/^\d{6}$/),
        payload: { userId: customerId }, // Should use customer id, not professional
        timeToLiveSeconds: 600
      })
    })

    it('should generate 6-digit code correctly', async () => {
      // arrange
      const email = faker.internet.email()
      const customer = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email,
        passwordHash: faker.internet.password(),
        userType: UserType.CUSTOMER,
        discoverySource: faker.helpers.enumValue(DiscoverySource),
        notificationChannel: faker.helpers.enumValue(NotificationChannel),
        socialMedia: faker.internet.url(),
        contact: faker.phone.number(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      }

      customerRepositoryMock.findByEmail.mockResolvedValueOnce(customer)
      professionalRepositoryMock.findByEmail.mockResolvedValueOnce(null)
      codeValidationServiceMock.allowResendAndStartCooldown.mockResolvedValueOnce(true)
      codeValidationServiceMock.savePendingCode.mockResolvedValueOnce(undefined)
      emailServiceMock.sendVerificationCode.mockResolvedValueOnce(undefined)

      // act
      await passwordResetRequestUseCase.execute(email)

      // assert
      const savePendingCodeCall = codeValidationServiceMock.savePendingCode.mock.calls[0][0]
      const sendEmailCall = emailServiceMock.sendVerificationCode.mock.calls[0][0]

      expect(savePendingCodeCall.code).toMatch(/^\d{6}$/)
      expect(sendEmailCall.code).toMatch(/^\d{6}$/)
      expect(savePendingCodeCall.code).toBe(sendEmailCall.code)
    })

    it('should handle edge case with empty string password hash', async () => {
      // arrange
      const email = faker.internet.email()
      const customer = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email,
        passwordHash: '',
        userType: UserType.CUSTOMER,
        discoverySource: faker.helpers.enumValue(DiscoverySource),
        notificationChannel: faker.helpers.enumValue(NotificationChannel),
        socialMedia: faker.internet.url(),
        contact: faker.phone.number(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      }

      customerRepositoryMock.findByEmail.mockResolvedValueOnce(customer)
      professionalRepositoryMock.findByEmail.mockResolvedValueOnce(null)
      codeValidationServiceMock.allowResendAndStartCooldown.mockResolvedValueOnce(true)

      // act
      await passwordResetRequestUseCase.execute(email)

      // assert
      expect(codeValidationServiceMock.savePendingCode).not.toHaveBeenCalled()
      expect(emailServiceMock.sendVerificationCode).not.toHaveBeenCalled()
    })

    it('should use correct constants for cooldown and TTL', async () => {
      // arrange
      const email = faker.internet.email()
      const customer = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email,
        passwordHash: faker.internet.password(),
        userType: UserType.CUSTOMER,
        discoverySource: faker.helpers.enumValue(DiscoverySource),
        notificationChannel: faker.helpers.enumValue(NotificationChannel),
        socialMedia: faker.internet.url(),
        contact: faker.phone.number(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      }

      customerRepositoryMock.findByEmail.mockResolvedValueOnce(customer)
      professionalRepositoryMock.findByEmail.mockResolvedValueOnce(null)
      codeValidationServiceMock.allowResendAndStartCooldown.mockResolvedValueOnce(true)
      codeValidationServiceMock.savePendingCode.mockResolvedValueOnce(undefined)
      emailServiceMock.sendVerificationCode.mockResolvedValueOnce(undefined)

      // act
      await passwordResetRequestUseCase.execute(email)

      // assert
      expect(codeValidationServiceMock.allowResendAndStartCooldown).toHaveBeenCalledWith(
        expect.objectContaining({
          cooldownSeconds: 60 // RESEND_COOLDOWN_SECONDS
        })
      )

      expect(codeValidationServiceMock.savePendingCode).toHaveBeenCalledWith(
        expect.objectContaining({
          timeToLiveSeconds: 600 // RESET_TTL_SECONDS
        })
      )

      expect(emailServiceMock.sendVerificationCode).toHaveBeenCalledWith(
        expect.objectContaining({
          expirationCodeTime: 600 // RESET_TTL_SECONDS
        })
      )
    })
  })
})
