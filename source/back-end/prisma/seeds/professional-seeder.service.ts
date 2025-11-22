import { prismaClient } from '@/lib/prisma'
import { generateProfessionalsData, type ProfessionalSeedData } from './data/professionals.data'
import { BaseSeederService } from './base-seeder.service'
import type { Professional } from '@prisma/client'

export class ProfessionalSeederService extends BaseSeederService<ProfessionalSeedData, Professional> {
  constructor() {
    super({
      entityName: 'professional',
      context: 'ProfessionalSeederService',
      getData: generateProfessionalsData,
      findExisting: (data) => prismaClient.professional.findUnique({
        where: { email: data.email }
      }),
      createEntity: (data) => prismaClient.professional.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash: data.passwordHash,
          googleId: data.googleId,
          specialization: data.specialization,
          contact: data.contact,
          paymentMethods: data.paymentMethods,
          isCommissioned: data.isCommissioned,
          commissionRate: data.commissionRate,
          socialMedia: data.socialMedia ?? undefined,
          registerCompleted: data.registerCompleted,
          userType: data.userType
        }
      }),
      updateEntity: (existing, data) => prismaClient.professional.update({
        where: { email: data.email },
        data: {
          name: data.name,
          googleId: data.googleId,
          specialization: data.specialization,
          paymentMethods: data.paymentMethods,
          isCommissioned: data.isCommissioned,
          commissionRate: data.commissionRate,
          socialMedia: data.socialMedia ?? undefined
        }
      }),
      getIdentifier: (data) => data.name
    })
  }

  async seedProfessionals(): Promise<void> {
    return this.seed()
  }

  async verifyProfessionals(): Promise<boolean> {
    return this.verifyEntities(
      generateProfessionalsData,
      async (data) => {
        const emails = data.map((p) => p.email)
        return prismaClient.professional.findMany({
          where: { email: { in: emails } },
          select: { email: true, name: true }
        })
      },
      (p) => p.email,
      (data) => data.email
    )
  }
}

export const professionalSeeder = new ProfessionalSeederService()
