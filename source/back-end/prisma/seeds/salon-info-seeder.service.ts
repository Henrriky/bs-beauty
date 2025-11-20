import { prismaClient } from '@/lib/prisma'
import { AppLoggerInstance } from '@/utils/logger/logger.util'

export class SalonInfoServiceSeeder {
  private readonly logger = AppLoggerInstance

  async seedSalonInfo (): Promise<void> {
    this.logger.info('Starting salon info seeding process', {
      context: 'SalonInfoServiceSeeder'
    })

    try {
      const existingSalonInfo = await prismaClient.salonInfo.findFirst()

      if (existingSalonInfo) {
        this.logger.info('Salon info already exists. Skipping seeding.', {
          context: 'SalonInfoServiceSeeder'
        })
        return
      }

      await prismaClient.salonInfo.create({
        data: {
          name: 'BS Beauty Academy',
          salonAddress: 'Rua Luís Pitta, 206 - Cidade São Mateus, São Paulo - SP',
          salonPhoneNumber: '',
          salonEmail: ''
        }
      })

      this.logger.info('Salon info seeding completed successfully', {
        context: 'SalonInfoServiceSeeder'
      })
    } catch (error) {
      const errorDetails = error instanceof Error ? error : undefined

      this.logger.error('Failed to seed salon info', errorDetails, {
        context: 'SalonInfoServiceSeeder'
      })
      throw error
    }
  }
}

export const salonInfoSeeder = new SalonInfoServiceSeeder()
