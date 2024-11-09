import { type WeekDays, type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type ShiftRepository } from '../protocols/shift.repository'

class PrismaShiftRepository implements ShiftRepository {
  public async findAll () {
    const shifts = await prismaClient.shift.findMany()

    return shifts
  }

  public async findById (id: string) {
    const shift = await prismaClient.shift.findUnique({
      where: { id }
    })

    return shift
  }

  public async findByEmployeeId (employeeId: string | undefined) {
    const shifts = await prismaClient.shift.findMany({
      where: { employeeId }
    })

    return shifts
  }

  public async findByEmployeeAndWeekDay (employeeId: string, weekDay: WeekDays) {
    const shift = await prismaClient.shift.findFirst({
      where: { employeeId, weekDay }
    })

    return shift
  }

  public async create (shiftToCreate: Prisma.ShiftCreateInput) {
    const newShift = await prismaClient.shift.create({
      data: { ...shiftToCreate }
    })

    return newShift
  }

  public async update (id: string, shiftToUpdate: Prisma.ShiftUpdateInput) {
    const updatedShift = await prismaClient.shift.update({
      where: { id },
      data: { ...shiftToUpdate }
    })

    return updatedShift
  }

  public async delete (id: string) {
    const deletedShift = await prismaClient.shift.delete({
      where: { id }
    })

    return deletedShift
  }
}

export { PrismaShiftRepository }
