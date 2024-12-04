import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { formatValidationErrors } from '../../utils/formatting/zod-validation-errors.formatting.util'
import { InvalidRoleUseCaseError } from '../../services/use-cases/errors/invalid-role-use-case-error'
import { makeFetchUserInfoUseCase } from '../../factory/auth/make-fetch-user-info.use-case.factory.ts'

class FetchUserInfoController {
  public static async handle (req: Request, res: Response) {
    try {
      if (req.user.registerCompleted) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'User already complete register' })
        return
      }

      const usecase = makeFetchUserInfoUseCase()

      await usecase.execute({
        userId: req.user.id,
        role: req.user.role
      })

      res.status(StatusCodes.NO_CONTENT).send()
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        formatValidationErrors(error, res)
        return
      }
      if (error instanceof InvalidRoleUseCaseError) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: error.message })
        return
      }
      console.error(`Error trying to fetch user info.\nReason: ${error?.message}`)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error trying to fetch user info, please check back-end logs...' })
    }
  }
}

export { FetchUserInfoController }
