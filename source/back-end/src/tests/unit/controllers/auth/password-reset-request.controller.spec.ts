import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { PasswordResetRequestController } from '../../../../controllers/auth/password-reset-request.controller'
import { makePasswordResetRequestUseCase } from '../../../../factory/auth/make-password-reset-request-use-case.factory'
import { type PasswordResetRequestUseCase } from '../../../../services/use-cases/auth/password-reset-request.use-case'
import { type MockRequest, mockRequest, mockResponse } from '../../utils/test-utilts'
import { createMock } from '../../utils/mocks'

vi.mock('@/factory/auth/make-password-reset-request-use-case.factory', () => ({
  makePasswordResetRequestUseCase: vi.fn()
}))

vi.mock('@/utils/formatting/zod-validation-errors.formatting.util', () => ({
  formatValidationErrors: vi.fn()
}))

describe('PasswordResetRequestController', () => {
  let req: MockRequest
  let res: Response
  let next: any
  let executeMock: ReturnType<typeof vi.fn>
  let usecaseMock: PasswordResetRequestUseCase

  beforeEach(() => {
    vi.clearAllMocks()
    req = mockRequest()
    res = mockResponse()
    next = vi.fn()

    const result = createMock<PasswordResetRequestUseCase>()
    usecaseMock = result.usecase
    executeMock = result.executeMock

    vi.mocked(makePasswordResetRequestUseCase).mockReturnValue(usecaseMock)
  })

  it('should be defined', () => {
    expect(PasswordResetRequestController).toBeDefined()
  })

  describe('handle', () => {
    it('should send password reset request successfully with valid email', async () => {
      // arrange
      const email = faker.internet.email()
      req = mockRequest({
        body: { email }
      })

      executeMock.mockResolvedValueOnce(undefined)

      // act
      await PasswordResetRequestController.handle(req, res, next)

      // assert
      expect(makePasswordResetRequestUseCase).toHaveBeenCalled()
      expect(executeMock).toHaveBeenCalledWith(email)
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Verification code sent to provided email'
      })
      expect(next).not.toHaveBeenCalled()
    })

    it('should return validation error for invalid email format', async () => {
      // arrange
      const invalidEmail = 'invalid-email'
      req = mockRequest({
        body: { email: invalidEmail }
      })

      const { formatValidationErrors } = await import('@/utils/formatting/zod-validation-errors.formatting.util')

      // act
      await PasswordResetRequestController.handle(req, res, next)

      // assert
      expect(formatValidationErrors).toHaveBeenCalled()
      expect(makePasswordResetRequestUseCase).not.toHaveBeenCalled()
      expect(executeMock).not.toHaveBeenCalled()
      expect(res.status).not.toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle unexpected errors', async () => {
      // arrange
      const email = faker.internet.email()
      const error = new Error(faker.lorem.sentence())
      req = mockRequest({
        body: { email }
      })

      vi.mocked(makePasswordResetRequestUseCase).mockImplementation(() => {
        throw error
      })

      // act
      await PasswordResetRequestController.handle(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(error)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
    })

    it('should log error messages when errors occur', async () => {
      // arrange
      const email = faker.internet.email()
      const errorMessage = faker.lorem.sentence()
      const error = new Error(errorMessage)
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      req = mockRequest({
        body: { email }
      })

      executeMock.mockRejectedValueOnce(error)

      // act
      await PasswordResetRequestController.handle(req, res, next)

      // assert
      expect(consoleSpy).toHaveBeenCalledWith(`Error trying to send password request.\nReason: ${errorMessage}`)
      expect(next).toHaveBeenCalledWith(error)

      consoleSpy.mockRestore()
    })
  })
})
