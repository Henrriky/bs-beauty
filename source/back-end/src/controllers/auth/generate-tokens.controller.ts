import { makeGenerateTokensUseCase } from '@/factory/auth/make-generate-tokens.use-case.factory'
import { GenerateTokensUseCase } from '@/services/use-cases/auth/generate-tokens.use-case'
import { type NextFunction, type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'

function extractRefreshToken(req: Request): string | null {
  const auth = req.get('authorization')
  if (auth) {
    const parts = auth.trim().split(' ')
    const bearerPart = parts[0]?.toLowerCase()
    if (bearerPart === 'bearer') {
      if (parts[1]) return parts[1]
    }
  }
  return req.get('x-refresh-token') ?? null
}

export class GenerateTokensController {
  static async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const incomingRefreshJwt = extractRefreshToken(req)
      if (!incomingRefreshJwt) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send({ message: 'Missing refresh token' })
      }

      const usecase = makeGenerateTokensUseCase()

      const { accessToken, refreshToken: newRefreshToken } = await usecase.execute(incomingRefreshJwt)

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
