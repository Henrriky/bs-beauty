import { describe, it, expect, vi, beforeEach } from 'vitest'
import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'
import { UserType } from '@prisma/client'

import { LoginUseCase } from '@/services/use-cases/auth/login.use-case'
import { CustomError } from '@/utils/errors/custom.error.util'
import { type Permissions } from '@/utils/auth/permissions-map.util'
import { MockCustomerRepository, MockProfessionalRepository } from '@/tests/unit/utils/mocks/repository'
import { MockEncrypter, MockOAuthIdentityProvider, MockRefreshTokenService } from '@/tests/unit/utils/mocks/services'

vi.mock('bcrypt')
const mockedBcrypt = vi.mocked(bcrypt)

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase

  beforeEach(() => {
    vi.clearAllMocks()

    loginUseCase = new LoginUseCase(
      MockCustomerRepository,
      MockProfessionalRepository,
      MockEncrypter,
      MockOAuthIdentityProvider,
      MockRefreshTokenService
    )
  })

  describe('OAuth Token Login', () => {
    it('should login customer with OAuth token when professional does not exist', async () => {
      // arrange
      const token = faker.string.uuid()
      const userId = faker.string.uuid()
      const email = faker.internet.email()
      const profilePhotoUrl = faker.internet.url()
      const accessToken = faker.string.uuid()
      const refreshToken = faker.string.uuid()
      const refreshTokenId = faker.string.uuid()

      const mockCustomer = {
        id: faker.string.uuid(),
        email,
        name: faker.person.fullName(),
        userType: UserType.CUSTOMER,
        registerCompleted: false,
        profilePhotoUrl,
        googleId: userId,
        passwordHash: null,
        phone: null,
        birthdate: null,
        referrerId: null,
        referralCount: 0,
        alwaysAllowImageUse: false,
        discoverySource: null,
        notificationPreference: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      vi.mocked(MockOAuthIdentityProvider.fetchUserInformationsFromToken).mockResolvedValue({
        userId,
        email,
        profilePhotoUrl
      })
      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValue(null)
      vi.mocked(MockCustomerRepository.updateOrCreate).mockResolvedValue(mockCustomer)
      vi.mocked(MockEncrypter.encrypt).mockResolvedValue({ accessToken })
      vi.mocked(MockRefreshTokenService.issue).mockResolvedValue({ refreshToken, refreshTokenId })

      // act
      const result = await loginUseCase.execute({ token })

      // assert
      expect(MockOAuthIdentityProvider.fetchUserInformationsFromToken).toHaveBeenCalledWith(token)
      expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(email)
      expect(MockCustomerRepository.updateOrCreate).toHaveBeenCalledWith(
        { email },
        { email, googleId: userId, profilePhotoUrl }
      )
      expect(MockEncrypter.encrypt).toHaveBeenCalledWith({
        userId,
        id: mockCustomer.id,
        userType: mockCustomer.userType,
        email: mockCustomer.email,
        name: mockCustomer.name,
        registerCompleted: mockCustomer.registerCompleted,
        profilePhotoUrl,
        permissions: []
      })
      expect(MockRefreshTokenService.issue).toHaveBeenCalledWith(mockCustomer.id)
      expect(result).toEqual({ accessToken, refreshToken })
    })

    it('should login professional with OAuth token when professional exists', async () => {
      // arrange
      const token = faker.string.uuid()
      const userId = faker.string.uuid()
      const email = faker.internet.email()
      const profilePhotoUrl = faker.internet.url()
      const accessToken = faker.string.uuid()
      const refreshToken = faker.string.uuid()
      const refreshTokenId = faker.string.uuid()
      const permissions: Permissions[] = ['customer.read']

      const mockProfessional = {
        id: faker.string.uuid(),
        email,
        name: faker.person.fullName(),
        userType: UserType.PROFESSIONAL,
        registerCompleted: true,
        profilePhotoUrl,
        googleId: userId,
        passwordHash: null,
        paymentMethods: null,
        socialMedia: null,
        contact: null,
        specialization: null,
        notificationPreference: null,
        isCommissioned: false,
        commissionRate: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      vi.mocked(MockOAuthIdentityProvider.fetchUserInformationsFromToken).mockResolvedValue({
        userId,
        email,
        profilePhotoUrl
      })
      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValue(mockProfessional)
      vi.mocked(MockProfessionalRepository.updateProfessionalByEmail).mockResolvedValue(mockProfessional)
      vi.mocked(MockProfessionalRepository.findProfessionalPermissions).mockResolvedValue(permissions)
      vi.mocked(MockEncrypter.encrypt).mockResolvedValue({ accessToken })
      vi.mocked(MockRefreshTokenService.issue).mockResolvedValue({ refreshToken, refreshTokenId })

      // act
      const result = await loginUseCase.execute({ token })

      // assert
      expect(MockOAuthIdentityProvider.fetchUserInformationsFromToken).toHaveBeenCalledWith(token)
      expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(email)
      expect(MockProfessionalRepository.updateProfessionalByEmail).toHaveBeenCalledWith(email, {
        googleId: userId,
        profilePhotoUrl
      })
      expect(MockProfessionalRepository.findProfessionalPermissions).toHaveBeenCalledWith(mockProfessional.id)
      expect(MockEncrypter.encrypt).toHaveBeenCalledWith({
        userId,
        id: mockProfessional.id,
        userType: mockProfessional.userType,
        email: mockProfessional.email,
        name: mockProfessional.name,
        registerCompleted: mockProfessional.registerCompleted,
        profilePhotoUrl,
        permissions
      })
      expect(MockRefreshTokenService.issue).toHaveBeenCalledWith(mockProfessional.id)
      expect(result).toEqual({ accessToken, refreshToken })
    })
  })

  describe('Email/Password Login', () => {
    it('should login customer with valid email and password', async () => {
      // arrange
      const email = faker.internet.email()
      const password = faker.internet.password()
      const passwordHash = faker.string.alphanumeric(60)
      const accessToken = faker.string.uuid()
      const refreshToken = faker.string.uuid()
      const refreshTokenId = faker.string.uuid()

      const mockCustomer = {
        id: faker.string.uuid(),
        email,
        name: faker.person.fullName(),
        userType: UserType.CUSTOMER,
        registerCompleted: false,
        profilePhotoUrl: faker.internet.url(),
        passwordHash,
        googleId: null,
        phone: null,
        birthdate: null,
        referrerId: null,
        referralCount: 0,
        alwaysAllowImageUse: false,
        discoverySource: null,
        notificationPreference: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      vi.mocked(MockCustomerRepository.findByEmail).mockResolvedValue(mockCustomer)
      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValue(null)
      mockedBcrypt.compare.mockResolvedValue(true as never)
      vi.mocked(MockEncrypter.encrypt).mockResolvedValue({ accessToken })
      vi.mocked(MockRefreshTokenService.issue).mockResolvedValue({ refreshToken, refreshTokenId })

      // act
      const result = await loginUseCase.execute({ email, password })

      // assert
      expect(MockCustomerRepository.findByEmail).toHaveBeenCalledWith(email)
      expect(bcrypt.compare).toHaveBeenCalledWith(password, passwordHash)
      expect(MockEncrypter.encrypt).toHaveBeenCalledWith({
        userId: mockCustomer.id,
        id: mockCustomer.id,
        userType: mockCustomer.userType,
        email: mockCustomer.email,
        name: mockCustomer.name,
        registerCompleted: mockCustomer.registerCompleted,
        profilePhotoUrl: mockCustomer.profilePhotoUrl,
        permissions: []
      })
      expect(MockRefreshTokenService.issue).toHaveBeenCalledWith(mockCustomer.id)
      expect(result).toEqual({ accessToken, refreshToken })
    })

    it('should login professional with valid email and password', async () => {
      // arrange
      const email = faker.internet.email()
      const password = faker.internet.password()
      const passwordHash = faker.string.alphanumeric(60)
      const accessToken = faker.string.uuid()
      const refreshToken = faker.string.uuid()
      const refreshTokenId = faker.string.uuid()
      const permissions: Permissions[] = ['customer.read', 'service.create']

      const mockProfessional = {
        id: faker.string.uuid(),
        email,
        name: faker.person.fullName(),
        userType: UserType.PROFESSIONAL,
        registerCompleted: true,
        profilePhotoUrl: faker.internet.url(),
        passwordHash,
        googleId: null,
        paymentMethods: null,
        socialMedia: null,
        contact: null,
        specialization: null,
        notificationPreference: null,
        isCommissioned: false,
        commissionRate: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      vi.mocked(MockCustomerRepository.findByEmail).mockResolvedValue(null)
      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValue(mockProfessional)
      vi.mocked(MockProfessionalRepository.findProfessionalPermissions).mockResolvedValue(permissions)
      mockedBcrypt.compare.mockResolvedValue(true as never)
      vi.mocked(MockEncrypter.encrypt).mockResolvedValue({ accessToken })
      vi.mocked(MockRefreshTokenService.issue).mockResolvedValue({ refreshToken, refreshTokenId })

      // act
      const result = await loginUseCase.execute({ email, password })

      // assert
      expect(MockCustomerRepository.findByEmail).toHaveBeenCalledWith(email)
      expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(email)
      expect(MockProfessionalRepository.findProfessionalPermissions).toHaveBeenCalledWith(mockProfessional.id)
      expect(bcrypt.compare).toHaveBeenCalledWith(password, passwordHash)
      expect(MockEncrypter.encrypt).toHaveBeenCalledWith({
        userId: mockProfessional.id,
        id: mockProfessional.id,
        userType: mockProfessional.userType,
        email: mockProfessional.email,
        name: mockProfessional.name,
        registerCompleted: mockProfessional.registerCompleted,
        profilePhotoUrl: mockProfessional.profilePhotoUrl,
        permissions
      })
      expect(MockRefreshTokenService.issue).toHaveBeenCalledWith(mockProfessional.id)
      expect(result).toEqual({ accessToken, refreshToken })
    })

    it('should throw CustomError when user is not found', async () => {
      // arrange
      const email = faker.internet.email()
      const password = faker.internet.password()

      vi.mocked(MockCustomerRepository.findByEmail).mockResolvedValue(null)
      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValue(null)

      // act & assert
      await expect(loginUseCase.execute({ email, password }))
        .rejects
        .toThrow(new CustomError('Bad Request', 400, 'Invalid credentials'))

      expect(MockCustomerRepository.findByEmail).toHaveBeenCalledWith(email)
      expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(email)
    })
  })

  describe('Error Cases', () => {
    it('should throw Error when no credentials are provided', async () => {
      // arrange & act & assert
      await expect(loginUseCase.execute({}))
        .rejects
        .toThrow('Invalid credentials')
    })
  })

  describe('Token Generation', () => {
    it('should handle user without profilePhotoUrl in token generation', async () => {
      // arrange
      const email = faker.internet.email()
      const password = faker.internet.password()
      const passwordHash = faker.string.alphanumeric(60)
      const accessToken = faker.string.uuid()
      const refreshToken = faker.string.uuid()
      const refreshTokenId = faker.string.uuid()

      const mockCustomer = {
        id: faker.string.uuid(),
        email,
        name: faker.person.fullName(),
        userType: UserType.CUSTOMER,
        registerCompleted: false,
        profilePhotoUrl: null,
        passwordHash,
        googleId: null,
        phone: null,
        birthdate: null,
        referrerId: null,
        referralCount: 0,
        alwaysAllowImageUse: false,
        discoverySource: null,
        notificationPreference: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      vi.mocked(MockCustomerRepository.findByEmail).mockResolvedValue(mockCustomer)
      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValue(null)
      mockedBcrypt.compare.mockResolvedValue(true as never)
      vi.mocked(MockEncrypter.encrypt).mockResolvedValue({ accessToken })
      vi.mocked(MockRefreshTokenService.issue).mockResolvedValue({ refreshToken, refreshTokenId })

      // act
      const result = await loginUseCase.execute({ email, password })

      // assert
      expect(MockEncrypter.encrypt).toHaveBeenCalledWith({
        userId: mockCustomer.id,
        id: mockCustomer.id,
        userType: mockCustomer.userType,
        email: mockCustomer.email,
        name: mockCustomer.name,
        registerCompleted: mockCustomer.registerCompleted,
        profilePhotoUrl: '',
        permissions: []
      })
      expect(result).toEqual({ accessToken, refreshToken })
    })

    it('should use external userId when provided in OAuth flow', async () => {
      // arrange
      const token = faker.string.uuid()
      const userId = faker.string.uuid()
      const email = faker.internet.email()
      const profilePhotoUrl = faker.internet.url()
      const accessToken = faker.string.uuid()
      const refreshToken = faker.string.uuid()
      const refreshTokenId = faker.string.uuid()

      const mockCustomer = {
        id: faker.string.uuid(),
        email,
        name: faker.person.fullName(),
        userType: UserType.CUSTOMER,
        registerCompleted: false,
        profilePhotoUrl,
        googleId: userId,
        passwordHash: null,
        phone: null,
        birthdate: null,
        referrerId: null,
        referralCount: 0,
        alwaysAllowImageUse: false,
        discoverySource: null,
        notificationPreference: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      vi.mocked(MockOAuthIdentityProvider.fetchUserInformationsFromToken).mockResolvedValue({
        userId,
        email,
        profilePhotoUrl
      })
      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValue(null)
      vi.mocked(MockCustomerRepository.updateOrCreate).mockResolvedValue(mockCustomer)
      vi.mocked(MockEncrypter.encrypt).mockResolvedValue({ accessToken })
      vi.mocked(MockRefreshTokenService.issue).mockResolvedValue({ refreshToken, refreshTokenId })

      // act
      await loginUseCase.execute({ token })

      // assert
      expect(MockEncrypter.encrypt).toHaveBeenCalledWith({
        userId, // Should use external userId from OAuth
        id: mockCustomer.id,
        userType: mockCustomer.userType,
        email: mockCustomer.email,
        name: mockCustomer.name,
        registerCompleted: mockCustomer.registerCompleted,
        profilePhotoUrl,
        permissions: []
      })
    })
  })
})
