import { prismaClient } from '@/lib/prisma'
import { AppLoggerInstance } from '@/utils/logger/logger.util'
import { generateProfessionalsData, type ProfessionalSeedData } from './data/professionals.data'

export class ProfessionalSeederService {
  private readonly logger = AppLoggerInstance

  async seedProfessionals(): Promise<void> {
    this.logger.info('Starting professional seeding process', {
      context: 'ProfessionalSeederService'
    })

    try {
      const professionalsToSeed = generateProfessionalsData()

      this.logger.info(`Found ${professionalsToSeed.length} professionals to process`, {
        context: 'ProfessionalSeederService',
        professionalsCount: professionalsToSeed.length
      })

      let createdCount = 0
      let existingCount = 0
      let updatedCount = 0

      for (const professionalData of professionalsToSeed) {
        const existingProfessional = await prismaClient.professional.findUnique({
          where: {
            email: professionalData.email
          }
        })

        if (!existingProfessional) {
          await prismaClient.professional.create({
            data: {
              name: professionalData.name,
              email: professionalData.email,
              passwordHash: professionalData.passwordHash,
              googleId: professionalData.googleId,
              specialization: professionalData.specialization,
              contact: professionalData.contact,
              paymentMethods: professionalData.paymentMethods,
              isCommissioned: professionalData.isCommissioned,
              commissionRate: professionalData.commissionRate,
              socialMedia: professionalData.socialMedia ?? undefined,
              registerCompleted: professionalData.registerCompleted,
              userType: professionalData.userType
            }
          })
          createdCount++

          this.logger.info(`Created professional: ${professionalData.name}`, {
            context: 'ProfessionalSeederService',
            email: professionalData.email,
            specialization: professionalData.specialization
          })
        } else {
          await prismaClient.professional.update({
            where: { email: professionalData.email },
            data: {
              name: professionalData.name,
              googleId: professionalData.googleId,
              specialization: professionalData.specialization,
              paymentMethods: professionalData.paymentMethods,
              isCommissioned: professionalData.isCommissioned,
              commissionRate: professionalData.commissionRate,
              socialMedia: professionalData.socialMedia ?? undefined
            }
          })
          updatedCount++
          existingCount++

          this.logger.info(`Updated existing professional: ${professionalData.name}`, {
            context: 'ProfessionalSeederService',
            email: professionalData.email
          })
        }
      }

      this.logger.info('Professional seeding completed successfully', {
        context: 'ProfessionalSeederService',
        createdCount,
        existingCount,
        updatedCount,
        totalProcessed: professionalsToSeed.length
      })
    } catch (error) {
      const errorDetails = error instanceof Error ? error : undefined

      this.logger.error('Failed to seed professionals', errorDetails, {
        context: 'ProfessionalSeederService'
      })
      throw error
    }
  }

  async verifyProfessionals(): Promise<boolean> {
    try {
      const professionalsData = generateProfessionalsData()
      const existingProfessionals = await prismaClient.professional.findMany({
        where: {
          email: {
            in: professionalsData.map((p: ProfessionalSeedData) => p.email)
          }
        },
        select: {
          email: true,
          name: true
        }
      })

      const existingEmails = new Set(existingProfessionals.map((p: { email: string }) => p.email))
      const missingProfessionals = professionalsData.filter(
        (p: ProfessionalSeedData) => !existingEmails.has(p.email)
      )

      if (missingProfessionals.length > 0) {
        this.logger.warn('Missing professionals found in database', {
          context: 'ProfessionalSeederService',
          missingCount: missingProfessionals.length,
          missingProfessionals: missingProfessionals.map((p: ProfessionalSeedData) => p.email)
        })
        return false
      }

      this.logger.info('All professionals verified - database is up to date', {
        context: 'ProfessionalSeederService',
        totalProfessionals: professionalsData.length
      })
      return true
    } catch (error) {
      const errorDetails = error instanceof Error ? error : undefined

      this.logger.error('Failed to verify professionals', errorDetails, {
        context: 'ProfessionalSeederService'
      })
      return false
    }
  }
}

export const professionalSeeder = new ProfessionalSeederService()
