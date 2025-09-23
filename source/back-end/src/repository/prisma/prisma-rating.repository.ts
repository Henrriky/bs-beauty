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

  // public async fetchProfessionalsOfferingRating (ratingId: string) {
  //   const professionalsOfferingRatingRaw = await prismaClient.rating.findUnique({
  //     where: {
  //       id: ratingId
  //     },
  //     select: {
  //       id: true,
  //       offers: {
  //         where: {
  //           isOffering: true
  //         },
  //         select: {
  //           id: true,
  //           estimatedTime: true,
  //           price: true,
  //           professional: {
  //             select: {
  //               id: true,
  //               name: true,
  //               specialization: true,
  //               profilePhotoUrl: true,
  //               paymentMethods: true
  //             }
  //           }
  //         }
  //       }
  //     }
  //   })

  //   let professionalsOfferingRating: any = null
  //   if (professionalsOfferingRatingRaw != null) {
  //     professionalsOfferingRating = {
  //       id: professionalsOfferingRatingRaw.id,
  //       offers: professionalsOfferingRatingRaw.offers.map((offer: any) => ({
  //         id: offer.id,
  //         estimatedTime: offer.estimatedTime,
  //         price: offer.price,
  //         professional: {
  //           id: offer.professional.id,
  //           name: offer.professional.name,
  //           specialization: offer.professional.specialization,
  //           profilePhotoUrl: offer.professional.profilePhotoUrl,
  //           paymentMethods: Array.isArray(offer.professional.paymentMethods)
  //             ? offer.professional.paymentMethods
  //             : []
  //         }
  //       }))
  //     }
  //   }

  //   return { professionalsOfferingRating }
  // }

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
}

export { PrismaRatingRepository }
