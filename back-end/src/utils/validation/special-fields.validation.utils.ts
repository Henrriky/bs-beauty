import type { Request } from 'express'
import { CustomError } from '../errors/custom.error.util'

class SpecialFieldsValidation {
  private static readonly statusCode: number = 400
  private static readonly message: string = 'Bad Request'

  public static verifyIdInBody (req: Request) {
    if (req.body.id != null) {
      throw new CustomError(this.message, this.statusCode, 'Cannot set ID.')
    }
  }

  public static verifyRoleInBody (req: Request) {
    if (req.body.role != null) {
      throw new CustomError(this.message, this.statusCode, 'Cannot set Role.')
    }
  }

  public static verifyTimestampsInBody (req: Request) {
    if (req.body.createdAt != null || req.body.updatedAt != null) {
      throw new CustomError(this.message, this.statusCode, 'Cannot set Timestamps.')
    }
  }

  public static verifySingleIdDestinationInNotification (req: Request) {
    const body = req.body
    if (body.customerId != null && body.employeeId != null) {
      throw new CustomError(this.message, this.statusCode, 'Cannot set both CustomerID and EmployeeID.')
    }
    if (body.customerId == null && body.employeeId == null) {
      throw new CustomError(this.message, this.statusCode, 'CustomerID or EmployeeID missing.')
    }
  }

  public static verifyIdDestinationInNotification (req: Request) {
    const body = req.body
    if (body.customerId != null || body.employeeId != null) {
      throw new CustomError(this.message, this.statusCode, 'Cannot set CustomerID or EmployeeID.')
    }
  }

  public static verifyCustomerId (req: Request) {
    if (req.body.customerId != null) {
      throw new CustomError(this.message, this.statusCode, 'Cannot set CustomerID')
    }
  }

  public static verifyObservation (req: Request) {
    if (req.body.observation != null) {
      throw new CustomError('Forbidden', 403, 'Cannot set Observation. Access denied.')
    }
  }

  public static verifyStatus (req: Request) {
    if (req.body.status != null) {
      throw new CustomError('Forbidden', 403, 'Cannot set Status. Access denied.')
    }
  }

  public static verifyAppointmentId (req: Request) {
    if (req.body.appointmentId != null) {
      throw new CustomError(this.message, this.statusCode, 'Cannot set AppointmentID')
    }
  }

  public static verifyServiceId (req: Request) {
    if (req.body.serviceId != null) {
      throw new CustomError(this.message, this.statusCode, 'Cannot set ServiceID')
    }
  }
}

export { SpecialFieldsValidation }
