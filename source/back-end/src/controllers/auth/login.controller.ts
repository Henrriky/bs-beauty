import { type Response, type Request, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { makeLoginUseCase } from '../../factory/make-login-use-case.factory'

class LoginController {
  public static async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const authorizationHeader = req.headers.authorization
      const googleAccessToken = ((authorizationHeader?.split(' ')) != null) ? authorizationHeader?.split(' ')[1] : null

      if (googleAccessToken) {
        const usecase = makeLoginUseCase()
        const { accessToken } = await usecase.execute({
          token: googleAccessToken
        })
        res.status(StatusCodes.OK).send({ accessToken })
        return
      } else {
        const { email, password } = req.body

        if (!email || !password) {
          res.status(StatusCodes.BAD_REQUEST).send({ message: 'Email and password are required for login' })
          return
        }
        const usecase = makeLoginUseCase()
        const { accessToken } = await usecase.execute({ email, password })
        res.status(StatusCodes.OK).send({ accessToken })
        return
      }

    } catch (error: any) {
      console.error(`Error trying to login.\nReason: ${error?.message}`)
      next(error)
    }
  }
}

export { LoginController }
