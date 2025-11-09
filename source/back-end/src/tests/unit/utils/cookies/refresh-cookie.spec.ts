import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
  REFRESH_COOKIE_NAME,
  getRefreshCookieOptions,
  setRefreshCookie
} from '@/utils/cookies/refresh-cookie'
import type { Response } from 'express'

describe('Refresh Cookie Utils', () => {
  describe('REFRESH_COOKIE_NAME', () => {
    it('should have correct cookie name', () => {
      expect(REFRESH_COOKIE_NAME).toBe('refresh_token')
    })
  })

  describe('getRefreshCookieOptions', () => {
    const originalEnv = process.env.NODE_ENV

    beforeEach(() => {
      process.env.NODE_ENV = originalEnv
    })

    it('should return secure options in production', () => {
      process.env.NODE_ENV = 'production'

      const options = getRefreshCookieOptions()

      expect(options).toEqual({
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        domain: undefined
      })
    })

    it('should return non-secure options in development', () => {
      process.env.NODE_ENV = 'development'

      const options = getRefreshCookieOptions()

      expect(options).toEqual({
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        domain: undefined
      })
    })

    it('should return non-secure options when NODE_ENV is not production', () => {
      process.env.NODE_ENV = 'test'

      const options = getRefreshCookieOptions()

      expect(options.secure).toBe(false)
    })

    it('should always set httpOnly to true', () => {
      process.env.NODE_ENV = 'production'
      const prodOptions = getRefreshCookieOptions()

      process.env.NODE_ENV = 'development'
      const devOptions = getRefreshCookieOptions()

      expect(prodOptions.httpOnly).toBe(true)
      expect(devOptions.httpOnly).toBe(true)
    })

    it('should always set sameSite to lax', () => {
      const options = getRefreshCookieOptions()

      expect(options.sameSite).toBe('lax')
    })

    it('should always set path to /', () => {
      const options = getRefreshCookieOptions()

      expect(options.path).toBe('/')
    })

    it('should always set domain to undefined', () => {
      const options = getRefreshCookieOptions()

      expect(options.domain).toBeUndefined()
    })
  })

  describe('setRefreshCookie', () => {
    it('should call res.cookie with correct parameters', () => {
      const cookieMock = vi.fn()
      const res = {
        cookie: cookieMock
      } as unknown as Response

      const refreshToken = 'test-refresh-token-123'
      const maxAgeMs = 7 * 24 * 60 * 60 * 1000 // 7 days

      setRefreshCookie(res, refreshToken, maxAgeMs)

      expect(cookieMock).toHaveBeenCalledOnce()
      expect(cookieMock).toHaveBeenCalledWith(
        'refresh_token',
        'test-refresh-token-123',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: maxAgeMs
        })
      )
    })

    it('should include maxAge in cookie options', () => {
      const cookieMock = vi.fn()
      const res = {
        cookie: cookieMock
      } as unknown as Response

      const maxAgeMs = 3600000 // 1 hour

      setRefreshCookie(res, 'token', maxAgeMs)

      const callArgs = cookieMock.mock.calls[0]
      expect(callArgs[2]).toHaveProperty('maxAge', maxAgeMs)
    })

    it('should set cookie with different max ages', () => {
      const cookieMock = vi.fn()
      const res = {
        cookie: cookieMock
      } as unknown as Response

      // 1 day
      setRefreshCookie(res, 'token1', 24 * 60 * 60 * 1000)
      expect(cookieMock.mock.calls[0][2].maxAge).toBe(24 * 60 * 60 * 1000)

      // 7 days
      setRefreshCookie(res, 'token2', 7 * 24 * 60 * 60 * 1000)
      expect(cookieMock.mock.calls[1][2].maxAge).toBe(7 * 24 * 60 * 60 * 1000)

      // 30 days
      setRefreshCookie(res, 'token3', 30 * 24 * 60 * 60 * 1000)
      expect(cookieMock.mock.calls[2][2].maxAge).toBe(30 * 24 * 60 * 60 * 1000)
    })

    it('should work in production environment', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const cookieMock = vi.fn()
      const res = {
        cookie: cookieMock
      } as unknown as Response

      setRefreshCookie(res, 'secure-token', 7200000)

      expect(cookieMock).toHaveBeenCalled()
      expect(cookieMock.mock.calls[0][2].secure).toBe(true)

      process.env.NODE_ENV = originalEnv
    })

    it('should work in development environment', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      const cookieMock = vi.fn()
      const res = {
        cookie: cookieMock
      } as unknown as Response

      setRefreshCookie(res, 'dev-token', 3600000)

      expect(cookieMock).toHaveBeenCalled()
      expect(cookieMock.mock.calls[0][2].secure).toBe(false)

      process.env.NODE_ENV = originalEnv
    })
  })
})
