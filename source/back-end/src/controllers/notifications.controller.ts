import { type NextFunction, type Request, type Response } from 'express'
import { makeNotificationsUseCaseFactory } from '../factory/make-notifications-use-case.factory'
import { notificationQuerySchema } from '@/utils/validation/zod-schemas/pagination/notifications/notifications-query.schema'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'

const markManySchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(1000)
})

class NotificationsController {
  public static async handleFindAll (req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req
      const parsed = notificationQuerySchema.parse(req.query)
      const { page, limit, ...filters } = parsed

      const useCase = makeNotificationsUseCaseFactory()
      const result = await useCase.executeFindAll(
        user,
        {
          page,
          limit,
          filters
        }
      )

      res.status(StatusCodes.OK).send(result)
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindById (req: Request, res: Response, next: NextFunction) {
    try {
      const notificationId = req.params.id
      const useCase = makeNotificationsUseCaseFactory()
      const notification = await useCase.executeFindById(notificationId)

      res.send(notification)
    } catch (error) {
      next(error)
    }
  }

  public static async handleDeleteMany (req: Request, res: Response, next: NextFunction) {
    try {
      const { ids } = markManySchema.parse(req.body)
      const userId = req.user.id
      const useCase = makeNotificationsUseCaseFactory()
      const result = await useCase.executeDeleteMany(ids, userId)

      return res.send(result)
    } catch (error) {
      next(error)
    }
  }

  public static async handleMarkManyAsRead (req: Request, res: Response, next: NextFunction) {
    try {
      const { ids } = markManySchema.parse(req.body)
      const userId = req.user.id
      const useCase = makeNotificationsUseCaseFactory()
      const result = await useCase.executeMarkManyAsRead(ids, userId)

      return res.send(result)
    } catch (error) {
      next(error)
    }
  }
}

export { NotificationsController }
