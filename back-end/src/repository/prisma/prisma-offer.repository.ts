import { Status, type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type OfferRepository } from '../protocols/offer.repository'

class PrismaOfferRepository implements OfferRepository {
  public async findAll () {
    const offers = await prismaClient.offer.findMany()

    return offers
  }

  public async findById (id: string) {
    const offer = await prismaClient.offer.findUnique({
      where: { id }
    })

    return offer
  }

  public async findByServiceId (serviceId: string) {
    const offer = await prismaClient.offer.findFirst({
      where: { serviceId }
    })

    return offer
  }

  public async findByEmployeeId (employeeId: string) {
    const offers = await prismaClient.offer.findMany({
      where: { employeeId }
    })

    return offers
  }

  public async findByEmployeeAndServiceId (serviceId: string, employeeId: string) {
    const offer = await prismaClient.offer.findFirst({
      where: { serviceId, employeeId }
    })

    return offer
  }

  public async create (offerToCreate: Prisma.OfferCreateInput) {
    const newOffer = await prismaClient.offer.create({
      data: { ...offerToCreate }
    })

    return newOffer
  }

  public async update (id: string, offerToUpdate: Prisma.OfferUpdateInput) {
    const updatedOffer = await prismaClient.offer.update({
      where: { id },
      data: { ...offerToUpdate }
    })

    return updatedOffer
  }

  public async delete (id: string) {
    const deletedOffer = await prismaClient.offer.delete({
      where: { id }
    })

    return deletedOffer
  }

  public async fetchValidAppointmentsByOfferAndDay (serviceOfferingId: string, dayToFetchAvailableSchedulling: Date) {
    const startOfDay = new Date(dayToFetchAvailableSchedulling)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(dayToFetchAvailableSchedulling)
    endOfDay.setHours(23, 59, 59, 999)

    const validAppointmentsToOfferOnDay = await prismaClient.offer.findUnique({
      where: {
        id: serviceOfferingId,
        isOffering: true
      },
      select: {
        id: true,
        price: true,
        isOffering: true,
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

    if (validAppointmentsToOfferOnDay == null) {
      return {
        validAppointmentsToOfferOnDay: null
      }
    }

    return {
      validAppointmentsToOfferOnDay
    }
  }
}

export { PrismaOfferRepository }
