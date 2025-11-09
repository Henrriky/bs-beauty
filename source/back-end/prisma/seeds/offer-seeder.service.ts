import { prismaClient } from '@/lib/prisma'
import { AppLoggerInstance } from '@/utils/logger/logger.util'
import { generateOffersData, type OfferSeedData } from './data/offers.data'

export class OfferSeederService {
  private readonly logger = AppLoggerInstance

  async seedOffers(): Promise<void> {
    this.logger.info('Starting offer seeding process', {
      context: 'OfferSeederService'
    })

    try {
      const offersToSeed = generateOffersData()

      this.logger.info(`Found ${offersToSeed.length} offers to process`, {
        context: 'OfferSeederService',
        offersCount: offersToSeed.length
      })

      let createdCount = 0
      let existingCount = 0
      let updatedCount = 0

      for (const offerData of offersToSeed) {
        const service = await prismaClient.service.findFirst({
          where: { name: offerData.serviceName }
        })

        if (!service) {
          this.logger.warn(`Service not found: ${offerData.serviceName}`, {
            context: 'OfferSeederService'
          })
          continue
        }

        const professional = await prismaClient.professional.findFirst({
          where: { name: offerData.professionalName }
        })

        if (!professional) {
          this.logger.warn(`Professional not found: ${offerData.professionalName}`, {
            context: 'OfferSeederService'
          })
          continue
        }

        const existingOffer = await prismaClient.offer.findFirst({
          where: {
            serviceId: service.id,
            professionalId: professional.id
          }
        })

        if (!existingOffer) {
          await prismaClient.offer.create({
            data: {
              estimatedTime: offerData.estimatedTime,
              price: offerData.price,
              isOffering: offerData.isOffering,
              serviceId: service.id,
              professionalId: professional.id
            }
          })
          createdCount++

          this.logger.info(`Created offer: ${service.name} by ${professional.name}`, {
            context: 'OfferSeederService',
            price: offerData.price,
            estimatedTime: offerData.estimatedTime
          })
        } else {
          await prismaClient.offer.update({
            where: { id: existingOffer.id },
            data: {
              estimatedTime: offerData.estimatedTime,
              price: offerData.price,
              isOffering: offerData.isOffering
            }
          })
          updatedCount++
          existingCount++

          this.logger.info(`Updated existing offer: ${service.name} by ${professional.name}`, {
            context: 'OfferSeederService',
            price: offerData.price
          })
        }
      }

      this.logger.info('Offer seeding completed successfully', {
        context: 'OfferSeederService',
        createdCount,
        existingCount,
        updatedCount,
        totalProcessed: offersToSeed.length
      })
    } catch (error) {
      const errorDetails = error instanceof Error ? error : undefined

      this.logger.error('Failed to seed offers', errorDetails, {
        context: 'OfferSeederService'
      })
      throw error
    }
  }

  async verifyOffers(): Promise<boolean> {
    try {
      const offersData = generateOffersData()
      let validCount = 0

      for (const offerData of offersData) {
        const service = await prismaClient.service.findFirst({
          where: { name: offerData.serviceName }
        })

        const professional = await prismaClient.professional.findFirst({
          where: { name: offerData.professionalName }
        })

        if (!service || !professional) {
          continue
        }

        const existingOffer = await prismaClient.offer.findFirst({
          where: {
            serviceId: service.id,
            professionalId: professional.id
          }
        })

        if (existingOffer) {
          validCount++
        }
      }

      if (validCount < offersData.length) {
        this.logger.warn('Missing offers found in database', {
          context: 'OfferSeederService',
          missingCount: offersData.length - validCount,
          totalExpected: offersData.length
        })
        return false
      }

      this.logger.info('All offers verified - database is up to date', {
        context: 'OfferSeederService',
        totalOffers: offersData.length
      })
      return true
    } catch (error) {
      const errorDetails = error instanceof Error ? error : undefined

      this.logger.error('Failed to verify offers', errorDetails, {
        context: 'OfferSeederService'
      })
      return false
    }
  }
}

export const offerSeeder = new OfferSeederService()
