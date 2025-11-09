/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { JwtEncrypterService } from '../../../../services/encrypter/jwt-encrypter.service'
import { UserType } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { ENV } from '../../../../config/env'

vi.mock('jsonwebtoken')
vi.mock('@/config/env', () => ({
  ENV: {
    JWT_SECRET: 'test-secret-key',
    JWT_EXPIRES_IN: '1h'
  }
}))

describe('JwtEncrypterService (Unit Tests)', () => {
  let jwtEncrypterService: JwtEncrypterService

  beforeEach(() => {
    vi.clearAllMocks()
    jwtEncrypterService = new JwtEncrypterService()
  })

  describe('encrypt', () => {
    it('should generate a valid access token with correct payload', async () => {
      // arrange
      const mockPayload = {
        id: 'user-123',
        userId: 'user-123',
        userType: UserType.CUSTOMER,
        email: 'test@example.com',
        name: 'Test User',
        registerCompleted: true,
        profilePhotoUrl: 'https://example.com/photo.jpg',
        permissions: []
      } as any

      const mockToken = 'mock.jwt.token'

      vi.mocked(jwt.sign).mockReturnValue(mockToken as any)

      // act
      const result = await jwtEncrypterService.encrypt(mockPayload)

      // assert
      expect(jwt.sign).toHaveBeenCalledTimes(1)
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockPayload.id,
          sub: mockPayload.userId,
          userId: mockPayload.id,
          userType: mockPayload.userType,
          email: mockPayload.email,
          name: mockPayload.name,
          registerCompleted: mockPayload.registerCompleted,
          profilePhotoUrl: mockPayload.profilePhotoUrl,
          permissions: mockPayload.permissions
        },
        ENV.JWT_SECRET,
        {
          expiresIn: ENV.JWT_EXPIRES_IN
        }
      )
      expect(result).toEqual({ accessToken: mockToken })
    })

    it('should generate token for professional user', async () => {
      // arrange
      const mockPayload = {
        id: 'professional-456',
        userId: 'professional-456',
        userType: UserType.PROFESSIONAL,
        email: 'professional@example.com',
        name: 'Professional User',
        registerCompleted: true,
        profilePhotoUrl: 'https://example.com/pro-photo.jpg',
        permissions: []
      } as any

      const mockToken = 'professional.jwt.token'

      vi.mocked(jwt.sign).mockReturnValue(mockToken as any)

      // act
      const result = await jwtEncrypterService.encrypt(mockPayload)

      // assert
      expect(jwt.sign).toHaveBeenCalledTimes(1)
      expect(result).toEqual({ accessToken: mockToken })
    })

    it('should throw error if JWT_SECRET is undefined', async () => {
      // arrange
      const mockPayload = {
        id: 'user-123',
        userId: 'user-123',
        userType: UserType.CUSTOMER,
        email: 'test@example.com',
        name: 'Test User',
        registerCompleted: true,
        profilePhotoUrl: 'https://example.com/photo.jpg',
        permissions: []
      } as any

      // Mock ENV to return undefined secret
      vi.mocked(ENV).JWT_SECRET = undefined as any

      // act & assert
      await expect(jwtEncrypterService.encrypt(mockPayload)).rejects.toThrow('JWT_SECRET está indefinido')

      // restore
      vi.mocked(ENV).JWT_SECRET = 'test-secret-key'
    })

    it('should handle empty permissions array', async () => {
      // arrange
      const mockPayload = {
        id: 'user-789',
        userId: 'user-789',
        userType: UserType.CUSTOMER,
        email: 'newuser@example.com',
        name: 'New User',
        registerCompleted: false,
        profilePhotoUrl: '',
        permissions: []
      } as any

      const mockToken = 'new.user.token'

      vi.mocked(jwt.sign).mockReturnValue(mockToken as any)

      // act
      const result = await jwtEncrypterService.encrypt(mockPayload)

      // assert
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          permissions: []
        }),
        ENV.JWT_SECRET,
        expect.any(Object)
      )
      expect(result).toEqual({ accessToken: mockToken })
    })

    it('should handle manager user type', async () => {
      // arrange
      const mockPayload = {
        id: 'manager-999',
        userId: 'manager-999',
        userType: UserType.MANAGER,
        email: 'manager@example.com',
        name: 'Manager User',
        registerCompleted: true,
        profilePhotoUrl: 'https://example.com/manager.jpg',
        permissions: []
      } as any

      const mockToken = 'manager.jwt.token'

      vi.mocked(jwt.sign).mockReturnValue(mockToken as any)

      // act
      const result = await jwtEncrypterService.encrypt(mockPayload)

      // assert
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          userType: UserType.MANAGER
        }),
        ENV.JWT_SECRET,
        expect.any(Object)
      )
      expect(result).toEqual({ accessToken: mockToken })
    })
  })
})
