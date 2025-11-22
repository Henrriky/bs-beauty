import { generateCustomersData, type CustomerSeedData } from './data/customers.data'
import { prismaClient } from '@/lib/prisma'
import { BaseSeederService } from './base-seeder.service'
import type { Customer } from '@prisma/client'

export class CustomerSeederService extends BaseSeederService<CustomerSeedData, Customer> {
  constructor() {
    super({
      entityName: 'customer',
      context: 'CustomerSeederService',
      getData: generateCustomersData,
      findExisting: (data) => prismaClient.customer.findUnique({
        where: { email: data.email }
      }),
      createEntity: (data) => prismaClient.customer.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash: data.passwordHash,
          phone: data.phone,
          birthdate: data.birthdate,
          registerCompleted: data.registerCompleted,
          userType: data.userType,
          referralCount: data.referralCount,
          alwaysAllowImageUse: data.alwaysAllowImageUse,
          discoverySource: data.discoverySource,
          notificationPreference: data.notificationPreference
        }
      }),
      updateEntity: (existing, data) => prismaClient.customer.update({
        where: { email: data.email },
        data: {
          name: data.name,
          birthdate: data.birthdate,
          referralCount: data.referralCount,
          alwaysAllowImageUse: data.alwaysAllowImageUse,
          discoverySource: data.discoverySource,
          notificationPreference: data.notificationPreference
        }
      }),
      getIdentifier: (data) => data.name
    })
  }

  async seedCustomers(): Promise<void> {
    return this.seed()
  }

  async verifyCustomers(): Promise<boolean> {
    return this.verifyEntities(
      generateCustomersData,
      async (data) => {
        const emails = data.map((c) => c.email)
        return prismaClient.customer.findMany({
          where: { email: { in: emails } },
          select: { email: true, name: true }
        })
      },
      (c) => c.email,
      (data) => data.email
    )
  }
}

export const customerSeeder = new CustomerSeederService()
