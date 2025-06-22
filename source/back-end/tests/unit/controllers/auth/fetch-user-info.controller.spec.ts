import { StatusCodes } from 'http-status-codes'
import { FetchUserInfoController } from '../../../../src/controllers/auth/fetch-user-info.controller'
import { makeFetchUserInfoUseCase } from '../../../../src/factory/auth/make-fetch-user-info.use-case.factory.ts'
import { InvalidUserTypeUseCaseError } from '../../../../src/services/use-cases/errors/invalid-user-type-use-case-error'
import { NotFoundUseCaseError } from '../../../../src/services/use-cases/errors/not-found-error'
import { z } from 'zod'

vi.mock('../../../../src/factory/auth/make-fetch-user-info.use-case.factory.ts')

describe('FetchUserInfoController', () => {
  let req: any
  let res: any
  let useCaseMock: any

  beforeEach(() => {
    vi.clearAllMocks()

    req = {
      user: {
        email: 'user@example.com',
        userType: 'user'
      }
    }

    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
      json: vi.fn()
    }

    useCaseMock = {
      execute: vi.fn()
    }

    vi.mocked(makeFetchUserInfoUseCase).mockImplementation(() => useCaseMock)
  })

  it('should be defined', () => {
    expect(FetchUserInfoController).toBeDefined()
  })

  describe('handle', () => {
    it('should return 200 and the user info if the use case succeeds', async () => {
      // arrange
      const mockUser = { name: 'John Doe', email: 'user@example.com' }
      useCaseMock.execute.mockResolvedValueOnce({ user: mockUser })

      // act
      await FetchUserInfoController.handle(req, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith({ user: mockUser })
      expect(useCaseMock.execute).toHaveBeenCalledWith({
        email: 'user@example.com',
        userType: 'user'
      })
    })

    it('should return 400 if the userType is invalid', async () => {
      // arrange
      const errorMessage = 'Invalid userType'
      useCaseMock.execute.mockRejectedValueOnce(new InvalidUserTypeUseCaseError(errorMessage))

      // act
      await FetchUserInfoController.handle(req, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
      expect(res.send).toHaveBeenCalledWith({ message: errorMessage })
    })

    it('should return 404 if the user is not found', async () => {
      // arrange
      const errorMessage = 'User not found'
      useCaseMock.execute.mockRejectedValueOnce(new NotFoundUseCaseError(errorMessage))

      // act
      await FetchUserInfoController.handle(req, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)
      expect(res.send).toHaveBeenCalledWith({ message: errorMessage })
    })

    it('should return 500 if the use case throws an unexpected error', async () => {
      // arrange
      useCaseMock.execute.mockRejectedValueOnce(new Error('Unexpected error'))

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