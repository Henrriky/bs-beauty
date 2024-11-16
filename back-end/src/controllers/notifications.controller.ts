import { type NextFunction, type Request, type Response } from 'express'
import { makeNotificationsUseCaseFactory } from '../factory/make-notifications-use-case.factory'
import { type Prisma } from '@prisma/client'

class NotificationsController {
  public static async handleFindAll (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeNotificationsUseCaseFactory()
      const { notifications } = await useCase.executeFindAll()

      res.send({ notifications })
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

  public static async handleFindByUserId (req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId
      const useCase = makeNotificationsUseCaseFactory()
      const { notifications } = await useCase.executeFindByUserId(userId)

      res.send({ notifications })
    } catch (error) {
      next(error)
    }
  }

  public static async handleCreate (req: Request, res: Response, next: NextFunction) {
    try {
      const notificationToCreate: Prisma.NotificationCreateInput = req.body
      const useCase = makeNotificationsUseCaseFactory()
      const newNotification = await useCase.executeCreate(notificationToCreate)

      res.send(newNotification)
    } catch (error) {
      next(error)
    }
  }

  public static async handleDelete (req: Request, res: Response, next: NextFunction) {
    try {
      const notificationId: string = req.params.id
      const useCase = makeNotificationsUseCaseFactory()
      const deletedNotification = await useCase.executeDelete(notificationId)

      res.send(deletedNotification)
    } catch (error) {
      next(error)
    }
  }

  public static async handleMarkAsRead (req: Request, res: Response, next: NextFunction) {
    try {
      const notificationId: string = req.params.id
      const useCase = makeNotificationsUseCaseFactory()
      const readNotification = await useCase.executeMarkAsRead(notificationId)

      res.send(readNotification)
    } catch (error) {
      next(error)
    }
  }
}

export { NotificationsController }
