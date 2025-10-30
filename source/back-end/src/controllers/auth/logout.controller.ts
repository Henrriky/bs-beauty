import { makeLogoutUseCase } from '@/factory/auth/make-logout-use-case.factory'
import { REFRESH_COOKIE_NAME, getRefreshCookieOptions } from '@/utils/cookies/refresh-cookie'
import { type NextFunction, type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'

class LogoutController {
  static async handle (req: Request, res: Response, next: NextFunction) {
    try {
      const refreshJwt = req.cookies?.[REFRESH_COOKIE_NAME]

      const usecase = makeLogoutUseCase()
      await usecase.execute(refreshJwt)

      res.clearCookie(REFRESH_COOKIE_NAME, getRefreshCookieOptions())
      res.cookie(REFRESH_COOKIE_NAME, '', { ...getRefreshCookieOptions(), maxAge: 0, expires: new Date(0) })
      return res.status(StatusCodes.NO_CONTENT).send()
    } catch (err) {
      next(err)
    }
  }
}

export { LogoutController }
