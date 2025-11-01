import { StatusCodes } from 'http-status-codes'
import { GenerateOAuthRedirectUriUseCase } from '../../../../services/use-cases/auth/generate-oauth-redirect-uri.use-case'
import { GenerateGoogleRedirectUriController } from '../../../../controllers/auth/generate-google-redirect-uri.controller'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { type MockRequest, mockRequest, mockResponse } from '../../utils/test-utilts'
import { type Response } from 'express'
import { createMock } from '../../utils/mocks'

vi.mock('@/services/use-cases/auth/generate-oauth-redirect-uri.use-case')

describe('GenerateGoogleRedirectUriController', () => {
  let req: MockRequest
  let res: Response
  let executeMock: ReturnType<typeof vi.fn>
  let usecaseMock: GenerateOAuthRedirectUriUseCase

  beforeEach(() => {
    vi.clearAllMocks()

    req = mockRequest()
    res = mockResponse()

    const result = createMock<GenerateOAuthRedirectUriUseCase>()
    usecaseMock = result.usecase
    executeMock = result.executeMock

    vi.mocked(GenerateOAuthRedirectUriUseCase).mockImplementation(() => usecaseMock)
  })

  it('should be defined', () => {
    expect(GenerateGoogleRedirectUriController).toBeDefined()
  })

  describe('handle', () => {
    it('should return 200 and the authorization URL if the use case succeeds', async () => {
      // arrange
      executeMock.mockReturnValueOnce({ authorizationUrl: 'http://example.com/auth' })

      // act
      await GenerateGoogleRedirectUriController.handle(req, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith({ authorizationUrl: 'http://example.com/auth' })
      expect(usecaseMock.execute).toHaveBeenCalledTimes(1)
    })

    it('should return 500 if the use case throws an error', async () => {
      // arrange
      executeMock.mockImplementationOnce(() => {
        throw new Error('Use case failure')
      })

      // act
      await GenerateGoogleRedirectUriController.handle(req, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(res.send).toHaveBeenCalledWith({
        message: 'Error trying to generate google redirect uri, please check back-end logs...'
      })
    })
  })
})
