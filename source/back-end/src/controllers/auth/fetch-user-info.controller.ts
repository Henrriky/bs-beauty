import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { formatValidationErrors } from '../../utils/formatting/zod-validation-errors.formatting.util'
import { InvalidUserTypeUseCaseError } from '../../services/use-cases/errors/invalid-user-type-use-case-error'
import { makeFetchUserInfoUseCase } from '../../factory/auth/make-fetch-user-info.use-case.factory.ts'
import { NotFoundUseCaseError } from '../../services/use-cases/errors/not-found-error'

class FetchUserInfoController {
  public static async handle(req: Request, res: Response) {
    try {
      const usecase = makeFetchUserInfoUseCase()

      const { user } = await usecase.execute({
        email: req.user.email,
        userType: req.user.userType
      })

      res.status(StatusCodes.OK).send({ user })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        formatValidationErrors(error, res)
        return
      }
      if (error instanceof InvalidUserTypeUseCaseError) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: error.message })
        return
      } else if (error instanceof NotFoundUseCaseError) {
        res.status(StatusCodes.NOT_FOUND).send({ message: error.message })
        return
      }
      console.error(`Error trying to fetch user info.\nReason: ${error?.message}`)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error trying to fetch user info, please check back-end logs...' })
    }
  }
}

export { FetchUserInfoController }
