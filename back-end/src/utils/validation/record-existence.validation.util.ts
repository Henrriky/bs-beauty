import { CustomError } from '../errors/custom.error.util'

class RecordExistence {
  public static validateRecordExistence (record: any, entity: string) {
    if (record == null) {
      throw new CustomError('Not Found', 404, `${entity} not found.`)
    }
  }

  public static validateRecordNonExistence (record: any, entity: string) {
    if (record != null) {
      throw new CustomError('Not Found', 404, `${entity} already exists.`)
    }
  }

  public static validateManyRecordsExistence (records: any[], entity: string) {
    if (records.length === 0) {
      throw new CustomError('Not Found', 404, `No ${entity} found.`)
    }
  }
}

export { RecordExistence }
