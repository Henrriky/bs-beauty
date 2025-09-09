import { prismaClient } from '@/lib/prisma'
import { faker } from '@faker-js/faker'
import { Prisma, type Professional } from '@prisma/client'

export class ProfessionalFactory {
  static async makeProfessional (data: Partial<Prisma.ProfessionalCreateInput> = {}): Promise<Professional> {
    const professional = await prismaClient.professional.create({
      data: {
        name: data.name ?? faker.person.fullName(),
        email: data.email ?? faker.internet.email(),
        socialMedia: data.socialMedia === null ? Prisma.JsonNull : data.socialMedia ?? { name: faker.internet.displayName(), url: faker.internet.url() },
        profilePhotoUrl: data.profilePhotoUrl ?? faker.image.urlLoremFlickr({ category: 'people' }),
        registerCompleted: data.registerCompleted ?? true,
        ...data
      }
    })

    return professional
  }
}
