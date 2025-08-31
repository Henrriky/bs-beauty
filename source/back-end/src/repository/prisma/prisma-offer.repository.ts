import { Status, type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type OfferRepository } from '../protocols/offer.repository'
import { type PaginatedRequest } from '../../types/pagination'
import { type OffersFilters } from '../../types/offers/offers-filters'
import { type FetchValidAppointmentsByProfessionalOnDay } from '../types/offer-repository.types'

class PrismaOfferRepository implements OfferRepository {
  public async findAll() {
    const offers = await prismaClient.offer.findMany()

    return offers
  }

  public async findById(id: string) {
    const offer = await prismaClient.offer.findUnique({
      where: { id }
    })

    return offer
  }

  public async findByServiceId(serviceId: string) {
    const offer = await prismaClient.offer.findFirst({
      where: { serviceId }
    })

    return offer
  }

  public async findByProfessionalId(professionalId: string) {
    const offers = await prismaClient.offer.findMany({
      where: { professionalId }
    })

    return offers
  }

  public async findByProfessionalAndServiceId(serviceId: string, professionalId: string) {
    const offer = await prismaClient.offer.findFirst({
      where: { serviceId, professionalId }
    })

    return offer
  }

  public async create(offerToCreate: Prisma.OfferCreateInput) {
    const newOffer = await prismaClient.offer.create({
      data: { ...offerToCreate }
    })

    return newOffer
  }

  public async update(id: string, offerToUpdate: Prisma.OfferUpdateInput) {
    const updatedOffer = await prismaClient.offer.update({
      where: { id },
      data: { ...offerToUpdate }
    })

    return updatedOffer
  }

  public async delete(id: string) {
    const deletedOffer = await prismaClient.offer.delete({
      where: { id }
    })

    return deletedOffer
  }

  public async fetchValidAppointmentsByProfessionalOnDay(professionalId: string, dayToFetchAvailableSchedulling: Date) {
    const startOfDay = new Date(dayToFetchAvailableSchedulling)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(dayToFetchAvailableSchedulling)
    endOfDay.setHours(23, 59, 59, 999)

    const validAppointmentsByProfessionalOnDay = await prismaClient.offer.findMany({
      where: {
        isOffering: true,
        professionalId
      },
      select: {
        professionalId: true,
        estimatedTime: true,
        appointments: {
          where: {
            appointmentDate: {
              gte: startOfDay,
              lte: endOfDay
            },
            status: {
              in: [Status.PENDING, Status.RESCHEDULED, Status.CONFIRMED, Status.FINISHED]
            }
          }
        }
      }
    })

    if (validAppointmentsByProfessionalOnDay == null) {
      return {
        validAppointmentsOnDay: null
      }
    }

    const validAppointmentsOnDay = validAppointmentsByProfessionalOnDay.reduce(
      (acc: Array<FetchValidAppointmentsByProfessionalOnDay[0]>, offer) => {
        if (offer.appointments.length > 0) {
          acc.push(...offer.appointments.map(appointment => {
            return {
              id: appointment.id,
              observation: appointment.observation,
              status: appointment.status,
              appointmentDate: appointment.appointmentDate,
              appointmentId: appointment.id,
              estimatedTime: offer.estimatedTime
            }
          }))
        }

        return acc
      }, [])

    return {
      validAppointmentsOnDay
    }
  }

  public async findByProfessionalIdPaginated(
    professionalId: string,
    params: PaginatedRequest<OffersFilters>
  ) {
    const { page, limit } = params
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      prismaClient.offer.findMany({
        where: { professionalId },
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' }
      }),
      prismaClient.offer.count({
        where: { professionalId }
      })
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

export { PrismaOfferRepository }
