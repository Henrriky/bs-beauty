import { prismaClient } from '@/lib/prisma'
import { AppLoggerInstance } from '@/utils/logger/logger.util'
import { generateServicesData, type ServiceSeedData } from './data/services.data'

export class ServiceSeederService {
  private readonly logger = AppLoggerInstance

  async seedServices(): Promise<void> {
    this.logger.info('Starting service seeding process', {
      context: 'ServiceSeederService'
    })

    try {
      const servicesToSeed = generateServicesData()

      this.logger.info(`Found ${servicesToSeed.length} services to process`, {
        context: 'ServiceSeederService',
        servicesCount: servicesToSeed.length
      })

      let createdCount = 0
      let existingCount = 0
      let updatedCount = 0

      for (const serviceData of servicesToSeed) {
        const existingService = await prismaClient.service.findFirst({
          where: {
            name: serviceData.name
          }
        })

        if (!existingService) {
          await prismaClient.service.create({
            data: {
              name: serviceData.name,
              description: serviceData.description,
              category: serviceData.category,
              status: serviceData.status
            }
          })
          createdCount++

          this.logger.info(`Created service: ${serviceData.name}`, {
            context: 'ServiceSeederService',
            category: serviceData.category
          })
        } else {
          await prismaClient.service.update({
            where: { id: existingService.id },
            data: {
              description: serviceData.description,
              category: serviceData.category,
              status: serviceData.status
            }
          })
          updatedCount++
          existingCount++

          this.logger.info(`Updated existing service: ${serviceData.name}`, {
            context: 'ServiceSeederService',
            category: serviceData.category
          })
        }
      }

      this.logger.info('Service seeding completed successfully', {
        context: 'ServiceSeederService',
        createdCount,
        existingCount,
        updatedCount,
        totalProcessed: servicesToSeed.length
      })
    } catch (error) {
      const errorDetails = error instanceof Error ? error : undefined

      this.logger.error('Failed to seed services', errorDetails, {
        context: 'ServiceSeederService'
      })
      throw error
    }
  }

  async verifyServices(): Promise<boolean> {
    try {
      const servicesData = generateServicesData()
      const existingServices = await prismaClient.service.findMany({
        where: {
          name: {
            in: servicesData.map((s: ServiceSeedData) => s.name)
          }
        },
        select: {
          name: true
        }
      })

      const existingNames = new Set(existingServices.map((s: { name: string }) => s.name))
      const missingServices = servicesData.filter(
        (s: ServiceSeedData) => !existingNames.has(s.name)
      )

      if (missingServices.length > 0) {
        this.logger.warn('Missing services found in database', {
          context: 'ServiceSeederService',
          missingCount: missingServices.length,
          missingServices: missingServices.map((s: ServiceSeedData) => s.name)
        })
        return false
      }

      this.logger.info('All services verified - database is up to date', {
        context: 'ServiceSeederService',
        totalServices: servicesData.length
      })
      return true
    } catch (error) {
      const errorDetails = error instanceof Error ? error : undefined

      this.logger.error('Failed to verify services', errorDetails, {
        context: 'ServiceSeederService'
      })
      return false
    }
  }
}

export const serviceSeeder = new ServiceSeederService()
