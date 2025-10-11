import { makeNotificationTemplatesUseCaseFactory } from '@/factory/make-notification-templates-use-case.factory'
import { formatValidationErrors } from '@/utils/formatting/zod-validation-errors.formatting.util'
import { notificationTemplateQuerySchema } from '@/utils/validation/zod-schemas/pagination/notification-templates/notification-templates-query.schema'
import { Prisma } from '@prisma/client'
import { type NextFunction, type Request, type Response } from 'express'
import z from 'zod'

const normalizeKey = (k: string) => k.toUpperCase().trim()

class NotificationTemplatesController {

  public static async handleFindAll(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeNotificationTemplatesUseCaseFactory()
      const parsed = notificationTemplateQuerySchema.parse(req.query)
      const { page, limit, ...filters } = parsed

      const result = await useCase.executeFindAll({
        page,
        limit,
        filters
      })
      res.send(result)
    } catch (error) {
      if (error instanceof z.ZodError) {
        formatValidationErrors(error, res); return
      }
      next(error)
    }
  }

  public static async handleUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const key = normalizeKey(req.params.key)
      const notificationTemplateToUpdate: Prisma.NotificationTemplateUpdateInput = req.body
      const useCase = makeNotificationTemplatesUseCaseFactory()
      const updated = await useCase.executeUpdate(key, notificationTemplateToUpdate)

      return res.status(200).send(updated)
    } catch (error) {
      if (error instanceof z.ZodError) {
        formatValidationErrors(error, res); return
      }
      next(error)
    }
  }

}

export { NotificationTemplatesController }
