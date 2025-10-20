import { z } from 'zod'

class BlockedTimeSchemas {
  private static readonly createUpdateBaseSchema = z.object({
    reason: z
      .string()
      .min(2, { message: 'Motivo deve ter pelo menos 2 caracteres' })
      .max(50, { message: 'Motivo deve ter no máximo 50 caracteres' }),
    startTime: z
      .string()
      .transform((value) => {
        if (value.length === 8) {
          const [hours, minutes, seconds] = value.split(':').map(Number)
          const date = new Date(`1970-01-01 ${hours}:${minutes}:${seconds}`)
          return date.toISOString()
        }
        return value
      })
      .refine((value) => !isNaN(Date.parse(value)), {
        message: 'Tempo de início deve ser uma data válida no formato ISO',
      }),
    endTime: z
      .string()
      .transform((value) => {
        if (value.length === 8) {
          const [hours, minutes, seconds] = value.split(':').map(Number)
          const date = new Date(`1970-01-01 ${hours}:${minutes}:${seconds}`)
          return date.toISOString()
        }
        return value
      })

      .refine((value) => !isNaN(Date.parse(value)), {
        message: 'Tempo de fim deve ser uma data válida no formato ISO',
      }),
    startDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
      message: 'Data de início deve ser uma data válida no formato ISO',
    }),
    endDate: z
      .string()
      .optional()
      .refine(
        (value) => {
          if (!value) return true
          return !isNaN(Date.parse(value))
        },
        {
          message: 'Data de Final deve ser uma data válida no formato ISO',
        },
      ),
    sunday: z.boolean().optional(),
    monday: z.boolean().optional(),
    tuesday: z.boolean().optional(),
    wednesday: z.boolean().optional(),
    thursday: z.boolean().optional(),
    friday: z.boolean().optional(),
    saturday: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })

  public static createSchema = BlockedTimeSchemas.createUpdateBaseSchema
    .extend({
      endDate:
        BlockedTimeSchemas.createUpdateBaseSchema.shape.endDate.optional(),
      sunday: BlockedTimeSchemas.createUpdateBaseSchema.shape.sunday.optional(),
      monday: BlockedTimeSchemas.createUpdateBaseSchema.shape.monday.optional(),
      tuesday:
        BlockedTimeSchemas.createUpdateBaseSchema.shape.tuesday.optional(),
      wednesday:
        BlockedTimeSchemas.createUpdateBaseSchema.shape.wednesday.optional(),
      thursday:
        BlockedTimeSchemas.createUpdateBaseSchema.shape.thursday.optional(),
      friday: BlockedTimeSchemas.createUpdateBaseSchema.shape.friday.optional(),
      saturday:
        BlockedTimeSchemas.createUpdateBaseSchema.shape.saturday.optional(),
      isActive:
        BlockedTimeSchemas.createUpdateBaseSchema.shape.isActive.optional(),
      reason: BlockedTimeSchemas.createUpdateBaseSchema.shape.reason,
      startTime: BlockedTimeSchemas.createUpdateBaseSchema.shape.startTime,
    })
    .strict()
}

export { BlockedTimeSchemas }
