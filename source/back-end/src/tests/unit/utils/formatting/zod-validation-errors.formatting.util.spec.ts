import { describe, expect, it, vi } from 'vitest'
import { formatValidationErrors } from '@/utils/formatting/zod-validation-errors.formatting.util'
import { z, type ZodError } from 'zod'
import type { Response } from 'express'

describe('Zod Validation Errors Formatting', () => {
  describe('formatValidationErrors', () => {
    it('should format single validation error', () => {
      const schema = z.object({
        email: z.string().email()
      })

      let error: ZodError | undefined
      try {
        schema.parse({ email: 'invalid-email' })
      } catch (e) {
        error = e as ZodError
      }

      const statusMock = vi.fn().mockReturnThis()
      const jsonMock = vi.fn()
      const res = {
        status: statusMock,
        json: jsonMock
      } as unknown as Response

      formatValidationErrors(error!, res)

      expect(statusMock).toHaveBeenCalledWith(400)
      expect(jsonMock).toHaveBeenCalledWith({
        statusCode: 400,
        message: 'Validation Error',
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: expect.any(String)
          })
        ])
      })
    })

    it('should format multiple validation errors', () => {
      const schema = z.object({
        name: z.string().min(3),
        email: z.string().email(),
        age: z.number().min(18)
      })

      let error: ZodError | undefined
      try {
        schema.parse({ name: 'Jo', email: 'invalid', age: 15 })
      } catch (e) {
        error = e as ZodError
      }

      const statusMock = vi.fn().mockReturnThis()
      const jsonMock = vi.fn()
      const res = {
        status: statusMock,
        json: jsonMock
      } as unknown as Response

      formatValidationErrors(error!, res)

      expect(statusMock).toHaveBeenCalledWith(400)
      expect(jsonMock).toHaveBeenCalledOnce()

      const response = jsonMock.mock.calls[0][0]
      expect(response.errors).toHaveLength(3)
      expect(response.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'name' }),
          expect.objectContaining({ field: 'email' }),
          expect.objectContaining({ field: 'age' })
        ])
      )
    })

    it('should include error messages', () => {
      const schema = z.object({
        password: z.string().min(8, 'Password must be at least 8 characters')
      })

      let error: ZodError | undefined
      try {
        schema.parse({ password: '123' })
      } catch (e) {
        error = e as ZodError
      }

      const statusMock = vi.fn().mockReturnThis()
      const jsonMock = vi.fn()
      const res = {
        status: statusMock,
        json: jsonMock
      } as unknown as Response

      formatValidationErrors(error!, res)

      const response = jsonMock.mock.calls[0][0]
      expect(response.errors[0]).toEqual({
        field: 'password',
        message: 'Password must be at least 8 characters'
      })
    })

    it('should format nested field errors', () => {
      const schema = z.object({
        user: z.object({
          name: z.string(),
          contact: z.object({
            email: z.string().email()
          })
        })
      })

      let error: ZodError | undefined
      try {
        schema.parse({
          user: {
            name: '',
            contact: {
              email: 'invalid'
            }
          }
        })
      } catch (e) {
        error = e as ZodError
      }

      const statusMock = vi.fn().mockReturnThis()
      const jsonMock = vi.fn()
      const res = {
        status: statusMock,
        json: jsonMock
      } as unknown as Response

      formatValidationErrors(error!, res)

      const response = jsonMock.mock.calls[0][0]
      expect(response.errors).toBeDefined()
      expect(response.statusCode).toBe(400)
    })

    it('should always return 400 status code', () => {
      const schema = z.object({
        field: z.string()
      })

      let error: ZodError | undefined
      try {
        schema.parse({})
      } catch (e) {
        error = e as ZodError
      }

      const statusMock = vi.fn().mockReturnThis()
      const jsonMock = vi.fn()
      const res = {
        status: statusMock,
        json: jsonMock
      } as unknown as Response

      formatValidationErrors(error!, res)

      expect(statusMock).toHaveBeenCalledWith(400)

      const response = jsonMock.mock.calls[0][0]
      expect(response.statusCode).toBe(400)
    })

    it('should always include "Validation Error" message', () => {
      const schema = z.object({
        test: z.string()
      })

      let error: ZodError | undefined
      try {
        schema.parse({})
      } catch (e) {
        error = e as ZodError
      }

      const statusMock = vi.fn().mockReturnThis()
      const jsonMock = vi.fn()
      const res = {
        status: statusMock,
        json: jsonMock
      } as unknown as Response

      formatValidationErrors(error!, res)

      const response = jsonMock.mock.calls[0][0]
      expect(response.message).toBe('Validation Error')
    })

    it('should format array errors correctly', () => {
      const schema = z.object({
        tags: z.array(z.string()).min(1)
      })

      let error: ZodError | undefined
      try {
        schema.parse({ tags: [] })
      } catch (e) {
        error = e as ZodError
      }

      const statusMock = vi.fn().mockReturnThis()
      const jsonMock = vi.fn()
      const res = {
        status: statusMock,
        json: jsonMock
      } as unknown as Response

      formatValidationErrors(error!, res)

      const response = jsonMock.mock.calls[0][0]
      expect(response.errors[0]).toEqual({
        field: 'tags',
        message: expect.any(String)
      })
    })
  })
})
