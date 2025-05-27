import { type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type NotificationRepository } from '../protocols/notification.repository'

class PrismaNotificationRepository implements NotificationRepository {
  public async findAll () {
    const notifications = await prismaClient.notification.findMany()

    return notifications
  }

  public async findById (id: string) {
    const notification = await prismaClient.notification.findUnique({
      where: { id }
    })

    return notification
  }

  public async findByUserId (userId: string) {
    const notifications = await prismaClient.notification.findMany({
      where: { OR: [{ customerId: userId }, { employeeId: userId }] }
    })

    return notifications
  }

  public async create (notificationToCreate: Prisma.NotificationCreateInput) {
    const newNotification = await prismaClient.notification.create({
      data: { ...notificationToCreate }
    })

    return newNotification
  }

  public async delete (id: string) {
    const deletedNotification = await prismaClient.notification.delete({
      where: { id }
    })

    return deletedNotification
  }

  public async markAsRead (id: string) {
    const readNotification = await prismaClient.notification.update({
      where: { id },
      data: { readAt: new Date() }
    })

    return readNotification
  }
}

export { PrismaNotificationRepository }
