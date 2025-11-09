import { describe, expect, it } from 'vitest'
import { CustomError } from '@/utils/errors/custom.error.util'

describe('CustomError', () => {
  it('should create an error with message and status code', () => {
    const error = new CustomError('Test error', 400)

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(CustomError)
    expect(error.message).toBe('Test error')
    expect(error.statusCode).toBe(400)
    expect(error.details).toBeUndefined()
  })

  it('should create an error with message, status code and details', () => {
    const error = new CustomError('Validation failed', 422, 'Email is required')

    expect(error.message).toBe('Validation failed')
    expect(error.statusCode).toBe(422)
    expect(error.details).toBe('Email is required')
  })

  it('should create a 404 error', () => {
    const error = new CustomError('Resource not found', 404, 'User with id 123 not found')

    expect(error.statusCode).toBe(404)
    expect(error.message).toBe('Resource not found')
    expect(error.details).toBe('User with id 123 not found')
  })

  it('should create a 500 error', () => {
    const error = new CustomError('Internal server error', 500)

    expect(error.statusCode).toBe(500)
    expect(error.message).toBe('Internal server error')
  })

  it('should maintain error prototype chain', () => {
    const error = new CustomError('Test', 400)

    expect(Object.getPrototypeOf(error)).toBe(CustomError.prototype)
  })

  it('should have error stack trace', () => {
    const error = new CustomError('Test error', 400)

    expect(error.stack).toBeDefined()
    expect(error.stack).toContain('Test error')
  })

  it('should be catchable in try-catch', () => {
    expect(() => {
      throw new CustomError('Test error', 400)
    }).toThrow(CustomError)

    expect(() => {
      throw new CustomError('Test error', 400)
    }).toThrow('Test error')
  })
})
