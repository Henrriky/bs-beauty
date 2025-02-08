import { PrismaNotificationRepository } from '../repository/prisma/prisma-notification.repository'
import { NotificationsUseCase } from '../services/notifications.use-case'

function makeNotificationsUseCaseFactory () {
  const repository = new PrismaNotificationRepository()
  const useCase = new NotificationsUseCase(repository)

  return useCase
}

export { makeNotificationsUseCaseFactory }
