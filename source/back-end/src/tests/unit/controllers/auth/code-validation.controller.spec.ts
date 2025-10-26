import { describe, it, expect, vi, beforeEach } from 'vitest'
import { type Request, type Response, type NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { CodeValidationController } from '../../../../controllers/auth/code-validation.controller'
import { makeVerifyCustomerUseCase } from '../../../../factory/auth/make-verify-customer.use-case.factory'
import { makeVerifyPasswordResetUseCase } from '../../../../factory/auth/make-verify-password-reset.use-case.factory'
import { formatValidationErrors } from '../../../../utils/formatting/zod-validation-errors.formatting.util'
import { mockRequest, mockResponse } from '../../utils/test-utilts'

vi.mock('../../../../factory/auth/make-verify-customer.use-case.factory')
vi.mock('../../../../factory/auth/make-verify-password-reset.use-case.factory')
vi.mock('../../../../utils/formatting/zod-validation-errors.formatting.util')

describe('CodeValidationController', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let mockVerifyCustomerUseCase: { execute: ReturnType<typeof vi.fn> }
  let mockVerifyPasswordResetUseCase: { execute: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    req = mockRequest()
    res = mockResponse()
    next = vi.fn()

    mockVerifyCustomerUseCase = { execute: vi.fn() }
    mockVerifyPasswordResetUseCase = { execute: vi.fn() }

    vi.mocked(makeVerifyCustomerUseCase).mockReturnValue(mockVerifyCustomerUseCase as any)
    vi.mocked(makeVerifyPasswordResetUseCase).mockReturnValue(mockVerifyPasswordResetUseCase as any)

    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => { })
  })

  it('should handle register purpose successfully', async () => {
    // arrange
    const requestBody = {
      purpose: 'register',
      email: 'test@example.com',
      code: '123456'
    }
    const useCaseResult = { userId: 'user-123', verified: true }

    req.body = requestBody
    mockVerifyCustomerUseCase.execute.mockResolvedValue(useCaseResult)

    // act
    await CodeValidationController.handle(req, res, next)

    // assert
    expect(makeVerifyCustomerUseCase).toHaveBeenCalled()
    expect(mockVerifyCustomerUseCase.execute).toHaveBeenCalledWith({
      email: 'test@example.com',
      code: '123456'
    })
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      ...useCaseResult
    })
  })

  it('should handle passwordReset purpose successfully', async () => {
    // arrange
    const requestBody = {
      purpose: 'passwordReset',
      email: 'test@example.com',
      code: '654321'
    }
    const useCaseResult = { ticket: 'reset-ticket-123' }

    req.body = requestBody
    mockVerifyPasswordResetUseCase.execute.mockResolvedValue(useCaseResult)

    // act
    await CodeValidationController.handle(req, res, next)

    // assert
    expect(makeVerifyPasswordResetUseCase).toHaveBeenCalled()
    expect(mockVerifyPasswordResetUseCase.execute).toHaveBeenCalledWith({
      email: 'test@example.com',
      code: '654321'
    })
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      ticket: 'reset-ticket-123',
      message: 'Code verified. You may now set a new password.'
    })
  })

  it('should handle validation errors with Zod', async () => {
    // arrange
    const requestBody = {
      purpose: 'register',
      email: 'invalid-email',
      code: '123' // too short
    }

    req.body = requestBody

    // act
    await CodeValidationController.handle(req, res, next)

    // assert
    expect(formatValidationErrors).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })

  it('should call next for use case errors', async () => {
    // arrange
    const requestBody = {
      purpose: 'register',
      email: 'test@example.com',
      code: '123456'
    }
    const error = new Error('Use case failed')

    req.body = requestBody
    mockVerifyCustomerUseCase.execute.mockRejectedValue(error)

    // act
    await CodeValidationController.handle(req, res, next)

    // assert
    expect(console.error).toHaveBeenCalledWith('Error trying to complete user register.\nReason: Use case failed')
    expect(next).toHaveBeenCalledWith(error)
  })

  it('should default purpose to register when not provided', async () => {
    // arrange
    const requestBody = {
      email: 'test@example.com',
      code: '123456'
    }
    const useCaseResult = { userId: 'user-123' }

    req.body = requestBody
    mockVerifyCustomerUseCase.execute.mockResolvedValue(useCaseResult)

    // act
    await CodeValidationController.handle(req, res, next)

    // assert
    expect(mockVerifyCustomerUseCase.execute).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
  })

})