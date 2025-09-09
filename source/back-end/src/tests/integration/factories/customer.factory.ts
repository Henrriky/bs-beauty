import { prismaClient } from '@/lib/prisma'
import { faker } from '@faker-js/faker'
import { type Customer, type Prisma } from '@prisma/client'

export class CustomerFactory {
  static async makeCustomer (data: Partial<Prisma.CustomerCreateInput> = {}): Promise<Customer> {
    const customer = await prismaClient.customer.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        profilePhotoUrl: faker.image.urlLoremFlickr({ category: 'people' }),
        registerCompleted: data.registerCompleted ?? true,
        ...data
      }

    })

    return customer
  }
}
