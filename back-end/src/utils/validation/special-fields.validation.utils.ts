import type { Request } from 'express'
import { CustomError } from '../errors/custom.error.util'

class SpecialFieldsValidation {
  private static readonly statusCode: number = 400
  private static readonly message: string = 'Bad Request'

  static async verifyIdInBody (req: Request) {
    if (req.body.id != null) {
      throw new CustomError(this.message, this.statusCode, 'Cannot set ID.')
    }
  }

  static async verifyRoleInBody (req: Request) {
    if (req.body.role != null) {
      throw new CustomError(this.message, this.statusCode, 'Cannot set Role.')
    }
  }

  static async verifyTimestampsInBody (req: Request) {
    if (req.body.createdAt != null || req.body.updatedAt != null) {
      throw new CustomError(this.message, this.statusCode, 'Cannot set Timestamps.')
    }
  }
}

export { SpecialFieldsValidation }
