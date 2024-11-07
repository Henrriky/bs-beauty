import type { Notification, Prisma } from '@prisma/client'

interface NotificationRepository {
  findAll: () => Promise<Notification[]>
  findById: (notificationId: string) => Promise<Notification | null>
  create: (notificationToCreate: Prisma.NotificationCreateInput) => Promise<Notification>
  delete: (notificationId: string) => Promise<Notification>
  markAsRead: (notificationId: string) => Promise<Notification>
}

export type { NotificationRepository }
