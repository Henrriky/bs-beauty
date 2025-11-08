import { PrismaClient } from '@prisma/client'
import { generateRatingsData } from './data/ratings.data'
import { BaseRelationSeederService } from './base-relation-seeder.service'

export class RatingSeederService extends BaseRelationSeederService {
  private readonly entityName = 'rating'

  constructor(private readonly prismaClient: PrismaClient) {
    super()
  }

  async seedRatings(): Promise<void> {
    this.logSeedingStart(this.entityName)

    const appointments = await this.prismaClient.appointment.findMany({
      where: { status: 'FINISHED' },
      include: {
        offer: {
          include: {
            professional: { select: { name: true } },
            service: { select: { name: true } }
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
        this.logInfo(this.entityName, `Rating already exists for appointment: ${rating.appointmentId}`)
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

    this.logSeedingComplete(this.entityName, { createdCount, skippedCount })
  }

  async verifyRatings(): Promise<void> {
    this.logVerificationStart(this.entityName)

    const totalRatings = await this.prismaClient.rating.count()
    const totalFinishedAppointments = await this.prismaClient.appointment.count({
      where: { status: 'FINISHED' }
    })

    const ratingsByScore = await this.prismaClient.rating.groupBy({
      by: ['score'],
      _count: { score: true },
      orderBy: { score: 'desc' }
    })

    const ratingsWithComments = await this.prismaClient.rating.count({
      where: { comment: { not: null } }
    })

    this.logInfo(this.entityName, `Total ratings: ${totalRatings}`)
    this.logInfo(this.entityName, `Total finished appointments: ${totalFinishedAppointments}`)
    this.logInfo(
      this.entityName,
      `Rating coverage: ${totalFinishedAppointments > 0 ? ((totalRatings / totalFinishedAppointments) * 100).toFixed(1) : 0}%`
    )
    this.logInfo(this.entityName, `Ratings with comments: ${ratingsWithComments}`)

    for (const scoreGroup of ratingsByScore) {
      this.logInfo(this.entityName, `Score ${scoreGroup.score}: ${scoreGroup._count.score} ratings`)
    }

    this.logVerificationComplete(this.entityName)
  }
}

import { prismaClient } from '../../src/lib/prisma'

export const ratingSeeder = new RatingSeederService(prismaClient)
