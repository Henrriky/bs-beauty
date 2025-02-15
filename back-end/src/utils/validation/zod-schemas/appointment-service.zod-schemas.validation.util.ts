import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'
import { Status } from '@prisma/client'

class AppointmentServiceSchemas {
  public static createSchema = z.object({
    observation: z.string().max(255).refine((string) => RegexPatterns.observation.test(string)).optional(),
    appointmentDate: z
      .preprocess((arg) => {
        if (typeof arg === 'string') {
          return new Date(arg)
        }
        return arg
      }, z.date().refine((date) => !isNaN(date.getTime()) && date > new Date(), {
        message: 'Invalid appointment date or date is in the past'
      })),
    appointmentId: z.string().uuid(),
    serviceOfferedId: z.string().uuid()
  }).strict()

  public static customerUpdateSchema = z.object({
    observation: z.string().max(255).refine((string) => RegexPatterns.observation.test(string)).optional(),
    appointmentDate: z.date().refine((date) => !isNaN(date.getTime()) && date < new Date()).optional()
  }).strict()

  public static employeeUpdateSchema = z.object({
    status: z.nativeEnum(Status).optional(),
    appointmentDate: z.date().refine((date) => !isNaN(date.getTime()) && date < new Date()).optional()
  }).strict()
}

export { AppointmentServiceSchemas }
