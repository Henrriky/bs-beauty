/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RefreshTokenService } from '../../../../services/encrypter/refresh-token.service'
import { type Cache } from '../../../../services/protocols/cache.protocol'
import jwt from 'jsonwebtoken'
import { ENV } from '../../../../config/env'

vi.mock('jsonwebtoken')
vi.mock('@/config/env', () => ({
  ENV: {
    JWT_SECRET: 'test-secret-key',
    JWT_REFRESH_EXPIRES_IN: '7d'
  }
}))

describe('RefreshTokenService (Unit Tests)', () => {
  let refreshTokenService: RefreshTokenService
  let cacheMock: Cache

  beforeEach(() => {
    vi.clearAllMocks()

    cacheMock = {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
      incr: vi.fn(),
      ttl: vi.fn(),
      withLock: vi.fn()
    }

    refreshTokenService = new RefreshTokenService(cacheMock)
  })

  describe('issue', () => {
    it('should issue a new refresh token successfully', async () => {
      // arrange
      const userId = 'user-123'
      const mockRefreshToken = 'refresh.token.jwt'
      const mockJti = 'refresh-token-id'
      const mockExp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 days

      vi.mocked(jwt.sign).mockReturnValue(mockRefreshToken as any)
      vi.mocked(jwt.decode).mockReturnValue({ sub: userId, jti: mockJti, exp: mockExp } as any)
      vi.mocked(cacheMock.get).mockResolvedValue([])

      // act
      const result = await refreshTokenService.issue(userId)

      // assert
      expect(jwt.sign).toHaveBeenCalledTimes(1)
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ sub: userId }),
        ENV.JWT_SECRET,
        { expiresIn: ENV.JWT_REFRESH_EXPIRES_IN }
      )
      expect(cacheMock.set).toHaveBeenCalledTimes(2)
      expect(result).toEqual({
        refreshToken: mockRefreshToken,
        refreshTokenId: expect.any(String)
      })
    })

    it('should store refresh token in cache with correct TTL', async () => {
      // arrange
      const userId = 'user-456'
      const mockExp = Math.floor(Date.now() / 1000) + 3600 // 1 hour
      const mockJti = 'jti-123'

      vi.mocked(jwt.sign).mockReturnValue('token' as any)
      vi.mocked(jwt.decode).mockReturnValue({ exp: mockExp, jti: mockJti } as any)
      vi.mocked(cacheMock.get).mockResolvedValue(null)

      // act
      await refreshTokenService.issue(userId)

      // assert
      expect(cacheMock.set).toHaveBeenCalledWith(
        expect.stringContaining('refresh-token:'),
        expect.objectContaining({
          userId,
          status: 'active'
        }),
        expect.objectContaining({
          timeToLiveSeconds: expect.any(Number)
        })
      )
    })

    it('should add refresh token to user refresh tokens list', async () => {
      // arrange
      const userId = 'user-789'
      const existingTokens = ['old-token-1', 'old-token-2']
      const mockExp = Math.floor(Date.now() / 1000) + 3600

      vi.mocked(jwt.sign).mockReturnValue('new-token' as any)
      vi.mocked(jwt.decode).mockReturnValue({ exp: mockExp, jti: 'new-jti' } as any)
      vi.mocked(cacheMock.get).mockResolvedValue(existingTokens)

      // act
      await refreshTokenService.issue(userId)

      // assert
      expect(cacheMock.set).toHaveBeenCalledWith(
        `user:${userId}:refresh-tokens`,
        expect.arrayContaining([...existingTokens, expect.any(String)]),
        expect.any(Object)
      )
    })
  })

  describe('rotate', () => {
    it('should rotate a valid refresh token successfully', async () => {
      // arrange
      const userId = 'user-123'
      const oldTokenId = 'old-token-id'
      const incomingToken = 'old.refresh.token'
      const mockExp = Math.floor(Date.now() / 1000) + 3600

      vi.mocked(jwt.verify).mockReturnValue({ sub: userId, jti: oldTokenId } as any)
      vi.mocked(jwt.sign).mockReturnValue('new.refresh.token' as any)
      vi.mocked(jwt.decode).mockReturnValue({ exp: mockExp, jti: 'new-jti' } as any)
      vi.mocked(cacheMock.get)
        .mockResolvedValueOnce({ userId, status: 'active' }) // First call for current token
        .mockResolvedValueOnce([]) // Second call for user tokens list

      // act
      const result = await refreshTokenService.rotate(incomingToken)

      // assert
      expect(jwt.verify).toHaveBeenCalledWith(incomingToken, ENV.JWT_SECRET)
      expect(cacheMock.set).toHaveBeenCalledWith(
        `refresh-token:${oldTokenId}`,
        expect.objectContaining({ status: 'revoked' })
      )
      expect(result).toEqual({
        userId,
        refreshToken: expect.any(String),
        refreshTokenId: expect.any(String)
      })
    })

    it('should throw error if token is invalid or expired', async () => {
      // arrange
      const incomingToken = 'invalid.token'
      vi.mocked(jwt.verify).mockImplementation(() => {
        throw new Error('Invalid token')
      })

      // act & assert
      await expect(refreshTokenService.rotate(incomingToken)).rejects.toThrow('INVALID_OR_EXPIRED')
    })

    it('should revoke all tokens if refresh token was reused', async () => {
      // arrange
      const userId = 'user-123'
      const oldTokenId = 'reused-token-id'
      const incomingToken = 'reused.token'

      vi.mocked(jwt.verify).mockReturnValue({ sub: userId, jti: oldTokenId } as any)
      vi.mocked(cacheMock.get).mockResolvedValueOnce(null) // Token not found = reused

      const revokeAllSpy = vi.spyOn(refreshTokenService, 'revokeAll').mockResolvedValue()

      // act & assert
      await expect(refreshTokenService.rotate(incomingToken)).rejects.toThrow('REUSED_OR_REVOKED')
      expect(revokeAllSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw error if token status is revoked', async () => {
      // arrange
      const userId = 'user-123'
      const tokenId = 'revoked-token'
      const incomingToken = 'revoked.token'

      vi.mocked(jwt.verify).mockReturnValue({ sub: userId, jti: tokenId } as any)
      vi.mocked(cacheMock.get).mockResolvedValueOnce({ userId, status: 'revoked' })

      const revokeAllSpy = vi.spyOn(refreshTokenService, 'revokeAll').mockResolvedValue()

      // act & assert
      await expect(refreshTokenService.rotate(incomingToken)).rejects.toThrow('REUSED_OR_REVOKED')
      expect(revokeAllSpy).toHaveBeenCalledWith(userId)
    })
  })

  describe('revokeByJwt', () => {
    it('should revoke a valid refresh token', async () => {
      // arrange
      const tokenId = 'token-to-revoke'
      const incomingToken = 'valid.token.jwt'

      vi.mocked(jwt.verify).mockReturnValue({ jti: tokenId } as any)
      vi.mocked(cacheMock.get).mockResolvedValue({ userId: 'user-123', status: 'active' })

      const revokeOneSpy = vi.spyOn(refreshTokenService, 'revokeOne').mockResolvedValue()

      // act
      await refreshTokenService.revokeByJwt(incomingToken)

      // assert
      expect(jwt.verify).toHaveBeenCalledWith(incomingToken, ENV.JWT_SECRET)
      expect(revokeOneSpy).toHaveBeenCalledWith(tokenId)
    })

    it('should handle invalid token by decoding', async () => {
      // arrange
      const tokenId = 'token-id'
      const incomingToken = 'expired.token.jwt'

      vi.mocked(jwt.verify).mockImplementation(() => {
        throw new Error('Token expired')
      })
      vi.mocked(jwt.decode).mockReturnValue({ jti: tokenId } as any)

      const revokeOneSpy = vi.spyOn(refreshTokenService, 'revokeOne').mockResolvedValue()

      // act
      await refreshTokenService.revokeByJwt(incomingToken)

      // assert
      expect(jwt.decode).toHaveBeenCalledWith(incomingToken)
      expect(revokeOneSpy).toHaveBeenCalledWith(tokenId)
    })

    it('should do nothing if token has no jti', async () => {
      // arrange
      const incomingToken = 'token.without.jti'

      vi.mocked(jwt.verify).mockReturnValue({} as any)

      const revokeOneSpy = vi.spyOn(refreshTokenService, 'revokeOne').mockResolvedValue()

      // act
      await refreshTokenService.revokeByJwt(incomingToken)

      // assert
      expect(revokeOneSpy).not.toHaveBeenCalled()
    })
  })

  describe('revokeOne', () => {
    it('should revoke a single refresh token', async () => {
      // arrange
      const refreshTokenId = 'token-123'
      const userId = 'user-456'
      const userTokensList = ['token-123', 'token-456', 'token-789']

      vi.mocked(cacheMock.get)
        .mockResolvedValueOnce({ userId, status: 'active' })
        .mockResolvedValueOnce(userTokensList)

      // act
      await refreshTokenService.revokeOne(refreshTokenId)

      // assert
      expect(cacheMock.set).toHaveBeenCalledWith(
        `refresh-token:${refreshTokenId}`,
        expect.objectContaining({ status: 'revoked' })
      )
      expect(cacheMock.set).toHaveBeenCalledWith(
        `user:${userId}:refresh-tokens`,
        expect.not.arrayContaining([refreshTokenId])
      )
    })

    it('should do nothing if token entry does not exist', async () => {
      // arrange
      const refreshTokenId = 'non-existent-token'
      vi.mocked(cacheMock.get).mockResolvedValue(null)

      // act
      await refreshTokenService.revokeOne(refreshTokenId)

      // assert
      expect(cacheMock.set).not.toHaveBeenCalled()
    })
  })

  describe('revokeAll', () => {
    it('should revoke all refresh tokens for a user', async () => {
      // arrange
      const userId = 'user-123'
      const tokensList = ['token-1', 'token-2', 'token-3']

      vi.mocked(cacheMock.get)
        .mockResolvedValueOnce(tokensList)
        .mockResolvedValueOnce({ userId, status: 'active' })
        .mockResolvedValueOnce({ userId, status: 'active' })
        .mockResolvedValueOnce({ userId, status: 'active' })

      // act
      await refreshTokenService.revokeAll(userId)

      // assert
      expect(cacheMock.set).toHaveBeenCalledTimes(3) // Revoke each token
      expect(cacheMock.delete).toHaveBeenCalledWith(`user:${userId}:refresh-tokens`)
    })

    it('should handle empty tokens list', async () => {
      // arrange
      const userId = 'user-456'
      vi.mocked(cacheMock.get).mockResolvedValue([])

      // act
      await refreshTokenService.revokeAll(userId)

      // assert
      expect(cacheMock.delete).toHaveBeenCalledWith(`user:${userId}:refresh-tokens`)
    })

    it('should skip tokens that do not exist in cache', async () => {
      // arrange
      const userId = 'user-789'
      const tokensList = ['token-1', 'token-2']

      vi.mocked(cacheMock.get)
        .mockResolvedValueOnce(tokensList)
        .mockResolvedValueOnce({ userId, status: 'active' })
        .mockResolvedValueOnce(null) // Token-2 doesn't exist

      // act
      await refreshTokenService.revokeAll(userId)

      // assert
      expect(cacheMock.set).toHaveBeenCalledTimes(1) // Only revoke token-1
      expect(cacheMock.delete).toHaveBeenCalledWith(`user:${userId}:refresh-tokens`)
    })
  })
})
