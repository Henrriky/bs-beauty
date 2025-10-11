// utils/cookies/refresh-cookie.ts
import { type Response } from 'express'
import type { CookieOptions } from 'express'

export const REFRESH_COOKIE_NAME = 'refresh_token'

export function getRefreshCookieOptions (): CookieOptions {
  const isProd = process.env.NODE_ENV === 'production'

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    domain: undefined
  }
}

export function setRefreshCookie (res: Response, refreshToken: string, maxAgeMs: number) {
  const options = getRefreshCookieOptions()
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, { ...options, maxAge: maxAgeMs })
}
