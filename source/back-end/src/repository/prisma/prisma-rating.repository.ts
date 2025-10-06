import { type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type RatingRepository } from '../protocols/rating.repository'

class PrismaRatingRepository implements RatingRepository {
  public async findAll () {
    const ratings = await prismaClient.rating.findMany()
    return ratings
  }

  public async findById (ratingId: string) {
    const rating = await prismaClient.rating.findUnique({
      where: {
        id: ratingId
      }
    })

    return rating
  }

  public async findByAppointmentId (appointmentId: string) {
    const rating = await prismaClient.rating.findUnique({
      where: {
        appointmentId: appointmentId
      }
    })

    return rating
  }
  
  public async create (newRating: Prisma.RatingCreateInput) {
    const rating = await prismaClient.rating.create({
      data: { ...newRating }
    })
    return rating
  }

  public async update (ratingId: string, updatedRating: Prisma.RatingUpdateInput) {
    const rating = await prismaClient.rating.update({
      where: {
        id: ratingId
      },
      data: { ...updatedRating }
    })
    return rating
  }

  public async delete (ratingId: string) {
    const rating = await prismaClient.rating.delete({
      where: {
        id: ratingId
      }
    })
    return rating
  }

  public async getMeanScore() {
    const result = await prismaClient.rating.aggregate({
      _avg: { score: true }
    });
    return result._avg.score ?? 0;
  }
}

export { PrismaRatingRepository }
