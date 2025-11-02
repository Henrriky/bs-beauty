import { GenerateTokensUseCase } from '@/services/use-cases/auth/generate-tokens.use-case'
import { CustomError } from '@/utils/errors/custom.error.util'
import { faker } from '@faker-js/faker'
import { UserType, DiscoverySource, NotificationChannel } from '@prisma/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MockCustomerRepository, MockProfessionalRepository } from '../../utils/mocks/repository'

describe('GenerateTokensUseCase', () => {
  let generateTokensUseCase: GenerateTokensUseCase
  let encrypterMock: any
  let refreshTokenServiceMock: any

  beforeEach(() => {
    vi.clearAllMocks()

    vi.resetAllMocks()

    encrypterMock = {
      encrypt: vi.fn()
    }

    refreshTokenServiceMock = {
      rotate: vi.fn(),
      revoke: vi.fn(),
      validate: vi.fn()
    }

    generateTokensUseCase = new GenerateTokensUseCase(
      MockCustomerRepository,
      MockProfessionalRepository,
      encrypterMock,
      refreshTokenServiceMock
    )
  })

  it('should be defined', () => {
    expect(GenerateTokensUseCase).toBeDefined()
  })

  describe('execute', () => {
    it('should generate new tokens for a customer successfully', async () => {
      // arrange
      const refreshToken = 'valid_refresh_token'
      const userId = faker.string.uuid()
      const newRefreshToken = 'new_refresh_token'
      const accessToken = 'new_access_token'

      const customer = {
        id: userId,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        userType: UserType.CUSTOMER,
        registerCompleted: true,
        profilePhotoUrl: faker.internet.url(),
        createdAt: new Date(),
        updatedAt: new Date(),
        birthdate: new Date(),
        passwordHash: null,
        googleId: null,
        phone: null,
        discoverySource: DiscoverySource.INSTAGRAM,
        notificationPreference: NotificationChannel.ALL,
        acceptsNotifications: true,
        referrerId: null,
        referralCount: 0,
        alwaysAllowImageUse: false
      }

      refreshTokenServiceMock.rotate.mockResolvedValueOnce({
        userId,
        refreshToken: newRefreshToken,
        refreshTokenId: faker.string.uuid()
      })

      MockCustomerRepository.findById.mockResolvedValueOnce(customer)
      MockProfessionalRepository.findById.mockResolvedValueOnce(null)

      encrypterMock.encrypt.mockResolvedValueOnce({ accessToken })

      // act
      const result = await generateTokensUseCase.execute(refreshToken)

      // assert
      expect(result).toEqual({
        accessToken,
        refreshToken: newRefreshToken
      })

      expect(refreshTokenServiceMock.rotate).toHaveBeenCalledWith(refreshToken)
      expect(MockCustomerRepository.findById).toHaveBeenCalledWith(userId)
      expect(MockProfessionalRepository.findById).not.toHaveBeenCalled() // não deve ser chamado quando customer é encontrado
      expect(MockProfessionalRepository.findProfessionalPermissions).not.toHaveBeenCalled()
      expect(encrypterMock.encrypt).toHaveBeenCalledWith({
        userId: customer.id,
        id: customer.id,
        userType: customer.userType,
        email: customer.email,
        name: customer.name,
        registerCompleted: customer.registerCompleted,
        profilePhotoUrl: customer.profilePhotoUrl,
        permissions: []
      })
    })

    it('should generate new tokens for a professional successfully', async () => {
      // arrange
      const refreshToken = 'valid_refresh_token'
      const userId = faker.string.uuid()
      const newRefreshToken = 'new_refresh_token'
      const accessToken = 'new_access_token'

      const professional = {
        id: userId,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        userType: UserType.PROFESSIONAL,
        registerCompleted: true,
        profilePhotoUrl: faker.internet.url(),
        createdAt: new Date(),
        updatedAt: new Date(),
        passwordHash: null,
        googleId: null,
        notificationPreference: NotificationChannel.ALL,
        paymentMethods: null,
        gender: 'FEMALE' as const,
        specialization: 'Hair Stylist',
        socialMedia: {},
        contact: faker.phone.number()
      }

      const permissions = ['professional.read', 'professional.create']

      refreshTokenServiceMock.rotate.mockResolvedValueOnce({
        userId,
        refreshToken: newRefreshToken,
        refreshTokenId: faker.string.uuid()
      })

      MockCustomerRepository.findById.mockResolvedValueOnce(null)
      MockProfessionalRepository.findById.mockResolvedValueOnce(professional)
      MockProfessionalRepository.findProfessionalPermissions.mockResolvedValueOnce(permissions as any)

      encrypterMock.encrypt.mockResolvedValueOnce({ accessToken })

      // act
      const result = await generateTokensUseCase.execute(refreshToken)

      // assert
      expect(result).toEqual({
        accessToken,
        refreshToken: newRefreshToken
      })

      expect(refreshTokenServiceMock.rotate).toHaveBeenCalledWith(refreshToken)
      expect(MockCustomerRepository.findById).toHaveBeenCalledWith(userId)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(userId)
      expect(MockProfessionalRepository.findProfessionalPermissions).toHaveBeenCalledWith(userId)
      expect(encrypterMock.encrypt).toHaveBeenCalledWith({
        userId: professional.id,
        id: professional.id,
        userType: professional.userType,
        email: professional.email,
        name: professional.name,
        registerCompleted: professional.registerCompleted,
        profilePhotoUrl: professional.profilePhotoUrl,
        permissions
      })
    })

    it('should throw CustomError when user is not found', async () => {
      // arrange
      const refreshToken = 'valid_refresh_token'
      const userId = faker.string.uuid()
      const newRefreshToken = 'new_refresh_token'

      refreshTokenServiceMock.rotate.mockResolvedValueOnce({
        userId,
        refreshToken: newRefreshToken,
        refreshTokenId: faker.string.uuid()
      })

      MockCustomerRepository.findById.mockResolvedValueOnce(null)
      MockProfessionalRepository.findById.mockResolvedValueOnce(null)

      // act & assert
      await expect(generateTokensUseCase.execute(refreshToken))
        .rejects
        .toThrow(new CustomError('Bad Request', 400, 'Invalid credentials'))

      expect(refreshTokenServiceMock.rotate).toHaveBeenCalledWith(refreshToken)
      expect(MockCustomerRepository.findById).toHaveBeenCalledWith(userId)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(userId)
      expect(encrypterMock.encrypt).not.toHaveBeenCalled()
    })

    it('should propagate error when refresh token service fails', async () => {
      // arrange
      const refreshToken = 'invalid_refresh_token'
      const error = new Error('INVALID_OR_EXPIRED')

      refreshTokenServiceMock.rotate.mockRejectedValueOnce(error)

      // act & assert
      await expect(generateTokensUseCase.execute(refreshToken))
        .rejects
        .toThrow(error)

      expect(refreshTokenServiceMock.rotate).toHaveBeenCalledWith(refreshToken)
      expect(MockCustomerRepository.findById).not.toHaveBeenCalled()
      expect(MockProfessionalRepository.findById).not.toHaveBeenCalled()
      expect(encrypterMock.encrypt).not.toHaveBeenCalled()
    })

    it('should propagate error when encrypter fails', async () => {
      // arrange
      const refreshToken = 'valid_refresh_token'
      const userId = faker.string.uuid()
      const newRefreshToken = 'new_refresh_token'

      const customer = {
        id: userId,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        userType: UserType.CUSTOMER,
        registerCompleted: true,
        profilePhotoUrl: faker.internet.url(),
        createdAt: new Date(),
        updatedAt: new Date(),
        birthdate: new Date(),
        passwordHash: null,
        googleId: null,
        phone: null,
        discoverySource: DiscoverySource.INSTAGRAM,
        notificationPreference: NotificationChannel.ALL,
        acceptsNotifications: true,
        referrerId: null,
        referralCount: 0,
        alwaysAllowImageUse: false
      }

      const encryptError = new Error('Encryption failed')

      refreshTokenServiceMock.rotate.mockResolvedValueOnce({
        userId,
        refreshToken: newRefreshToken,
        refreshTokenId: faker.string.uuid()
      })

      MockCustomerRepository.findById.mockResolvedValueOnce(customer)
      MockProfessionalRepository.findById.mockResolvedValueOnce(null)

      encrypterMock.encrypt.mockRejectedValueOnce(encryptError)

      // act & assert
      await expect(generateTokensUseCase.execute(refreshToken))
        .rejects
        .toThrow(encryptError)

      expect(refreshTokenServiceMock.rotate).toHaveBeenCalledWith(refreshToken)
      expect(MockCustomerRepository.findById).toHaveBeenCalledWith(userId)
      expect(encrypterMock.encrypt).toHaveBeenCalled()
    })
  })
})