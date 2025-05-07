import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { makeLoginUseCase } from '../../factory/make-login-use-case.factory'

class LoginController {
  public static async handle (req: Request, res: Response) {
    try {
      const authorizationHeader = req.headers.authorization
      const googleAccessToken = ((authorizationHeader?.split(' ')) != null) ? authorizationHeader?.split(' ')[1] : null
      if (googleAccessToken == null) {
        res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Please, send google access token to login' })
        return
      }

      const usecase = makeLoginUseCase()

      const { accessToken } = await usecase.execute({
        token: googleAccessToken
      })

      res.status(StatusCodes.OK).send({ accessToken })
    } catch (error: any) {
      console.error(`Error trying to login.\nReason: ${error?.message}`)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error trying to login, please check back-end logs...' })
    }
  }
}

export { LoginController }
