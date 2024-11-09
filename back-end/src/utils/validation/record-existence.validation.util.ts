import { type Shift } from '@prisma/client'
import { CustomError } from '../errors/custom.error.util'

class RecordExistence {
  public static validateRecordExistence (record: any, entity: string) {
    if (record == null) {
      throw new CustomError('Not Found', 404, `${entity} not found.`)
    }
  }

  public static validateRecordNonExistence (record: any, entity: string) {
    if (record != null) {
      throw new CustomError('Bad Request', 400, `${entity} already exists.`)
    }
  }

  public static validateManyRecordsExistence (records: any[], entity: string) {
    if (records.length === 0) {
      throw new CustomError('Not Found', 404, `No ${entity} found.`)
    }
  }

  public static validateUniqueWeekDayInShifts (records: any, shiftToUpdate: any, entity: string) {
    records.shifts.forEach((shift: Shift) => {
      if (shift.weekDay === shiftToUpdate?.weekDay) {
        throw new CustomError('Bad Request', 400, `${entity} already exists.`)
      }
    })
  }
}

export { RecordExistence }
