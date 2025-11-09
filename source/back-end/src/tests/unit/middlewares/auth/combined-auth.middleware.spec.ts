import { faker } from '@faker-js/faker'
import { UserType } from '@prisma/client'
import { type NextFunction, type Request, type Response } from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { combinedAuthMiddleware } from '@/middlewares/auth/combined-auth.middleware'
import { type TokenPayload } from '@/middlewares/auth/verify-jwt-token.middleware'
import { PermissionChecker } from '@/utils/auth/permission-checker.util'
import { type Permissions } from '@/utils/auth/permissions-map.util'
import { AppErrorCodes } from '@/utils/errors/app-error-codes'

vi.mock('@/utils/auth/permission-checker.util', () => ({
  PermissionChecker: {
    hasPermission: vi.fn()
  }
}))

vi.mock('@/utils/logger/logger.util', () => ({
  AppLoggerInstance: {
    info: vi.fn()
  }
}))

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

describe('combinedAuthMiddleware', () => {
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

    vi.clearAllMocks()
  })

  describe('when user has valid user type', () => {
    it('should call next() when user type is in allowed types', () => {
      // arrange
      const middleware = combinedAuthMiddleware([UserType.CUSTOMER], [])
      mockRequest.user = createMockTokenPayload({
        userType: UserType.CUSTOMER,
        permissions: []
      })
      mockRequest.originalUrl = '/api/test'
      mockRequest.method = 'GET'

      // act
      middleware(mockRequest as Request, mockResponse as Response, mockNext)

      // assert
      expect(mockNext).toHaveBeenCalledWith()
      expect(mockResponse.status).not.toHaveBeenCalled()
      expect(mockResponse.send).not.toHaveBeenCalled()
    })

    it('should call next() when user type is PROFESSIONAL and is in allowed types', () => {
      // arrange
      const middleware = combinedAuthMiddleware([UserType.PROFESSIONAL, UserType.MANAGER], [])
      mockRequest.user = createMockTokenPayload({
        userType: UserType.PROFESSIONAL,
        permissions: []
      })
      mockRequest.originalUrl = '/api/professionals'
      mockRequest.method = 'GET'

      // act
      middleware(mockRequest as Request, mockResponse as Response, mockNext)

      // assert
      expect(mockNext).toHaveBeenCalledWith()
      expect(mockResponse.status).not.toHaveBeenCalled()
    })

    it('should call next() when user type is MANAGER', () => {
      // arrange
      const middleware = combinedAuthMiddleware([UserType.MANAGER], [])
      mockRequest.user = createMockTokenPayload({
        userType: UserType.MANAGER,
        permissions: []
      })
      mockRequest.originalUrl = '/api/admin'
      mockRequest.method = 'POST'

      // act
      middleware(mockRequest as Request, mockResponse as Response, mockNext)

      // assert
      expect(mockNext).toHaveBeenCalledWith()
      expect(mockResponse.status).not.toHaveBeenCalled()
    })
  })

  describe('when user has valid permissions', () => {
    it('should call next() when user has required permissions but invalid user type', () => {
      // arrange
      const requiredPermissions: Permissions[] = ['professional.read', 'professional.edit']
      const middleware = combinedAuthMiddleware([UserType.MANAGER], requiredPermissions)

      mockRequest.user = createMockTokenPayload({
        userType: UserType.CUSTOMER, // not in allowed user types
        permissions: requiredPermissions
      })
      mockRequest.originalUrl = '/api/professionals'
      mockRequest.method = 'PUT'

      // Mock PermissionChecker to return true for both permissions
      vi.mocked(PermissionChecker.hasPermission)
        .mockReturnValueOnce(true) // first permission
        .mockReturnValueOnce(true) // second permission

      // act
      middleware(mockRequest as Request, mockResponse as Response, mockNext)

      // assert
      expect(mockNext).toHaveBeenCalledWith()
      expect(mockResponse.status).not.toHaveBeenCalled()
      expect(PermissionChecker.hasPermission).toHaveBeenCalledTimes(2)
      expect(PermissionChecker.hasPermission).toHaveBeenCalledWith(requiredPermissions, 'professional.read')
      expect(PermissionChecker.hasPermission).toHaveBeenCalledWith(requiredPermissions, 'professional.edit')
    })

    it('should call next() when user has all required permissions', () => {
      // arrange
      const requiredPermissions: Permissions[] = ['roles.read']
      const middleware = combinedAuthMiddleware([UserType.MANAGER], requiredPermissions)

      mockRequest.user = createMockTokenPayload({
        userType: UserType.PROFESSIONAL,
        permissions: ['roles.read', 'roles.edit']
      })
      mockRequest.originalUrl = '/api/roles'
      mockRequest.method = 'GET'

      vi.mocked(PermissionChecker.hasPermission).mockReturnValue(true)

      // act
      middleware(mockRequest as Request, mockResponse as Response, mockNext)

      // assert
      expect(mockNext).toHaveBeenCalledWith()
      expect(mockResponse.status).not.toHaveBeenCalled()
      expect(PermissionChecker.hasPermission).toHaveBeenCalledTimes(1)
    })

    it('should return 403 when user has partial required permissions', () => {
      // arrange
      const requiredPermissions: Permissions[] = ['professional.read', 'professional.edit', 'professional.delete']
      const middleware = combinedAuthMiddleware([UserType.MANAGER], requiredPermissions)

      mockRequest.user = createMockTokenPayload({
        userType: UserType.CUSTOMER,
        permissions: ['professional.read', 'professional.edit'] // missing professional.delete
      })
      mockRequest.originalUrl = '/api/professionals/bulk'
      mockRequest.method = 'PUT'

      // Mock to return true for first two, false for the third
      vi.mocked(PermissionChecker.hasPermission)
        .mockReturnValueOnce(true) // professional.read
        .mockReturnValueOnce(true) // professional.edit
        .mockReturnValueOnce(false) // professional.delete

      // act
      middleware(mockRequest as Request, mockResponse as Response, mockNext)

      // assert
      expect(mockResponse.status).toHaveBeenCalledWith(403)
      expect(mockResponse.send).toHaveBeenCalledWith({
        statusCode: 403,
        message: 'Forbidden',
        details: AppErrorCodes.INSUFFICIENT_PERMISSIONS
      })
      expect(mockNext).not.toHaveBeenCalled()
      expect(PermissionChecker.hasPermission).toHaveBeenCalledTimes(3)
    })

    it('should return 403 when user type not in allowed and missing required permissions', () => {
      // arrange
      const requiredPermissions: Permissions[] = ['professional.delete']
      const middleware = combinedAuthMiddleware([UserType.MANAGER], requiredPermissions)

      mockRequest.user = createMockTokenPayload({
        userType: UserType.CUSTOMER,
        permissions: ['professional.read'] // has permissions but not the required ones
      })
      mockRequest.originalUrl = '/api/professionals/123'
      mockRequest.method = 'DELETE'

      vi.mocked(PermissionChecker.hasPermission).mockReturnValue(false)

      // act
      middleware(mockRequest as Request, mockResponse as Response, mockNext)

      // assert
      expect(mockResponse.status).toHaveBeenCalledWith(403)
      expect(mockResponse.send).toHaveBeenCalledWith({
        statusCode: 403,
        message: 'Forbidden',
        details: AppErrorCodes.INSUFFICIENT_PERMISSIONS
      })
      expect(mockNext).not.toHaveBeenCalled()
      expect(PermissionChecker.hasPermission).toHaveBeenCalledWith(['professional.read'], 'professional.delete')
    })
  })
})
