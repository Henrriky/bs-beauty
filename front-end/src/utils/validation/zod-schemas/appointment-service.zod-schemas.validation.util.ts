import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'

class AppointmentServiceSchemas {
  public static createSchemaForm = z
    .object({
      observation: z
        .string()
        .min(3)
        .max(255)
        .refine((string) => RegexPatterns.content.test(string))
        .optional(),
      appointmentDate: z
        .date()
        .refine((date) => !isNaN(date.getTime()) && date > new Date()),
      serviceOfferedId: z.string().uuid(),
      serviceId: z.string().uuid(),
      employeeId: z.string().optional(),
      appointmentDayPicked: z.date().optional(),
    })
    .strict()

  public static createSchema = z
    .object({
      observation: z
        .string()
        .min(3)
        .max(255)
        .refine((string) => RegexPatterns.content.test(string))
        .optional(),
      appointmentDate: z
        .date()
        .refine((date) => !isNaN(date.getTime()) && date > new Date()),
      appointmentId: z.string().uuid(),
      serviceOfferedId: z.string().uuid(),
    })
    .strict()
}

export { AppointmentServiceSchemas }
