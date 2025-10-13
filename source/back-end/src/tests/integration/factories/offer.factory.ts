import { prismaClient } from '@/lib/prisma'
import { faker } from '@faker-js/faker'
import { type Offer, type Prisma } from '@prisma/client'
import { ProfessionalFactory } from './professional.factory'
import { ServiceFactory } from './service.factory'

export class OfferFactory {
  static async makeOffer (data: Partial<Prisma.OfferCreateInput> = {}): Promise<Offer> {
    const offer = await prismaClient.offer.create({
      data: {
        price: faker.number.int({ min: 50, max: 500 }),
        estimatedTime: faker.number.int({ min: 30, max: 180 }),
        isOffering: true,
        professional: data.professional ?? {
          connect: {
            id: (await ProfessionalFactory.makeProfessional()).id
          }
        },
        service: data.service ?? {
          connect: {
            id: (await ServiceFactory.makeService()).id
          }
        },
        ...data
      }
    })

    return offer
  }
}
