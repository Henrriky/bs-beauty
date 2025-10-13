import { makeGenerateTokensUseCase } from '@/factory/auth/make-generate-tokens.use-case.factory'
import { REFRESH_COOKIE_NAME, setRefreshCookie } from '@/utils/cookies/refresh-cookie'
import { type NextFunction, type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'

const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000 

class GenerateTokensController {
  static async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const incomingRefreshJwt = req.cookies && req.cookies[REFRESH_COOKIE_NAME]

      if (!incomingRefreshJwt) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send({ message: 'Missing refresh token' })
      }

      const usecase = makeGenerateTokensUseCase()

      const { accessToken, refreshToken: newRefreshToken } = await usecase.execute(incomingRefreshJwt)
      setRefreshCookie(res, newRefreshToken, REFRESH_TOKEN_MAX_AGE)

      return res
        .status(StatusCodes.OK)
        .send({ accessToken, refreshToken: newRefreshToken })
    } catch (err: any) {
      const code =
        err?.message === 'REUSED_OR_REVOKED' || err?.message === 'INVALID_OR_EXPIRED'
          ? StatusCodes.UNAUTHORIZED
          : StatusCodes.UNAUTHORIZED

      const message =
        err?.message === 'REUSED_OR_REVOKED'
          ? 'Refresh token reused or revoked'
          : 'Invalid refresh token'

      return res.status(code).send({ message })
    }
  }
}

export { GenerateTokensController }