import { type WeekDays, type Prisma, type Shift } from '@prisma/client'
import { type ShiftRepository } from '../repository/protocols/shift.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'

interface ShiftOutput {
  shifts: Shift[]
}

class ShiftUseCase {
  constructor (private readonly shiftRepository: ShiftRepository) { }

  public async executeFindAllByProfessionalId (professionalId: string | undefined): Promise<ShiftOutput> {
    const shifts = await this.shiftRepository.findAllByProfessionalId(professionalId)

    return { shifts }
  }

  public async executeFindById (shiftId: string) {
    const shift = await this.shiftRepository.findById(shiftId)
    RecordExistence.validateRecordExistence(shift, 'Shift')

    return shift
  }

  public async executeFindByProfessionalId (professionalId: string | undefined): Promise<ShiftOutput> {
    const shifts = await this.shiftRepository.findByProfessionalId(professionalId)
    RecordExistence.validateManyRecordsExistence(shifts, 'shifts')

    return { shifts }
  }

  public async executeCreate (shiftToCreate: Prisma.ShiftCreateInput) {
    const shift = shiftToCreate as unknown as Shift
    const professionalId = shift.professionalId
    const weekDay = shift.weekDay
    const shiftFound = await this.shiftRepository.findByProfessionalAndWeekDay(professionalId, weekDay)
    RecordExistence.validateRecordNonExistence(shiftFound, 'Shift')
    const newShift = await this.shiftRepository.create(shiftToCreate)

    return newShift
  }

  public async executeUpdate (shiftId: string, shiftToUpdate: Prisma.ShiftUpdateInput) {
    const existingShift = await this.executeFindByIdAndProfessionalId(shiftId, shiftToUpdate.professional?.connect?.id as unknown as string)
    const updatedWeekDay = shiftToUpdate.weekDay as unknown as WeekDays

    if (updatedWeekDay != null) {
      const professionalId = existingShift?.professionalId as unknown as string
      const shiftFound = await this.shiftRepository.findByProfessionalAndWeekDay(professionalId, updatedWeekDay)
      RecordExistence.validateRecordNonExistence(shiftFound, 'Shift')
    }

    const updatedShift = await this.shiftRepository.update(shiftId, shiftToUpdate)

    return updatedShift
  }

  public async executeDelete (shiftId: string) {
    await this.executeFindById(shiftId)
    const deletedShift = await this.shiftRepository.delete(shiftId)

    return deletedShift
  }

  public async executeFindByIdAndProfessionalId (shiftId: string, professionalId: string) {
    const shift = await this.shiftRepository.findByIdAndProfessionalId(shiftId, professionalId)
    RecordExistence.validateRecordExistence(shift, 'Shift')

    return shift
  }
}

export { ShiftUseCase }
