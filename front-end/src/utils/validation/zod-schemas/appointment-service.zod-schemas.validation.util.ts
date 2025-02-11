import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'
import { Status } from '../../../store/appointment/types'

class AppointmentServiceSchemas {
  public static createSchemaForm = z
    .object({
      observation: z
        .string()
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

  public static customerUpdateSchema = z
    .object({
      observation: z
        .string()
        .max(255)
        .nullable()
        .optional(),
      status: z.nativeEnum(Status).optional(),
    })
    .strict()

  public static employeeUpdateSchema = z
    .object({
      status: z.nativeEnum(Status).optional(),
    })
    .strict()
}

export { AppointmentServiceSchemas }
