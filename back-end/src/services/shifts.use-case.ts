import { type WeekDays, type Prisma, type Shift } from '@prisma/client'
import { type ShiftRepository } from '../repository/protocols/shift.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'

interface ShiftOutput {
  shifts: Shift[]
}

class ShiftUseCase {
  constructor (private readonly shiftRepository: ShiftRepository) {}

  public async executeFindAll (): Promise<ShiftOutput> {
    const shifts = await this.shiftRepository.findAll()
    RecordExistence.validateManyRecordsExistence(shifts, 'shifts')

    return { shifts }
  }

  public async executeFindById (shiftId: string) {
    const shift = await this.shiftRepository.findById(shiftId)
    RecordExistence.validateRecordExistence(shift, 'Shift')

    return shift
  }

  public async executeFindByEmployeeId (employeeId: string | undefined): Promise<ShiftOutput> {
    const shifts = await this.shiftRepository.findByEmployeeId(employeeId)
    RecordExistence.validateManyRecordsExistence(shifts, 'shifts')

    return { shifts }
  }

  public async executeCreate (shiftToCreate: Prisma.ShiftCreateInput) {
    const shift = shiftToCreate as unknown as Shift
    const employeeId = shift.employeeId
    const weekDay = shift.weekDay
    const shiftFound = await this.shiftRepository.findByEmployeeAndWeekDay(employeeId, weekDay)
    RecordExistence.validateRecordNonExistence(shiftFound, 'Shift')
    const newShift = await this.shiftRepository.create(shiftToCreate)

    return newShift
  }

  public async executeUpdate (shiftId: string, shiftToUpdate: Prisma.ShiftUpdateInput) {
    const existingShift = await this.executeFindByIdAndEmployeeId(shiftId, shiftToUpdate.employee?.connect?.id as unknown as string)
    const updatedWeekDay = shiftToUpdate.weekDay as unknown as WeekDays

    if (updatedWeekDay != null) {
      const employeeId = existingShift?.employeeId as unknown as string
      const shiftFound = await this.shiftRepository.findByEmployeeAndWeekDay(employeeId, updatedWeekDay)
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

  public async executeFindByIdAndEmployeeId(shiftId: string, employeeId: string) {
    const shift = await this.shiftRepository.findByIdAndEmployeeId(shiftId, employeeId)
    RecordExistence.validateRecordExistence(shift, 'Shift');

    return shift
  }

}

export { ShiftUseCase }
