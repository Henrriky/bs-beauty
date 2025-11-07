import { PrismaClient } from '@prisma/client'
import { AppLoggerInstance } from '../../src/utils/logger/logger.util'
import { generateShiftsData } from './data/shifts.data'

export class ShiftSeederService {
  private readonly logger = AppLoggerInstance

  constructor(private readonly prismaClient: PrismaClient) { }

  async seedShifts(): Promise<void> {
    this.logger.info('[SHIFT SEED] Starting shift seeding...')

    const shifts = generateShiftsData()
    let createdCount = 0
    let updatedCount = 0

    for (const shift of shifts) {
      const professional = await this.prismaClient.professional.findFirst({
        where: { name: shift.professionalName }
      })

      if (!professional) {
        this.logger.warn(`[SHIFT SEED] Professional not found: ${shift.professionalName}`)
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
          data: {
            isBusy: shift.isBusy
          }
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

    this.logger.info(
      `[SHIFT SEED] Shift seeding completed: ${createdCount} created, ${updatedCount} updated`
    )
  }

  async verifyShifts(): Promise<void> {
    this.logger.info('[SHIFT SEED] Verifying shifts...')

    const shifts = generateShiftsData()
    const professionalNames = [...new Set(shifts.map(s => s.professionalName))]

    for (const professionalName of professionalNames) {
      const professional = await this.prismaClient.professional.findFirst({
        where: { name: professionalName }
      })

      if (!professional) {
        this.logger.warn(`[SHIFT SEED] Professional not found: ${professionalName}`)
        continue
      }

      const shiftsCount = await this.prismaClient.shift.count({
        where: { professionalId: professional.id }
      })

      this.logger.info(
        `[SHIFT SEED] Professional "${professionalName}" has ${shiftsCount} shifts`
      )
    }

    this.logger.info('[SHIFT SEED] Shift verification completed')
  }
}

import { prismaClient } from '../../src/lib/prisma'

export const shiftSeeder = new ShiftSeederService(prismaClient)
