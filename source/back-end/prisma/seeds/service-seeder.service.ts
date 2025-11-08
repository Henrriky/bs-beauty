import { prismaClient } from '@/lib/prisma'
import { generateServicesData, type ServiceSeedData } from './data/services.data'
import { BaseSeederService } from './base-seeder.service'
import type { Service } from '@prisma/client'

export class ServiceSeederService extends BaseSeederService<ServiceSeedData, Service> {
  constructor() {
    super({
      entityName: 'service',
      context: 'ServiceSeederService',
      getData: generateServicesData,
      findExisting: (data) => prismaClient.service.findFirst({
        where: { name: data.name }
      }),
      createEntity: (data) => prismaClient.service.create({
        data: {
          name: data.name,
          description: data.description,
          category: data.category,
          status: data.status
        }
      }),
      updateEntity: (existing, data) => prismaClient.service.update({
        where: { id: existing.id },
        data: {
          description: data.description,
          category: data.category,
          status: data.status
        }
      }),
      getIdentifier: (data) => data.name
    })
  }

  async seedServices(): Promise<void> {
    return this.seed()
  }

  async verifyServices(): Promise<boolean> {
    return this.verifyEntities(
      generateServicesData,
      async (data) => {
        const names = data.map((s) => s.name)
        return prismaClient.service.findMany({
          where: { name: { in: names } },
          select: { name: true }
        })
      },
      (s) => s.name,
      (data) => data.name
    )
  }
}

export const serviceSeeder = new ServiceSeederService()
