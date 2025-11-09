import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UserType } from '@prisma/client'
import { type Request, type Response, type NextFunction } from 'express'
import { faker } from '@faker-js/faker'

import { userTypeAuthMiddleware } from '@/middlewares/auth/user-type-auth.middleware'
import { AppErrorCodes } from '@/utils/errors/app-error-codes'
import { type TokenPayload } from '@/middlewares/auth/verify-jwt-token.middleware'

// Helper function to create valid TokenPayload objects
const createMockTokenPayload = (overrides: Partial<TokenPayload> = {}): TokenPayload => ({
  id: faker.string.uuid(),
  userType: UserType.CUSTOMER,
  sub: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  registerCompleted: true,
  userId: faker.string.uuid(),
  profilePhotoUrl: faker.internet.url(),
  permissions: [],
  ...overrides
})

describe('userTypeAuthMiddleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn()
    }
    mockNext = vi.fn()
  })

  describe('when user type matches allowed types', () => {
    it('should call next() when user has valid CUSTOMER type', () => {
      // arrange
      const middleware = userTypeAuthMiddleware([UserType.CUSTOMER])
      mockRequest.user = createMockTokenPayload({
        userType: UserType.CUSTOMER
      })

      // act
      middleware(mockRequest as Request, mockResponse as Response, mockNext)

      // assert
      expect(mockNext).toHaveBeenCalledWith()
      expect(mockResponse.status).not.toHaveBeenCalled()
      expect(mockResponse.send).not.toHaveBeenCalled()
    })

    it('should call next() when user has valid PROFESSIONAL type', () => {
      // arrange
      const middleware = userTypeAuthMiddleware([UserType.PROFESSIONAL])
      mockRequest.user = createMockTokenPayload({
        userType: UserType.PROFESSIONAL
      })

      // act
      middleware(mockRequest as Request, mockResponse as Response, mockNext)

      // assert
      expect(mockNext).toHaveBeenCalledWith()
      expect(mockResponse.status).not.toHaveBeenCalled()
    })

    it('should call next() when user has valid MANAGER type', () => {
      // arrange
      const middleware = userTypeAuthMiddleware([UserType.MANAGER])
      mockRequest.user = createMockTokenPayload({
        userType: UserType.MANAGER
      })

      // act
      middleware(mockRequest as Request, mockResponse as Response, mockNext)

      // assert
      expect(mockNext).toHaveBeenCalledWith()
      expect(mockResponse.status).not.toHaveBeenCalled()
    })

    it('should call next() when user type is in multiple allowed types', () => {
      // arrange
      const middleware = userTypeAuthMiddleware([UserType.CUSTOMER, UserType.PROFESSIONAL])
      mockRequest.user = createMockTokenPayload({
        userType: UserType.PROFESSIONAL
      })

      // act
      middleware(mockRequest as Request, mockResponse as Response, mockNext)

      // assert
      expect(mockNext).toHaveBeenCalledWith()
      expect(mockResponse.status).not.toHaveBeenCalled()
    })
  })

  describe('when user type is null or undefined', () => {
    it('should return 401 when userType is null', () => {
      // arrange
      const middleware = userTypeAuthMiddleware([UserType.CUSTOMER])
      mockRequest.user = createMockTokenPayload({
        userType: null as any
      })

      // act
      middleware(mockRequest as Request, mockResponse as Response, mockNext)

      // assert
      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.send).toHaveBeenCalledWith({
        statusCode: 401,
        message: 'Unauthorized',
        details: AppErrorCodes.USER_TYPE_NON_EXISTENT
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return 401 when userType is undefined', () => {
      // arrange
      const middleware = userTypeAuthMiddleware([UserType.CUSTOMER])
      mockRequest.user = createMockTokenPayload({
        userType: undefined as any
      })

      // act
      middleware(mockRequest as Request, mockResponse as Response, mockNext)

      // assert
      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.send).toHaveBeenCalledWith({
        statusCode: 401,
        message: 'Unauthorized',
        details: AppErrorCodes.USER_TYPE_NON_EXISTENT
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return 401 when user object does not have userType property', () => {
      // arrange
      const middleware = userTypeAuthMiddleware([UserType.CUSTOMER])
      const userWithoutType = createMockTokenPayload()
      delete (userWithoutType as any).userType
      mockRequest.user = userWithoutType

      // act
      middleware(mockRequest as Request, mockResponse as Response, mockNext)

      // assert
      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.send).toHaveBeenCalledWith({
        statusCode: 401,
        message: 'Unauthorized',
        details: AppErrorCodes.USER_TYPE_NON_EXISTENT
      })
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('when delegateIfHavePermission is true', () => {
    it('should call next() when user has permissions and delegateIfHavePermission is true', () => {
      // arrange
      const middleware = userTypeAuthMiddleware([UserType.MANAGER], true)
      mockRequest.user = createMockTokenPayload({
        userType: UserType.CUSTOMER, // não tem permissão por tipo
        permissions: ['MANAGE_USERS', 'VIEW_REPORTS'] as any // mas tem permissões
      })

      // act
      middleware(mockRequest as Request, mockResponse as Response, mockNext)

      // assert
      expect(mockNext).toHaveBeenCalledWith()
      expect(mockResponse.status).not.toHaveBeenCalled()
      expect(mockResponse.send).not.toHaveBeenCalled()
    })

    it('should call next() when user has at least one permission and delegateIfHavePermission is true', () => {
      // arrange
      const middleware = userTypeAuthMiddleware([UserType.MANAGER], true)
      mockRequest.user = createMockTokenPayload({
        userType: UserType.PROFESSIONAL,
        permissions: ['VIEW_ANALYTICS'] as any // apenas uma permissão
      })

      // act
      middleware(mockRequest as Request, mockResponse as Response, mockNext)

      // assert
      expect(mockNext).toHaveBeenCalledWith()
      expect(mockResponse.status).not.toHaveBeenCalled()
    })

    it('should check user type when user has no permissions even with delegateIfHavePermission true', () => {
      // arrange
      const middleware = userTypeAuthMiddleware([UserType.MANAGER], true)
      mockRequest.user = createMockTokenPayload({
        userType: UserType.CUSTOMER, // tipo não permitido
        permissions: [] // sem permissões
      })

      // act
      middleware(mockRequest as Request, mockResponse as Response, mockNext)

      // assert
      expect(mockResponse.status).toHaveBeenCalledWith(403)
      expect(mockResponse.send).toHaveBeenCalledWith({
        statusCode: 401,
        message: 'Unauthorized',
        details: AppErrorCodes.USER_TYPE_INSUFFICIENT
      })
      expect(mockNext).not.toHaveBeenCalled()
    })
  })
})
