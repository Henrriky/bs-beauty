import { describe, it, expect, vi, beforeEach } from 'vitest'
import { type Request, type Response, type NextFunction } from 'express'
import { permissionAuthMiddleware } from '../../../../middlewares/auth/permission-auth.middleware'
import { PermissionChecker } from '../../../../utils/auth/permission-checker.util'
import { type Permissions } from '../../../../utils/auth/permissions-map.util'
import { CustomError } from '../../../../utils/errors/custom.error.util'

vi.mock('../../../../utils/auth/permission-checker.util')
vi.mock('../../../../utils/errors/custom.error.util')

describe('permissionAuthMiddleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    mockRequest = {
      user: {
        id: 'user-123',
        userType: 'PROFESSIONAL',
        sub: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        registerCompleted: true,
        userId: 'user-123',
        profilePhotoUrl: 'http://example.com/photo.jpg',
        permissions: ['professional.read', 'customer.read']
      }
    }

    mockResponse = {}
    mockNext = vi.fn()

    vi.clearAllMocks()
  })

  it('should call next when user has all required permissions', async () => {
    const requiredPermissions: Permissions[] = ['professional.read']
    const middleware = permissionAuthMiddleware(requiredPermissions)

    vi.mocked(PermissionChecker.hasPermission).mockReturnValue(true)

    await middleware(mockRequest as Request, mockResponse as Response, mockNext)

    expect(PermissionChecker.hasPermission).toHaveBeenCalledWith(['professional.read', 'customer.read'], 'professional.read')
    expect(mockNext).toHaveBeenCalledWith()
  })

  it('should call next with error when user lacks required permissions', async () => {
    const requiredPermissions: Permissions[] = ['professional.create']
    const middleware = permissionAuthMiddleware(requiredPermissions)
    const customError = new CustomError('Insufficient permissions', 403)

    vi.mocked(PermissionChecker.hasPermission).mockReturnValue(false)
    vi.mocked(CustomError).mockImplementation(() => customError)

    await middleware(mockRequest as Request, mockResponse as Response, mockNext)

    expect(PermissionChecker.hasPermission).toHaveBeenCalledWith(['professional.read', 'customer.read'], 'professional.create')
    expect(CustomError).toHaveBeenCalledWith('Insufficient permissions', 403)
    expect(mockNext).toHaveBeenCalledWith(customError)
  })

  it('should call next with error when user lacks some of multiple required permissions', async () => {
    const requiredPermissions: Permissions[] = ['professional.read', 'professional.create']
    const middleware = permissionAuthMiddleware(requiredPermissions)
    const customError = new CustomError('Insufficient permissions', 403)

    // User has first permission but not second
    vi.mocked(PermissionChecker.hasPermission)
      .mockReturnValueOnce(true) // professional.read
      .mockReturnValueOnce(false) // professional.create
    vi.mocked(CustomError).mockImplementation(() => customError)

    await middleware(mockRequest as Request, mockResponse as Response, mockNext)

    expect(PermissionChecker.hasPermission).toHaveBeenCalledTimes(2)
    expect(CustomError).toHaveBeenCalledWith('Insufficient permissions', 403)
    expect(mockNext).toHaveBeenCalledWith(customError)
  })

  it('should call next with error when an exception occurs', async () => {
    const requiredPermissions: Permissions[] = ['professional.read']
    const middleware = permissionAuthMiddleware(requiredPermissions)
    const thrownError = new Error('Permission check failed')

    vi.mocked(PermissionChecker.hasPermission).mockImplementation(() => {
      throw thrownError
    })

    await middleware(mockRequest as Request, mockResponse as Response, mockNext)

    expect(mockNext).toHaveBeenCalledWith(thrownError)
  })
})
