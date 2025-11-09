import { PrismaClient } from '@prisma/client'
import { generateShiftsData } from './data/shifts.data'
import { BaseRelationSeederService } from './base-relation-seeder.service'

export class ShiftSeederService extends BaseRelationSeederService {
  private readonly entityName = 'shift'

  constructor(private readonly prismaClient: PrismaClient) {
    super()
  }

  async seedShifts(): Promise<void> {
    this.logSeedingStart(this.entityName)

    const shifts = generateShiftsData()
    let createdCount = 0
    let updatedCount = 0

    for (const shift of shifts) {
      const professional = await this.prismaClient.professional.findFirst({
        where: { name: shift.professionalName }
      })

      if (!professional) {
        this.logWarning(this.entityName, `Professional not found: ${shift.professionalName}`)
        continue
      }

      const existingShift = await this.prismaClient.shift.findFirst({
        where: {
          professionalId: professional.id,
          weekDay: shift.weekDay,
          shiftStart: shift.shiftStart,
          shiftEnd: shift.shiftEnd
        }
      })

      if (existingShift) {
        await this.prismaClient.shift.update({
          where: { id: existingShift.id },
          data: { isBusy: shift.isBusy }
        })
        updatedCount++
      } else {
        await this.prismaClient.shift.create({
          data: {
            weekDay: shift.weekDay,
            isBusy: shift.isBusy,
            shiftStart: shift.shiftStart,
            shiftEnd: shift.shiftEnd,
            professionalId: professional.id
          }
        })
        createdCount++
      }
    }

    this.logSeedingComplete(this.entityName, { createdCount, updatedCount })
  }

  async verifyShifts(): Promise<void> {
    this.logVerificationStart(this.entityName)

    const shifts = generateShiftsData()
    const professionalNames = [...new Set(shifts.map(s => s.professionalName))]

    for (const professionalName of professionalNames) {
      const professional = await this.prismaClient.professional.findFirst({
        where: { name: professionalName }
      })

      if (!professional) {
        this.logWarning(this.entityName, `Professional not found: ${professionalName}`)
        continue
      }

      const shiftsCount = await this.prismaClient.shift.count({
        where: { professionalId: professional.id }
      })

      this.logInfo(this.entityName, `Professional "${professionalName}" has ${shiftsCount} shifts`)
    }

    this.logVerificationComplete(this.entityName)
  }
}

import { prismaClient } from '../../src/lib/prisma'

export const shiftSeeder = new ShiftSeederService(prismaClient)
