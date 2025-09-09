import { prismaClient } from '@/lib/prisma'
import { faker } from '@faker-js/faker'
import { type Service, type Prisma } from '@prisma/client'

export class ServiceFactory {
  static async makeService (data: Partial<Prisma.ServiceCreateInput> = {}): Promise<Service> {
    const service = await prismaClient.service.create({
      data: {
        name: faker.commerce.productName(),
        category: faker.commerce.department(),
        ...data
      }

    })

    return service
  }
}
