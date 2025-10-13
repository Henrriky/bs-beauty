import { StatusCodes } from 'http-status-codes'
import { ExchangeCodeByTokenUseCase } from '../../../../services/use-cases/auth/exchange-code-by-token.use-case'
import { ExchangeCodeByTokenController } from '../../../../controllers/auth/exchange-code-by-token.controller'
import { type Response } from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockRequest, type MockRequest, mockResponse } from '../../utils/test-utilts'
import { createMock } from '../../utils/mocks'

vi.mock('../@/services/use-cases/auth/exchange-code-by-token.use-case')
vi.mock('../../../services/identity-providers/google-oauth-identity-provider.service')

describe('ExchangeCodeByTokenController', () => {
  let req: MockRequest
  let res: Response
  let executeMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()

    req = mockRequest()

    res = mockResponse()

    const result = createMock<ExchangeCodeByTokenUseCase>()
    executeMock = result.executeMock

    vi.spyOn(ExchangeCodeByTokenUseCase.prototype, 'execute')
      .mockImplementation(executeMock)
  })

  it('should be defined', () => {
    expect(ExchangeCodeByTokenController).toBeDefined()
  })

  describe('handle', () => {
    it('should return 200 and the access token if the use case succeeds', async () => {
      // arrange
      req.body = { code: 'valid_code' }
      executeMock.mockResolvedValueOnce({ accessToken: 'fake_access_token' })

      // act
      await ExchangeCodeByTokenController.handle(req, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith({ accessToken: 'fake_access_token' })
      expect(executeMock).toHaveBeenCalledWith({ code: 'valid_code' })
    })

    it('should return 400 if the body validation fails', async () => {
      // arrange
      req.body = { invalidKey: 'value' }

      // act
      await ExchangeCodeByTokenController.handle(req, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Validation Error',
        errors: expect.any(Array)
      }))
      expect(executeMock).not.toHaveBeenCalled()
    })

    it('should return 500 if the use case throws an error', async () => {
      // arrange
      req.body = { code: 'valid_code' }
      executeMock.mockRejectedValueOnce(new Error('Use case failure'))

      // act
      await ExchangeCodeByTokenController.handle(req, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(res.send).toHaveBeenCalledWith({
        message: 'Error trying to exchange code by token, please check back-end logs...'
      })
    })
  })
})
