import { describe, it, expect, vi, beforeEach } from 'vitest'
import { type Request, type Response, type NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ZodError } from 'zod'
import { PasswordResetSetPasswordController } from '../../../../controllers/auth/password-reset-set-password.controller'
import { makePasswordResetSetPasswordUseCase } from '../../../../factory/auth/make-password-reset-set-password-use-case.factory'
import { formatValidationErrors } from '../../../../utils/formatting/zod-validation-errors.formatting.util'
import { CustomError } from '../../../../utils/errors/custom.error.util'
import { mockRequest, mockResponse } from '../../utils/test-utilts'
import { PasswordResetSetPasswordSchema } from '@/utils/validation/zod-schemas/auth/password-reset-set-password.schema'

vi.mock('../../../../factory/auth/make-password-reset-set-password-use-case.factory')
vi.mock('../../../../utils/formatting/zod-validation-errors.formatting.util')

describe('PasswordResetSetPasswordController', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let mockUseCase: { execute: ReturnType<typeof vi.fn> }

  // Test data constants
  const validRequestBody = {
    ticket: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    newPassword: 'NewPassword123!',
    confirmNewPassword: 'NewPassword123!'
  }

  const validPassword = 'ValidPass123!'
  const invalidPassword = 'weak'

  beforeEach(() => {
    req = mockRequest()
    res = mockResponse()
    next = vi.fn()

    mockUseCase = { execute: vi.fn() }
    vi.mocked(makePasswordResetSetPasswordUseCase).mockReturnValue(mockUseCase as any)

    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => { })
  })

  it('should be defined', () => {
    expect(PasswordResetSetPasswordController).toBeDefined()
  })

  describe('handle', () => {
    it('should reset password successfully with valid data', async () => {
      // arrange
      req.body = validRequestBody
      mockUseCase.execute.mockResolvedValue(undefined)

      // act
      await PasswordResetSetPasswordController.handle(req, res, next)

      // assert
      expect(makePasswordResetSetPasswordUseCase).toHaveBeenCalled()
      expect(mockUseCase.execute).toHaveBeenCalledWith({
        ticket: validRequestBody.ticket,
        newPassword: validRequestBody.newPassword
      })
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Password changed successfully'
      })
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next when use case throws CustomError', async () => {
      // arrange
      req.body = validRequestBody
      const customError = new CustomError('Bad Request', 400, 'EXPIRED_OR_NOT_FOUND')
      mockUseCase.execute.mockRejectedValue(customError)

      // act
      await PasswordResetSetPasswordController.handle(req, res, next)

      // assert
      expect(makePasswordResetSetPasswordUseCase).toHaveBeenCalled()
      expect(mockUseCase.execute).toHaveBeenCalledWith({
        ticket: validRequestBody.ticket,
        newPassword: validRequestBody.newPassword
      })
      expect(console.error).toHaveBeenCalledWith('Error setting new password.\nReason: Bad Request')
      expect(next).toHaveBeenCalledWith(customError)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
    })

    it('should format validation errors when ZodError is thrown', async () => {
      // arrange
      req.body = {
        ticket: validRequestBody.ticket,
        newPassword: invalidPassword,
        confirmNewPassword: invalidPassword
      }

      // act
      await PasswordResetSetPasswordController.handle(req, res, next)

      // assert
      expect(formatValidationErrors).toHaveBeenCalled()
      expect(formatValidationErrors).toHaveBeenCalledWith(expect.any(ZodError), res)
      expect(mockUseCase.execute).not.toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
    })
  })
})
