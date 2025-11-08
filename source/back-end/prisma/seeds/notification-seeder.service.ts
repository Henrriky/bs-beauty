import { PrismaClient } from '@prisma/client'
import { generateNotificationsData } from './data/notifications.data'
import { BaseRelationSeederService } from './base-relation-seeder.service'

export class NotificationSeederService extends BaseRelationSeederService {
  private readonly entityName = 'notification'

  constructor(private readonly prismaClient: PrismaClient) {
    super()
  }

  async seedNotifications(): Promise<void> {
    this.logSeedingStart(this.entityName)

    const appointments = await this.prismaClient.appointment.findMany({
      include: {
        customer: { select: { id: true, name: true } },
        offer: {
          include: {
            professional: { select: { id: true, name: true } },
            service: { select: { name: true } }
          }
        }
      }
    })

    const appointmentsData = appointments.map(apt => ({
      id: apt.id,
      status: apt.status,
      appointmentDate: apt.appointmentDate,
      customerId: apt.customerId,
      professionalId: apt.offer.professionalId,
      customerName: apt.customer.name ?? 'Cliente',
      professionalName: apt.offer.professional.name ?? 'Profissional',
      serviceName: apt.offer.service.name
    }))

    const notifications = generateNotificationsData(appointmentsData)
    let createdCount = 0
    let skippedCount = 0

    for (const notification of notifications) {
      const existingNotification = await this.prismaClient.notification.findUnique({
        where: { marker: notification.marker }
      })

      if (existingNotification) {
        this.logInfo(this.entityName, `Notification already exists: ${notification.marker}`)
        skippedCount++
        continue
      }

      await this.prismaClient.notification.create({
        data: {
          marker: notification.marker,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          recipientId: notification.recipientId,
          recipientType: notification.recipientType,
          readAt: notification.readAt
        }
      })

      createdCount++
    }

    this.logSeedingComplete(this.entityName, { createdCount, skippedCount })
  }

  async verifyNotifications(): Promise<void> {
    this.logVerificationStart(this.entityName)

    const totalNotifications = await this.prismaClient.notification.count()

    const notificationsByType = await this.prismaClient.notification.groupBy({
      by: ['type'],
      _count: { type: true }
    })

    const notificationsByRecipientType = await this.prismaClient.notification.groupBy({
      by: ['recipientType'],
      _count: { recipientType: true }
    })

    this.logInfo(this.entityName, `Total notifications: ${totalNotifications}`)

    for (const typeGroup of notificationsByType) {
      this.logInfo(this.entityName, `Type "${typeGroup.type}": ${typeGroup._count.type} notifications`)
    }

    for (const recipientGroup of notificationsByRecipientType) {
      this.logInfo(
        this.entityName,
        `Recipient type "${recipientGroup.recipientType}": ${recipientGroup._count.recipientType} notifications`
      )
    }

    this.logVerificationComplete(this.entityName)
  }
}

import { prismaClient } from '../../src/lib/prisma'

export const notificationSeeder = new NotificationSeederService(prismaClient)
