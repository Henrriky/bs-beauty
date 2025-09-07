// import { z } from 'zod'
// import { type Request, type Response, type NextFunction } from 'express'
// import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'
// import { DateFormatter } from '../../../utils/formatting/date.formatting.util'
// import { Role } from '@prisma/client'
// import { AppointmentServiceSchemas } from '../../../utils/validation/zod-schemas/appointment-service.zod-schemas.validation.util'

// const validateUpdateAppointmentService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const roles: Role[] = [Role.MANAGER, Role.PROFESSIONAL]
//     const role = req.headers.role as Role
//     const requestBody = req.body

//     if (role === Role.CUSTOMER) {
//       AppointmentServiceSchemas.customerUpdateSchema.parse(requestBody)
//     }

//     if (roles.includes(role)) {
//       AppointmentServiceSchemas.professionalUpdateSchema.parse(requestBody)
//     }

//     requestBody.appointmentDate = DateFormatter.formatAppointmentDate(req)
//     next()
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       formatValidationErrors(error, res)
//       return
//     }
//     next(error)
//   }
// }

// export { validateUpdateAppointmentService }
