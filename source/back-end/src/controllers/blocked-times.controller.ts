import { makeBlockedTimesUseCaseFactory } from '@/factory/make-blocked-times-use-case.factory'
import { blockedtimesQuerySchema } from '@/utils/validation/zod-schemas/pagination/blocked-times/blocked-times-query.schema'
import { type Prisma } from '@prisma/client'
import { type Request, type Response, type NextFunction } from 'express'

class BlockedTimesController {
  static useCase = makeBlockedTimesUseCaseFactory()

  public static async handleFindAllPaginated (req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = blockedtimesQuerySchema.parse(req.query)
      const { page, limit, ...filters } = parsed
      const { userId, userType, permissions } = req.user
      const result = await BlockedTimesController.useCase.executeFindAllPaginated(
        {
          userId,
          userType,
          permissions,
          extra: {
            page,
            limit,
            filters
          }
        }
      )

      res.send(result)
    } catch (error) {
      next(error)
    }
  }

  public static async handleCreate (req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as Prisma.BlockedTimeCreateInput

      await BlockedTimesController.useCase.executeCreate({
        ...req.user,
        extra: data
      })

      res.status(201).send()
    } catch (error) {
      next(error)
    }
  }

  public static async handleUpdate (req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as Prisma.BlockedTimeUpdateInput
      const blockedTimeId = req.params.id

      const blockedTimeUpdated = await BlockedTimesController.useCase.executeUpdate(
        blockedTimeId,
        {
          ...req.user,
          extra: data
        }
      )

      res.status(200).send(blockedTimeUpdated)
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindById (req: Request, res: Response, next: NextFunction) {
    try {
      const blockedTimeId = req.params.id

      const blockedTime = await BlockedTimesController.useCase.executeFindById(
        {
          ...req.user,
          extra: {
            blockedTimeId
          }
        }
      )

      res.status(200).send(blockedTime)
    } catch (error) {
      next(error)
    }
  }

  public static async handleDelete (req: Request, res: Response, next: NextFunction) {
    try {
      const blockedTimeId = req.params.id

      await BlockedTimesController.useCase.executeDelete(
        {
          ...req.user,
          extra: {
            blockedTimeId
          }
        }
      )

      res.status(200).send()
    } catch (error) {
      next(error)
    }
  }
}

export { BlockedTimesController }
