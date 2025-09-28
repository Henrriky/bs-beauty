import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LoginController } from '../../../../controllers/auth/login.controller'
import { makeLoginUseCase } from '../../../../factory/make-login-use-case.factory'
import { type LoginUseCase } from '../../../../services/use-cases/auth/login.use-case'
import { type MockRequest, mockRequest, mockResponse } from '../../utils/test-utilts'
import { createMock } from '../../utils/mocks'
import { setRefreshCookie } from '@/utils/cookies/refresh-cookie'

vi.mock('@/factory/make-login-use-case.factory', () => ({
  makeLoginUseCase: vi.fn()
}))

vi.mock('@/utils/cookies/refresh-cookie', () => ({
  setRefreshCookie: vi.fn(),
}))

describe('LoginController', () => {
  let req: MockRequest
  let res: Response
  let next: any
  let executeMock: ReturnType<typeof vi.fn>
  let usecaseMock: LoginUseCase

  beforeEach(() => {
    vi.clearAllMocks()
    req = mockRequest()
    res = mockResponse()
    next = vi.fn()

    const result = createMock<LoginUseCase>()
    usecaseMock = result.usecase
    executeMock = result.executeMock

    vi.mocked(makeLoginUseCase).mockReturnValue(usecaseMock)
  })

  it('should be defined', () => {
    expect(LoginController).toBeDefined()
  })

  describe('handle', () => {
    it('should return 400 if no authorization header and invalid body (missing email/password)', async () => {
      // arrange: sem Authorization e body vazio/ inválido
      req = mockRequest({ body: {} })

      // act
      await LoginController.handle(req, res, next)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
      expect(res.send).toHaveBeenCalledWith({ message: 'Email and password are required for login' })
      expect(usecaseMock.execute).not.toHaveBeenCalled()
    })

    it('should return 200 with tokens when Google login succeeds', async () => {
      // arrange
      req = mockRequest({ headers: { authorization: 'Bearer valid_token' } })
      executeMock.mockResolvedValueOnce({
        accessToken: 'fake_access_token',
        refreshToken: 'fake_refresh_token',
      })

      // act
      await LoginController.handle(req, res, next)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith({
        accessToken: 'fake_access_token',
        refreshToken: 'fake_refresh_token',
      })
      expect(usecaseMock.execute).toHaveBeenCalledWith({ token: 'valid_token' })
      expect(setRefreshCookie).toHaveBeenCalledWith(res, 'fake_refresh_token', expect.any(Number))
    })

    it('should return 200 with tokens when email/password login succeeds', async () => {
      // arrange
      req = mockRequest({
        body: { email: 'user@example.com', password: 'secret' },
      })
      executeMock.mockResolvedValueOnce({
        accessToken: 'email_access_token',
        refreshToken: 'email_refresh_token',
      })

      // act
      await LoginController.handle(req, res, next)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith({
        accessToken: 'email_access_token',
        refreshToken: 'email_refresh_token',
      })
      expect(usecaseMock.execute).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'secret',
      })
      expect(setRefreshCookie).toHaveBeenCalledWith(res, 'email_refresh_token', expect.any(Number))
    })

    it('should call next(error) if the login use case throws an error (Google path)', async () => {
      // arrange
      req = mockRequest({ headers: { authorization: 'Bearer valid_token' } })
      const err = new Error('Use case failure')
      executeMock.mockRejectedValueOnce(err)

      // act
      await LoginController.handle(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(err)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
    })
  })
})
