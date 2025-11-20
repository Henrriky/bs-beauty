import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LogoutController } from '../../../../controllers/auth/logout.controller'
import { makeLogoutUseCase } from '../../../../factory/auth/make-logout-use-case.factory'
import { type LogoutUseCase } from '../../../../services/use-cases/auth/logout.use-case'
import { type MockRequest, mockRequest, mockResponse } from '../../utils/test-utilts'
import { createMock } from '../../utils/mocks'

vi.mock('@/factory/auth/make-logout-use-case.factory', () => ({
  makeLogoutUseCase: vi.fn()
}))

vi.mock('@/utils/cookies/refresh-cookie', () => ({
  REFRESH_COOKIE_NAME: 'refresh_token',
  getRefreshCookieOptions: vi.fn().mockReturnValue({
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/'
  })
}))

describe('LogoutController', () => {
  let req: MockRequest
  let res: Response
  let next: any
  let executeMock: ReturnType<typeof vi.fn>
  let usecaseMock: LogoutUseCase

  beforeEach(() => {
    vi.clearAllMocks()
    req = mockRequest()
    res = mockResponse()
    next = vi.fn()

    const result = createMock<LogoutUseCase>()
    usecaseMock = result.usecase
    executeMock = result.executeMock

    vi.mocked(makeLogoutUseCase).mockReturnValue(usecaseMock)
  })

  it('should be defined', () => {
    expect(LogoutController).toBeDefined()
  })

  describe('handle', () => {
    it('should logout successfully when refresh token is present', async () => {
      // arrange
      const refreshToken = 'valid-refresh-token'
      req = mockRequest({
        cookies: { refresh_token: refreshToken }
      })

      executeMock.mockResolvedValueOnce(true)

      // act
      await LogoutController.handle(req, res, next)

      // assert
      expect(makeLogoutUseCase).toHaveBeenCalled()
      expect(executeMock).toHaveBeenCalledWith(refreshToken)
      expect(res.clearCookie).toHaveBeenCalledWith('refresh_token', expect.any(Object))
      expect(res.cookie).toHaveBeenCalledWith('refresh_token', '', expect.objectContaining({
        maxAge: 0,
        expires: expect.any(Date)
      }))
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT)
      expect(res.send).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it('should logout successfully when refresh token is missing', async () => {
      // arrange
      req = mockRequest({
        cookies: {}
      })

      executeMock.mockResolvedValueOnce(true)

      // act
      await LogoutController.handle(req, res, next)

      // assert
      expect(makeLogoutUseCase).toHaveBeenCalled()
      expect(executeMock).toHaveBeenCalledWith(undefined)
      expect(res.clearCookie).toHaveBeenCalledWith('refresh_token', expect.any(Object))
      expect(res.cookie).toHaveBeenCalledWith('refresh_token', '', expect.objectContaining({
        maxAge: 0,
        expires: expect.any(Date)
      }))
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT)
      expect(res.send).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it('should logout successfully when refresh token is undefined', async () => {
      // arrange
      req = mockRequest({
        cookies: { refresh_token: undefined }
      })

      executeMock.mockResolvedValueOnce(true)

      // act
      await LogoutController.handle(req, res, next)

      // assert
      expect(makeLogoutUseCase).toHaveBeenCalled()
      expect(executeMock).toHaveBeenCalledWith(undefined)
      expect(res.clearCookie).toHaveBeenCalledWith('refresh_token', expect.any(Object))
      expect(res.cookie).toHaveBeenCalledWith('refresh_token', '', expect.objectContaining({
        maxAge: 0,
        expires: expect.any(Date)
      }))
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT)
      expect(res.send).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with error when use case throws an error', async () => {
      // arrange
      const error = new Error('Logout failed')
      req = mockRequest({
        cookies: { refresh_token: 'some-token' }
      })

      executeMock.mockRejectedValueOnce(error)

      // act
      await LogoutController.handle(req, res, next)

      // assert
      expect(makeLogoutUseCase).toHaveBeenCalled()
      expect(executeMock).toHaveBeenCalledWith('some-token')
      expect(next).toHaveBeenCalledWith(error)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
    })

    it('should call next with error when an unexpected error occurs', async () => {
      // arrange
      const error = new Error('Unexpected error')
      req = mockRequest({})

      res.clearCookie = vi.fn().mockImplementation(() => {
        throw error
      })

      executeMock.mockResolvedValueOnce(true)

      // act
      await LogoutController.handle(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(error)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
    })
  })
})
