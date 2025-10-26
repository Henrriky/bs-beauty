import { PrismaNotificationTemplateRepository } from '@/repository/prisma/prisma-notification-template.repository'
import { NotificationTemplateUseCase } from '@/services/notifications-template.use-case'

function makeNotificationTemplatesUseCaseFactory () {
  const repository = new PrismaNotificationTemplateRepository()
  const useCase = new NotificationTemplateUseCase(repository)

  return useCase
}

export { makeNotificationTemplatesUseCaseFactory }
