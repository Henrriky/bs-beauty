import { type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type RatingRepository } from '../protocols/rating.repository'
import { type PartialRatingQuerySchema } from '@/utils/validation/zod-schemas/pagination/ratings/ratings-query.schema'

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

  public async fetchProfessionalsOfferingRating (ratingId: string) {
    const professionalsOfferingRatingRaw = await prismaClient.rating.findUnique({
      where: {
        id: ratingId
      },
      select: {
        id: true,
        offers: {
          where: {
            isOffering: true
          },
          select: {
            id: true,
            estimatedTime: true,
            price: true,
            professional: {
              select: {
                id: true,
                name: true,
                specialization: true,
                profilePhotoUrl: true,
                paymentMethods: true
              }
            }
          }
        }
      }
    })

    let professionalsOfferingRating: any = null
    if (professionalsOfferingRatingRaw != null) {
      professionalsOfferingRating = {
        id: professionalsOfferingRatingRaw.id,
        offers: professionalsOfferingRatingRaw.offers.map((offer: any) => ({
          id: offer.id,
          estimatedTime: offer.estimatedTime,
          price: offer.price,
          professional: {
            id: offer.professional.id,
            name: offer.professional.name,
            specialization: offer.professional.specialization,
            profilePhotoUrl: offer.professional.profilePhotoUrl,
            paymentMethods: Array.isArray(offer.professional.paymentMethods)
              ? offer.professional.paymentMethods
              : []
          }
        }))
      }
    }

    return { professionalsOfferingRating }
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

  public async findAllPaginated (
    params: PaginatedRequest<PartialRatingQuerySchema>
  ) {
    const { page, limit, filters } = params
    const skip = (page - 1) * limit

    const where: Prisma.RatingWhereInput = {
      name: (filters.name != null) ? { contains: filters.name } : undefined,
      category: (filters.category != null) ? { contains: filters.category } : undefined,
      OR: (filters.q != null)
        ? [
            {
              name: {
                contains: filters.q
              }
            },
            {
              description: {
                contains: filters.q
              }
            },
            {
              offers: {
                some: {
                  professional: {
                    name: {
                      contains: filters.q
                    }
                  }
                }
              }
            }
          ]
        : undefined
    }

    const [data, total] = await Promise.all([
      prismaClient.rating.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        where
      }),
      prismaClient.rating.count({ where })
    ])

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit
    }
  }
}

export { PrismaRatingRepository }
