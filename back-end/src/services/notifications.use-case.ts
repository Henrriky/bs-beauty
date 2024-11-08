import { type Prisma, type Notification } from '@prisma/client'
import { type NotificationRepository } from '../repository/protocols/notification.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'

interface NotificationsOutput {
  notifications: Notification[]
}

class NotificationsUseCase {
  constructor (private readonly notificationRepository: NotificationRepository) { }

  public async executeFindAll (): Promise<NotificationsOutput> {
    const notifications = await this.notificationRepository.findAll()
    RecordExistence.validateManyRecordsExistence(notifications, 'notifications')

    return { notifications }
  }

  public async executeFindById (notificationId: string): Promise<Notification | null> {
    const notification = await this.notificationRepository.findById(notificationId)
    RecordExistence.validateRecordExistence(notification, 'Notification')

    return notification
  }

  public async executeCreate (notificationToCreate: Prisma.NotificationCreateInput) {
    const newNotification = await this.notificationRepository.create(notificationToCreate)

    return newNotification
  }

  public async executeDelete (notificationId: string) {
    await this.executeFindById(notificationId)
    const deletedNotification = await this.notificationRepository.delete(notificationId)

    return deletedNotification
  }

  public async executeMarkAsRead (notificationId: string) {
    const notification = await this.executeFindById(notificationId)
    if (notification?.readAt != null) {
      return notification
    }
    const readNotification = await this.notificationRepository.markAsRead(notificationId)

    return readNotification
  }
}

export { NotificationsUseCase }
