import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'

class SalonInfoSchemas {
  private static readonly openingHoursSchema = z.array(
    z
      .object({
        name: z.string(),
        initialHour: z.string().regex(RegexPatterns.time, {
          message: 'Invalid hour. Please use HH:mm format (00:00 - 23:59).',
        }),
        finalHour: z.string().regex(RegexPatterns.time, {
          message: 'Invalid hour. Please use HH:mm format (00:00 - 23:59).',
        }),
        isClosed: z.boolean(),
      })
      .strict(),
  )

  public static readonly updateSchema = z
    .object({
      openingHours: this.openingHoursSchema.optional(),
      salonAddress: z.string().optional(),
      salonEmail: z.string().email().optional(),
      salonPhoneNumber: z
        .string()
        .refine((value) => RegexPatterns.phone.test(value))
        .optional(),
      minimumAdvanceTime: z.number().optional(),
    })
    .strict()
}

export { SalonInfoSchemas }
