import { PrismaClient } from '@prisma/client'
import { AppLoggerInstance } from '../../src/utils/logger/logger.util'
import { generateNotificationTemplatesData } from './data/notification-templates.data'

export class NotificationTemplateSeederService {
  private readonly logger = AppLoggerInstance

  constructor(private readonly prismaClient: PrismaClient) { }

  async seedNotificationTemplates(): Promise<void> {
    this.logger.info('[NOTIFICATION TEMPLATE SEED] Starting notification template seeding...')

    const templates = generateNotificationTemplatesData()
    let createdCount = 0
    let updatedCount = 0

    for (const template of templates) {
      const existingTemplate = await this.prismaClient.notificationTemplate.findUnique({
        where: { key: template.key }
      })

      if (existingTemplate) {
        await this.prismaClient.notificationTemplate.update({
          where: { key: template.key },
          data: {
            name: template.name,
            description: template.description,
            title: template.title,
            body: template.body,
            isActive: template.isActive,
            variables: template.variables
          }
        })
        updatedCount++
      } else {
        await this.prismaClient.notificationTemplate.create({
          data: {
            key: template.key,
            name: template.name,
            description: template.description,
            title: template.title,
            body: template.body,
            isActive: template.isActive,
            variables: template.variables
          }
        })
        createdCount++
      }
    }

    this.logger.info(
      `[NOTIFICATION TEMPLATE SEED] Notification template seeding completed: ${createdCount} created, ${updatedCount} updated`
    )
  }

  async verifyNotificationTemplates(): Promise<void> {
    this.logger.info('[NOTIFICATION TEMPLATE SEED] Verifying notification templates...')

    const totalTemplates = await this.prismaClient.notificationTemplate.count()

    this.logger.info(
      `[NOTIFICATION TEMPLATE SEED] Total notification templates: ${totalTemplates}`
    )

    const templates = generateNotificationTemplatesData()
    for (const template of templates) {
      const exists = await this.prismaClient.notificationTemplate.findUnique({
        where: { key: template.key }
      })

      if (exists) {
        this.logger.info(
          `[NOTIFICATION TEMPLATE SEED] Template "${template.key}" exists`
        )
      } else {
        this.logger.warn(
          `[NOTIFICATION TEMPLATE SEED] Template "${template.key}" not found`
        )
      }
    }

    this.logger.info('[NOTIFICATION TEMPLATE SEED] Notification template verification completed')
  }
}

import { prismaClient } from '../../src/lib/prisma'

export const notificationTemplateSeeder = new NotificationTemplateSeederService(prismaClient)
