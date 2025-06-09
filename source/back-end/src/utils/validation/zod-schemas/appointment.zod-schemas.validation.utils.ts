import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'
import { Status } from '@prisma/client'

class AppointmentSchemas {
  public static createSchema = z.object({
    observation: z.string().min(3).max(255).refine((string) => RegexPatterns.content.test(string)).optional(),
    customerId: z.string().uuid(),
    serviceOfferedId: z.string().uuid(),
    appointmentDate: z
      .string()
      .refine((value) => !isNaN(Date.parse(value)), {
        message: 'appointmentDate must be a valid ISO date string',
      }),
  }).strict()

  public static customerUpdateSchema = z.object({
    observation: z.string().min(3).max(255).refine((string) => RegexPatterns.content.test(string)).optional()
  }).strict()

  public static employeeUpdateSchema = z.object({
    status: z.nativeEnum(Status).optional()
  }).strict()
}

export { AppointmentSchemas }
