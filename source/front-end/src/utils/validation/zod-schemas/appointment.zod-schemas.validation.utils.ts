import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'
import { Status } from '../../../store/appointment/types'

class AppointmentSchemas {
  public static createSchema = z
    .object({
      observation: z
        .string()
        .min(3)
        .max(255)
        .refine((string) => RegexPatterns.content.test(string))
        .optional(),
    })
    .strict()

  public static createSchemaForm = z
    .object({
      observation: z
        .string()
        .max(255)
        .refine((string) => RegexPatterns.content.test(string))
        .optional(),
      appointmentDate: z.string().refine(
        (value) => {
          const parsed = Date.parse(value)
          return !isNaN(parsed) && parsed > Date.now()
        },
        {
          message: 'appointmentDate must be a future ISO date string',
        },
      ),
      serviceOfferedId: z.string().uuid(),
      customerId: z.string().uuid(),
      appointmentDayPicked: z.string().optional(),
      serviceId: z.string().optional(),
      employeeId: z.string().optional(),
    })
    .strict()

  public static customerUpdateSchema = z
    .object({
      observation: z
        .string()
        .min(3)
        .max(255)
        .refine((string) => RegexPatterns.content.test(string))
        .optional(),
      status: z.nativeEnum(Status).optional(),
    })
    .strict()

  public static employeeUpdateSchema = z.object({
    status: z.nativeEnum(Status).optional(),
  })
}

export { AppointmentSchemas }
