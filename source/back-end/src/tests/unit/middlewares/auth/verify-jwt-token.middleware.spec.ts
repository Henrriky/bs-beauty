import { describe, it, expect, vi, beforeEach } from 'vitest'
import { type Request, type Response, type NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { verifyJwtTokenMiddleware, type TokenPayload } from '../../../../middlewares/auth/verify-jwt-token.middleware'
import { AppErrorCodes } from '../../../../utils/errors/app-error-codes'
import { ENV } from '../../../../config/env'

vi.mock('jsonwebtoken')
vi.mock('../../../../config/env', () => ({
  ENV: {
    JWT_SECRET: 'test-secret'
  }
}))

describe('verifyJwtTokenMiddleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction
  let mockStatus: ReturnType<typeof vi.fn>
  let mockSend: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockStatus = vi.fn().mockReturnThis()
    mockSend = vi.fn()

    mockRequest = {
      headers: {}
    }

    mockResponse = {
      status: mockStatus,
      send: mockSend
    }

    mockNext = vi.fn()

    vi.clearAllMocks()

    vi.spyOn(console, 'error').mockImplementation(() => { })
  })

  it('should return 401 when authorization header is missing', () => {
    mockRequest.headers = {}

    verifyJwtTokenMiddleware(mockRequest as Request, mockResponse as Response, mockNext)

    expect(mockStatus).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
    expect(mockSend).toHaveBeenCalledWith({
      message: 'Access Denied!',
      errors: AppErrorCodes.TOKEN_INVALID
    })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 401 when authorization header is null', () => {
    mockRequest.headers = { authorization: undefined }

    verifyJwtTokenMiddleware(mockRequest as Request, mockResponse as Response, mockNext)

    expect(mockStatus).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
    expect(mockSend).toHaveBeenCalledWith({
      message: 'Access Denied!',
      errors: AppErrorCodes.TOKEN_INVALID
    })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 401 when token is missing from authorization header', () => {
    mockRequest.headers = { authorization: 'Bearer' }

    verifyJwtTokenMiddleware(mockRequest as Request, mockResponse as Response, mockNext)

    expect(mockStatus).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
    expect(mockSend).toHaveBeenCalledWith({
      message: 'Access Denied!',
      errors: AppErrorCodes.TOKEN_INVALID
    })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 401 when authorization header has invalid format', () => {
    mockRequest.headers = { authorization: 'InvalidFormat' }

    verifyJwtTokenMiddleware(mockRequest as Request, mockResponse as Response, mockNext)

    expect(mockStatus).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
    expect(mockSend).toHaveBeenCalledWith({
      message: 'Access Denied!',
      errors: AppErrorCodes.TOKEN_INVALID
    })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 401 when authorization header split returns null', () => {
    // Test edge case where split could potentially return undefined
    mockRequest.headers = { authorization: '' }

    verifyJwtTokenMiddleware(mockRequest as Request, mockResponse as Response, mockNext)

    expect(mockStatus).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
    expect(mockSend).toHaveBeenCalledWith({
      message: 'Access Denied!',
      errors: AppErrorCodes.TOKEN_INVALID
    })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should call next when token is valid', () => {
    const mockTokenPayload: TokenPayload = {
      id: 'user-123',
      userType: 'CUSTOMER',
      sub: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      registerCompleted: true,
      userId: 'user-123',
      profilePhotoUrl: 'http://example.com/photo.jpg',
      permissions: []
    }

    mockRequest.headers = { authorization: 'Bearer valid-token' }
    vi.mocked(jwt.verify).mockReturnValue(mockTokenPayload as any)

    verifyJwtTokenMiddleware(mockRequest as Request, mockResponse as Response, mockNext)

    expect(jwt.verify).toHaveBeenCalledWith('valid-token', ENV.JWT_SECRET)
    expect(mockRequest.user).toEqual(mockTokenPayload)
    expect(mockNext).toHaveBeenCalled()
    expect(mockStatus).not.toHaveBeenCalled()
  })

  it('should return 401 when jwt.verify throws an error', () => {
    mockRequest.headers = { authorization: 'Bearer invalid-token' }
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error('Invalid token')
    })

    verifyJwtTokenMiddleware(mockRequest as Request, mockResponse as Response, mockNext)

    expect(console.error).toHaveBeenCalledWith('Error trying to verify jwt token.\nReason: Invalid token')
    expect(mockStatus).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
    expect(mockSend).toHaveBeenCalledWith({
      message: 'Access Denied!',
      errors: AppErrorCodes.TOKEN_INVALID
    })
    expect(mockNext).not.toHaveBeenCalled()
  })
})