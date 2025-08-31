import { type WeekDays, type Prisma, Shift } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type ShiftRepository } from '../protocols/shift.repository'

class PrismaShiftRepository implements ShiftRepository {
  public async findAllByProfessionalId(professionalId: string | undefined) {
    const shifts = await prismaClient.shift.findMany({
      where: { professionalId }
    })

    return shifts
  }

  public async findById(id: string) {
    const shift = await prismaClient.shift.findUnique({
      where: { id }
    })

    return shift
  }

  async findByIdAndProfessionalId(id: string, professionalId: string) {
    const shift = await prismaClient.shift.findFirst({
      where: { id, professionalId }
    })
    return shift
  }

  public async findByProfessionalId(professionalId: string | undefined) {
    const shifts = await prismaClient.shift.findMany({
      where: { professionalId }
    })

    return shifts
  }

  public async findByProfessionalAndWeekDay(professionalId: string, weekDay: WeekDays) {
    const shift = await prismaClient.shift.findFirst({
      where: { professionalId, weekDay }
    })

    return shift
  }

  public async create(shiftToCreate: Prisma.ShiftCreateInput) {
    const newShift = await prismaClient.shift.create({
      data: { ...shiftToCreate }
    })

    return newShift
  }

  public async update(id: string, shiftToUpdate: Prisma.ShiftUpdateInput) {
    const { shiftStart, shiftEnd, ...otherFields } = shiftToUpdate
    const updatedShift = await prismaClient.shift.update({
      where: { id },
      data: { ...otherFields, ...(shiftStart instanceof Date && !isNaN(shiftStart.getTime()) ? { shiftStart } : {}), ...(shiftEnd instanceof Date && !isNaN(shiftEnd.getTime()) ? { shiftEnd } : {}) }
    })

    return updatedShift
  }

  public async delete(id: string) {
    const deletedShift = await prismaClient.shift.delete({
      where: { id }
    })

    return deletedShift
  }
}

export { PrismaShiftRepository }
