import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GenerateTokensController } from '../../../../controllers/auth/generate-tokens.controller'
import { makeGenerateTokensUseCase } from '../../../../factory/auth/make-generate-tokens.use-case.factory'
import { type GenerateTokensUseCase } from '../../../../services/use-cases/auth/generate-tokens.use-case'
import { type MockRequest, mockRequest, mockResponse } from '../../utils/test-utilts'
import { createMock } from '../../utils/mocks'
import { setRefreshCookie } from '@/utils/cookies/refresh-cookie'

vi.mock('@/factory/auth/make-generate-tokens.use-case.factory', () => ({
  makeGenerateTokensUseCase: vi.fn()
}))

vi.mock('@/utils/cookies/refresh-cookie', () => ({
  setRefreshCookie: vi.fn(),
  REFRESH_COOKIE_NAME: 'refresh_token'
}))

describe('GenerateTokensController', () => {
  let req: MockRequest
  let res: Response
  let next: any
  let executeMock: ReturnType<typeof vi.fn>
  let usecaseMock: GenerateTokensUseCase

  beforeEach(() => {
    vi.clearAllMocks()
    req = mockRequest()
    res = mockResponse()
    next = vi.fn()

    const result = createMock<GenerateTokensUseCase>()
    usecaseMock = result.usecase
    executeMock = result.executeMock

    vi.mocked(makeGenerateTokensUseCase).mockReturnValue(usecaseMock)
  })

  it('should be defined', () => {
    expect(GenerateTokensController).toBeDefined()
  })

  describe('handle', () => {
    it('should return 401 if refresh token is missing', async () => {
      // arrange
      req = mockRequest({
        cookies: {} // sem refresh token
      })

      // act
      await GenerateTokensController.handle(req, res, next)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
      expect(res.send).toHaveBeenCalledWith({ message: 'Missing refresh token' })
      expect(usecaseMock.execute).not.toHaveBeenCalled()
    })

    it('should return 401 if refresh token is undefined', async () => {
      // arrange
      req = mockRequest({
        cookies: { refresh_token: undefined }
      })

      // act
      await GenerateTokensController.handle(req, res, next)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
      expect(res.send).toHaveBeenCalledWith({ message: 'Missing refresh token' })
      expect(usecaseMock.execute).not.toHaveBeenCalled()
    })

    it('should return 200 with new tokens when refresh is successful', async () => {
      // arrange
      const refreshToken = 'valid_refresh_token'
      req = mockRequest({
        cookies: { refresh_token: refreshToken }
      })

      const tokensResponse = {
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token'
      }

      executeMock.mockResolvedValueOnce(tokensResponse)

      // act
      await GenerateTokensController.handle(req, res, next)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith({
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token'
      })
      expect(usecaseMock.execute).toHaveBeenCalledWith(refreshToken)
      expect(setRefreshCookie).toHaveBeenCalledWith(res, 'new_refresh_token', 30 * 24 * 60 * 60 * 1000)
    })

    it('should return 401 with appropriate message when refresh token is reused or revoked', async () => {
      // arrange
      const refreshToken = 'reused_refresh_token'
      req = mockRequest({
        cookies: { refresh_token: refreshToken }
      })

      const error = new Error('REUSED_OR_REVOKED')
      executeMock.mockRejectedValueOnce(error)

      // act
      await GenerateTokensController.handle(req, res, next)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
      expect(res.send).toHaveBeenCalledWith({ message: 'Refresh token reused or revoked' })
      expect(usecaseMock.execute).toHaveBeenCalledWith(refreshToken)
      expect(setRefreshCookie).not.toHaveBeenCalled()
    })

    it('should return 401 with appropriate message when refresh token is invalid or expired', async () => {
      // arrange
      const refreshToken = 'invalid_refresh_token'
      req = mockRequest({
        cookies: { refresh_token: refreshToken }
      })

      const error = new Error('INVALID_OR_EXPIRED')
      executeMock.mockRejectedValueOnce(error)

      // act
      await GenerateTokensController.handle(req, res, next)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
      expect(res.send).toHaveBeenCalledWith({ message: 'Invalid refresh token' })
      expect(usecaseMock.execute).toHaveBeenCalledWith(refreshToken)
      expect(setRefreshCookie).not.toHaveBeenCalled()
    })

    it('should return 401 with "Invalid refresh token" message for any other error', async () => {
      // arrange
      const refreshToken = 'problematic_refresh_token'
      req = mockRequest({
        cookies: { refresh_token: refreshToken }
      })

      const error = new Error('SOME_OTHER_ERROR')
      executeMock.mockRejectedValueOnce(error)

      // act
      await GenerateTokensController.handle(req, res, next)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
      expect(res.send).toHaveBeenCalledWith({ message: 'Invalid refresh token' })
      expect(usecaseMock.execute).toHaveBeenCalledWith(refreshToken)
      expect(setRefreshCookie).not.toHaveBeenCalled()
    })
  })
})
