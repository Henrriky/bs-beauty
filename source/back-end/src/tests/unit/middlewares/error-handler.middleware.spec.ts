import { beforeEach, describe, expect, it, vi } from 'vitest'
import { errorHandlerMiddleware } from '@/middlewares/error-handler.middleware'
import { CustomError } from '@/utils/errors/custom.error.util'
import type { Request, Response, NextFunction } from 'express'
import { AppLoggerInstance } from '@/utils/logger/logger.util'

vi.mock('@/utils/logger/logger.util', () => ({
  AppLoggerInstance: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn()
  }
}))

describe('errorHandlerMiddleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    vi.clearAllMocks()

    mockRequest = {
      path: '/test-path',
      method: 'GET'
    }

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis()
    }

    mockNext = vi.fn()
  })

  describe('when error is CustomError', () => {
    it('should handle CustomError with proper status code and message', () => {
      const customError = new CustomError('Test error message', 400)

      errorHandlerMiddleware(
        customError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(AppLoggerInstance.warn).toHaveBeenCalledWith(
        '[Middleware] Occured a Known Error: ',
        {
          path: '/test-path',
          method: 'GET',
          details: {
            message: 'Test error message',
            statusCode: 400,
            details: undefined
          }
        }
      )

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.send).toHaveBeenCalledWith({
        statusCode: 400,
        message: 'Test error message',
        details: undefined
      })
    })

    it('should handle CustomError with details', () => {
      const errorDetails = JSON.stringify({
        field: 'email',
        reason: 'Invalid format'
      })
      const customError = new CustomError('Validation failed', 422, errorDetails)

      errorHandlerMiddleware(
        customError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(AppLoggerInstance.warn).toHaveBeenCalledWith(
        '[Middleware] Occured a Known Error: ',
        {
          path: '/test-path',
          method: 'GET',
          details: {
            message: 'Validation failed',
            statusCode: 422,
            details: errorDetails
          }
        }
      )

      expect(mockResponse.status).toHaveBeenCalledWith(422)
      expect(mockResponse.send).toHaveBeenCalledWith({
        statusCode: 422,
        message: 'Validation failed',
        details: errorDetails
      })
    })

    it('should handle CustomError with 404 status', () => {
      const customError = new CustomError('Resource not found', 404)

      errorHandlerMiddleware(
        customError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.send).toHaveBeenCalledWith({
        statusCode: 404,
        message: 'Resource not found',
        details: undefined
      })
    })
  })

  describe('when error is not CustomError', () => {
    it('should handle generic Error with 500 status', () => {
      const genericError = new Error('Unexpected error')

      errorHandlerMiddleware(
        genericError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(AppLoggerInstance.error).toHaveBeenCalledWith(
        '[Middleware] Occured an Unknown Error: ',
        genericError,
        {
          path: '/test-path',
          method: 'GET'
        }
      )

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.send).toHaveBeenCalledWith({
        statusCode: 500,
        message: 'Internal Server Error',
        details: 'An unexpected error ocurred'
      })
    })

    it('should handle TypeError with 500 status', () => {
      const typeError = new TypeError('Cannot read property of undefined')

      errorHandlerMiddleware(
        typeError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(AppLoggerInstance.error).toHaveBeenCalledWith(
        '[Middleware] Occured an Unknown Error: ',
        typeError,
        {
          path: '/test-path',
          method: 'GET'
        }
      )

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.send).toHaveBeenCalledWith({
        statusCode: 500,
        message: 'Internal Server Error',
        details: 'An unexpected error ocurred'
      })
    })

    it('should handle unknown error object with 500 status', () => {
      const unknownError = { message: 'Something went wrong' }

      errorHandlerMiddleware(
        unknownError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(AppLoggerInstance.error).toHaveBeenCalledWith(
        '[Middleware] Occured an Unknown Error: ',
        unknownError,
        {
          path: '/test-path',
          method: 'GET'
        }
      )

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.send).toHaveBeenCalledWith({
        statusCode: 500,
        message: 'Internal Server Error',
        details: 'An unexpected error ocurred'
      })
    })

    it('should handle null error with 500 status', () => {
      errorHandlerMiddleware(
        null,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.send).toHaveBeenCalledWith({
        statusCode: 500,
        message: 'Internal Server Error',
        details: 'An unexpected error ocurred'
      })
    })
  })

  describe('request context logging', () => {
    it('should log different paths correctly', () => {
      const customError = new CustomError('Test', 400)
      mockRequest = {
        path: '/api/users',
        method: 'POST'
      }

      errorHandlerMiddleware(
        customError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(AppLoggerInstance.warn).toHaveBeenCalledWith(
        '[Middleware] Occured a Known Error: ',
        expect.objectContaining({
          path: '/api/users',
          method: 'POST'
        })
      )
    })

    it('should log different HTTP methods correctly', () => {
      const customError = new CustomError('Test', 400)
      mockRequest = {
        path: '/test-path',
        method: 'DELETE'
      }

      errorHandlerMiddleware(
        customError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(AppLoggerInstance.warn).toHaveBeenCalledWith(
        '[Middleware] Occured a Known Error: ',
        expect.objectContaining({
          method: 'DELETE'
        })
      )
    })
  })
})
