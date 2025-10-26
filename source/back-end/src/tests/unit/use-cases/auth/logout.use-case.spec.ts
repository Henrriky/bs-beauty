import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LogoutUseCase } from '../../../../services/use-cases/auth/logout.use-case'

describe('LogoutUseCase', () => {
  let refreshTokenServiceMock: any
  let logoutUseCase: LogoutUseCase

  beforeEach(() => {
    vi.clearAllMocks()

    refreshTokenServiceMock = {
      revokeByJwt: vi.fn()
    }

    logoutUseCase = new LogoutUseCase(refreshTokenServiceMock)
  })

  it('should be defined', () => {
    expect(LogoutUseCase).toBeDefined()
  })

  describe('execute', () => {
    it('should revoke refresh token when token is provided', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token'
      refreshTokenServiceMock.revokeByJwt.mockResolvedValueOnce(undefined)

      // Act
      const result = await logoutUseCase.execute(refreshToken)

      // Assert
      expect(refreshTokenServiceMock.revokeByJwt).toHaveBeenCalledWith(refreshToken)
      expect(result).toBe(true)
    })

    it('should not revoke token when token is null', async () => {
      // Arrange
      const refreshToken = null

      // Act
      const result = await logoutUseCase.execute(refreshToken as any)

      // Assert
      expect(refreshTokenServiceMock.revokeByJwt).not.toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('should not revoke token when token is undefined', async () => {
      // Arrange
      const refreshToken = undefined

      // Act
      const result = await logoutUseCase.execute(refreshToken as any)

      // Assert
      expect(refreshTokenServiceMock.revokeByJwt).not.toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('should not revoke token when token is empty string', async () => {
      // Arrange
      const refreshToken = ''

      // Act
      const result = await logoutUseCase.execute(refreshToken)

      // Assert
      expect(refreshTokenServiceMock.revokeByJwt).not.toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('should handle revocation errors gracefully', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token'
      const error = new Error('Revocation failed')
      refreshTokenServiceMock.revokeByJwt.mockRejectedValueOnce(error)

      // Act & Assert
      await expect(logoutUseCase.execute(refreshToken)).rejects.toThrow('Revocation failed')
      expect(refreshTokenServiceMock.revokeByJwt).toHaveBeenCalledWith(refreshToken)
    })

    it('should return true when token revocation succeeds', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token'
      refreshTokenServiceMock.revokeByJwt.mockResolvedValueOnce(undefined)

      // Act
      const result = await logoutUseCase.execute(refreshToken)

      // Assert
      expect(refreshTokenServiceMock.revokeByJwt).toHaveBeenCalledWith(refreshToken)
      expect(result).toBe(true)
    })
  })
})