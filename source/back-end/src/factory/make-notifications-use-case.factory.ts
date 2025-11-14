import { PrismaNotificationRepository } from '../repository/prisma/prisma-notification.repository'
import { NotificationsUseCase } from '../services/notifications.use-case'
import { PrismaProfessionalRepository } from '../repository/prisma/prisma-professional.repository'

function makeNotificationsUseCaseFactory () {
  const repository = new PrismaNotificationRepository()
  const professionalRepository = new PrismaProfessionalRepository()
  const useCase = new NotificationsUseCase(repository, professionalRepository)

  return useCase
}

export { makeNotificationsUseCaseFactory }
