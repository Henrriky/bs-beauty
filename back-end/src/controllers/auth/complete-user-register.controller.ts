import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { prismaClient } from '../../lib/prisma'
import { formatValidationErrors } from '../../utils/formatting/zod-validation-errors.formatting.util'
import { RegexPatterns } from '../../utils/validation/regex.validation.util'
import { EmployeeSchemas } from '../../utils/validation/zod-schemas/employee.zod-schemas.validation.utils'

const employeeCompleteRegisterBodySchema = z.object({
  name: z.string().min(3).refine((string) => RegexPatterns.names.test(string)),
  socialMedia: EmployeeSchemas.socialMediaSchema.optional(),
  contact: z.string().refine((value) => RegexPatterns.phone.test(value))
}).strict()

const customerCompleteRegisterBodySchema = z.object({
  name: z.string().min(3).refine((string) => RegexPatterns.names.test(string)),
  birthdate: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) {
      return new Date(arg);
    }
    return arg;
  }, z.date().refine((date) => !isNaN(date.getTime()) && date < new Date())),
  phone: z.string().refine((value) => RegexPatterns.phone.test(value))
}).strict()

class CompleteUserRegisterController {
  public static async handle(req: Request, res: Response) {
    try {

      if (req.user.role === 'CUSTOMER') {

        const customer = customerCompleteRegisterBodySchema.parse(req.body)
        await prismaClient.customer.update({
          where: {
            email: req.user.email,
            googleId: req.user.sub
          },
          data: {
            ...customer,
            registerCompleted: true
          }
        })

      } else if (req.user.role === 'EMPLOYEE') {

        const employee = employeeCompleteRegisterBodySchema.parse(req.body)
        await prismaClient.employee.update({
          where: {
            email: req.user.email,
            googleId: req.user.sub
          },
          data: {
            ...employee,
            registerCompleted: true
          }
        })
      }

      res.status(StatusCodes.NO_CONTENT).send()

    } catch (error: any) {
      if (error instanceof z.ZodError) {
        formatValidationErrors(error, res)
        return
      }
      console.error(`Error trying to complete user register.\nReason: ${error?.message}`)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error trying to complete user register, please check back-end logs...' })
    }
  }
}

export { CompleteUserRegisterController }

