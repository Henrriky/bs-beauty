import { prismaClient } from '@/lib/prisma'
import { faker } from '@faker-js/faker'
import { type BlockedTime, type Prisma } from '@prisma/client'
import { ProfessionalFactory } from './professional.factory'
import * as luxon from 'luxon'

export class BlockedTimeFactory {
  static async makeBlockedTime (data: Partial<Prisma.BlockedTimeCreateInput> = {}): Promise<BlockedTime> {
    const ONE_HOUR_IN_MS = 3600000

    const startDate = faker.date.soon()
    const endDate = new Date(startDate.getTime() + ONE_HOUR_IN_MS)
    const startTime = faker.date.soon().getTime()
    const endTime = (startTime + ONE_HOUR_IN_MS)

    const blockedTime = await prismaClient.blockedTime.create({
      data: {
        reason: faker.lorem.sentence().slice(0, 49),
        startDate: luxon.DateTime.fromJSDate(startDate).toJSDate(),
        endDate: luxon.DateTime.fromJSDate(endDate).toJSDate(),
        startTime: luxon.DateTime.fromMillis(startTime).toJSDate(),
        endTime: luxon.DateTime.fromMillis(endTime).toJSDate(),
        monday: faker.datatype.boolean(),
        tuesday: faker.datatype.boolean(),
        wednesday: faker.datatype.boolean(),
        thursday: faker.datatype.boolean(),
        friday: faker.datatype.boolean(),
        saturday: faker.datatype.boolean(),
        sunday: faker.datatype.boolean(),
        professional: data.professional ?? {
          connect: {
            id: (await ProfessionalFactory.makeProfessional()).id
          }
        },
        ...data
      }
    })

    return blockedTime
  }
}
