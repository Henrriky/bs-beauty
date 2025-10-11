import { type Response, type Request, type NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { makeLoginUseCase } from '../../factory/make-login-use-case.factory'
import { z } from 'zod'
import { setRefreshCookie } from '@/utils/cookies/refresh-cookie'

const PasswordLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000

class LoginController {
  public static async handle (req: Request, res: Response, next: NextFunction) {
    try {
      const authorizationHeader = req.headers.authorization
      const googleAccessToken = ((authorizationHeader?.split(' ')) != null) ? authorizationHeader?.split(' ')[1] : null
      const usecase = makeLoginUseCase()

      if (googleAccessToken) {
        const { accessToken, refreshToken } = await usecase.execute({
          token: googleAccessToken
        })

        setRefreshCookie(res, refreshToken, REFRESH_TOKEN_MAX_AGE)

        res.status(StatusCodes.OK).send({ accessToken, refreshToken })
        return
      } else {
        const parsed = PasswordLoginSchema.safeParse(req.body)
        if (!parsed.success) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: 'Email and password are required for login' })
          return
        }
        const { email, password } = parsed.data
        const { accessToken, refreshToken } = await usecase.execute({ email, password })

        setRefreshCookie(res, refreshToken, REFRESH_TOKEN_MAX_AGE)

        res.status(StatusCodes.OK).send({ accessToken, refreshToken })
        return
      }
    } catch (error: any) {
      console.error(`Error trying to login.\nReason: ${error?.message}`)
      next(error)
    }
  }
}

export { LoginController }
