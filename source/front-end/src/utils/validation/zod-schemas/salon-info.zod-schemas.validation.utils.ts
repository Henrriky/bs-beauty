import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'

class SalonInfoSchemas {
  private static readonly openingHoursSchema = z.array(
    z
      .object({
        name: z.string(),
        initialHour: z
          .string()
          .regex(RegexPatterns.time, {
            message: 'Invalid hour. Please use HH:mm format (00:00 - 23:59).',
          })
          .optional(),
        finalHour: z
          .string()
          .regex(RegexPatterns.time, {
            message: 'Invalid hour. Please use HH:mm format (00:00 - 23:59).',
          })
          .optional(),
        isClosed: z.boolean(),
      })
      .strict(),
  )

  public static readonly updateSchema = z
    .object({
      openingHours: this.openingHoursSchema.optional(),
      salonAddress: z
        .string()
        .refine((value) => RegexPatterns.address.test(value), {
          message: 'Endereço inválido.',
        })
        .optional(),
      salonEmail: z.string().email({ message: 'E-mail inválido.' }).optional(),
      salonPhoneNumber: z
        .string()
        .refine((value) => RegexPatterns.phone.test(value), {
          message: 'Número inválido.',
        })
        .optional(),
      minimumAdvanceTime: z.string().optional(),
    })
    .strict()
}

export { SalonInfoSchemas }
