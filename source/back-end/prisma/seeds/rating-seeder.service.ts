import { PrismaClient } from '@prisma/client'
import { AppLoggerInstance } from '../../src/utils/logger/logger.util'
import { generateRatingsData } from './data/ratings.data'

export class RatingSeederService {
  private readonly logger = AppLoggerInstance

  constructor(private readonly prismaClient: PrismaClient) { }

  async seedRatings(): Promise<void> {
    this.logger.info('[RATING SEED] Starting rating seeding...')

    const appointments = await this.prismaClient.appointment.findMany({
      where: {
        status: 'FINISHED'
      },
      include: {
        offer: {
          include: {
            professional: {
              select: {
                name: true
              }
            },
            service: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    const appointmentsData = appointments.map(apt => ({
      id: apt.id,
      status: apt.status,
      professionalName: apt.offer.professional.name ?? 'Profissional',
      serviceName: apt.offer.service.name
    }))

    const ratings = generateRatingsData(appointmentsData)
    let createdCount = 0
    let skippedCount = 0

    for (const rating of ratings) {
      const existingRating = await this.prismaClient.rating.findUnique({
        where: { appointmentId: rating.appointmentId }
      })

      if (existingRating) {
        this.logger.info(`[RATING SEED] Rating already exists for appointment: ${rating.appointmentId}`)
        skippedCount++
        continue
      }

      await this.prismaClient.rating.create({
        data: {
          score: rating.score,
          comment: rating.comment,
          appointmentId: rating.appointmentId
        }
      })

      createdCount++
    }

    this.logger.info(
      `[RATING SEED] Rating seeding completed: ${createdCount} created, ${skippedCount} skipped`
    )
  }

  async verifyRatings(): Promise<void> {
    this.logger.info('[RATING SEED] Verifying ratings...')

    const totalRatings = await this.prismaClient.rating.count()
    const totalFinishedAppointments = await this.prismaClient.appointment.count({
      where: { status: 'FINISHED' }
    })

    const ratingsByScore = await this.prismaClient.rating.groupBy({
      by: ['score'],
      _count: {
        score: true
      },
      orderBy: {
        score: 'desc'
      }
    })

    const ratingsWithComments = await this.prismaClient.rating.count({
      where: {
        comment: {
          not: null
        }
      }
    })

    this.logger.info(`[RATING SEED] Total ratings: ${totalRatings}`)
    this.logger.info(`[RATING SEED] Total finished appointments: ${totalFinishedAppointments}`)
    this.logger.info(
      `[RATING SEED] Rating coverage: ${totalFinishedAppointments > 0 ? ((totalRatings / totalFinishedAppointments) * 100).toFixed(1) : 0}%`
    )
    this.logger.info(`[RATING SEED] Ratings with comments: ${ratingsWithComments}`)

    for (const scoreGroup of ratingsByScore) {
      this.logger.info(
        `[RATING SEED] Score ${scoreGroup.score}: ${scoreGroup._count.score} ratings`
      )
    }

    this.logger.info('[RATING SEED] Rating verification completed')
  }
}

import { prismaClient } from '../../src/lib/prisma'

export const ratingSeeder = new RatingSeederService(prismaClient)
