// controllers/auth/logout.controller.ts
import { type Request, type Response, type NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { REFRESH_COOKIE_NAME, getRefreshCookieOptions } from '@/utils/cookies/refresh-cookie'
import { RedisCacheProvider } from '@/services/cache/redis-cache-provider.service'
import { RefreshTokenService } from '@/services/encrypter/refresh-token.service'

export class LogoutController {
  static async handle (req: Request, res: Response, next: NextFunction) {
    try {
      const refreshJwt = req.cookies?.[REFRESH_COOKIE_NAME]
      const cache = new RedisCacheProvider()
      const refreshTokens = new RefreshTokenService(cache)

      if (refreshJwt) {
        try {
          await refreshTokens.revokeByJwt(refreshJwt)
        } catch (e) {
          console.warn('[LOGOUT] Falha ao revogar:', (e as Error)?.message)
        }
      } else {
        console.log('[LOGOUT] Cookie de refresh ausente')
      }

      res.clearCookie(REFRESH_COOKIE_NAME, getRefreshCookieOptions())
      res.cookie(REFRESH_COOKIE_NAME, '', { ...getRefreshCookieOptions(), maxAge: 0, expires: new Date(0) })
      return res.status(StatusCodes.NO_CONTENT).send()
    } catch (err) {
      next(err)
    }
  }
}
