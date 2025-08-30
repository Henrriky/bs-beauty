import { StatusCodes } from 'http-status-codes'
import { FetchUserInfoController } from '../../../../src/controllers/auth/fetch-user-info.controller'
import { makeFetchUserInfoUseCase } from '../../../../src/factory/auth/make-fetch-user-info.use-case.factory.ts'
import { InvalidUserTypeUseCaseError } from '../../../../src/services/use-cases/errors/invalid-user-type-use-case-error'
import { NotFoundUseCaseError } from '../../../../src/services/use-cases/errors/not-found-error'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Request, Response } from 'express'
import { MockRequest, mockRequest, mockResponse } from '../../utils/test-utilts.ts'
import { FetchUserInfoUseCase } from '../../../../src/services/use-cases/auth/fetch-user-info.use-case.ts'
import { createMock } from '../../utils/mocks.ts'

vi.mock('../../../../src/factory/auth/make-fetch-user-info.use-case.factory.ts')

describe('FetchUserInfoController', () => {
  let req: MockRequest
  let res: Response
  let executeMock: ReturnType<typeof vi.fn>;
  let usecaseMock: FetchUserInfoUseCase;;

  beforeEach(() => {
    vi.clearAllMocks()

    req = mockRequest({
      user: {
        id: '12345',
        name: 'John Doe',
        email: 'user@example.com',
        userType: 'EMPLOYEE',
        profilePhotoUrl: 'http://example.com/photo.jpg',
        registerCompleted: false,
        userId: '12345',
      }
    });

    res = mockResponse();

    const result = createMock<FetchUserInfoUseCase>();
    usecaseMock = result.usecase;
    executeMock = result.executeMock;

    vi.mocked(makeFetchUserInfoUseCase).mockImplementation(() => usecaseMock)
  })

  it('should be defined', () => {
    expect(FetchUserInfoController).toBeDefined()
  })

  describe('handle', () => {
    it('should return 200 and the user info if the use case succeeds', async () => {
      // arrange
      const mockUser = { name: 'John Doe', email: 'user@example.com' }
      executeMock.mockResolvedValueOnce({ user: mockUser })

      // act
      await FetchUserInfoController.handle(req, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith({ user: mockUser })
      expect(usecaseMock.execute).toHaveBeenCalledWith({
        email: 'user@example.com',
        userType: "EMPLOYEE",
      })
    })

    it('should return 400 if the userType is invalid', async () => {
      // arrange
      const errorMessage = 'Invalid userType'
      executeMock.mockRejectedValueOnce(new InvalidUserTypeUseCaseError(errorMessage))

      // act
      await FetchUserInfoController.handle(req, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
      expect(res.send).toHaveBeenCalledWith({ message: errorMessage })
    })

    it('should return 404 if the user is not found', async () => {
      // arrange
      const errorMessage = 'User not found'
      executeMock.mockRejectedValueOnce(new NotFoundUseCaseError(errorMessage))

      // act
      await FetchUserInfoController.handle(req, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)
      expect(res.send).toHaveBeenCalledWith({ message: errorMessage })
    })

    it('should return 500 if the use case throws an unexpected error', async () => {
      // arrange
      executeMock.mockRejectedValueOnce(new Error('Unexpected error'))

      // act
      await FetchUserInfoController.handle(req, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(res.send).toHaveBeenCalledWith({
        message: 'Error trying to fetch user info, please check back-end logs...'
      })
    })

  })
})