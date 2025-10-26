import { z } from 'zod'

class BlockedTimeSchemas {
  private static readonly createUpdateBaseSchema = z.object({
    reason: z.string()
      .min(2, { message: 'Motivo deve ter pelo menos 2 caracteres' })
      .max(50, { message: 'Motivo deve ter no máximo 50 caracteres' }),
    startTime: z
      .string()
      .refine((value) => !isNaN(Date.parse(value)), {
        message: 'startTime deve ser uma data válida no formato ISO'
      }),
    endTime: z
      .string()
      .refine((value) => !isNaN(Date.parse(value)), {
        message: 'endTime deve ser uma data válida no formato ISO'
      }),
    startDate:
      z.string()
        .refine((value) => !isNaN(Date.parse(value)), {
          message: 'startDate deve ser uma data válida no formato ISO'
        }),
    endDate:
      z.string()
        .optional()
        .nullable()
        .refine((value) => {
          if (!value) return true
          return !isNaN(Date.parse(value))
        },
        {
          message: 'startDate deve ser uma data válida no formato ISO'
        }),
    sunday: z.boolean().optional(),
    monday: z.boolean().optional(),
    tuesday: z.boolean().optional(),
    wednesday: z.boolean().optional(),
    thursday: z.boolean().optional(),
    friday: z.boolean().optional(),
    saturday: z.boolean().optional(),
    isActive: z.boolean().optional()
  })

  public static createSchema = BlockedTimeSchemas.createUpdateBaseSchema.extend({
    endDate: BlockedTimeSchemas.createUpdateBaseSchema.shape.endDate.optional(),
    sunday: BlockedTimeSchemas.createUpdateBaseSchema.shape.sunday.optional(),
    monday: BlockedTimeSchemas.createUpdateBaseSchema.shape.monday.optional(),
    tuesday: BlockedTimeSchemas.createUpdateBaseSchema.shape.tuesday.optional(),
    wednesday: BlockedTimeSchemas.createUpdateBaseSchema.shape.wednesday.optional(),
    thursday: BlockedTimeSchemas.createUpdateBaseSchema.shape.thursday.optional(),
    friday: BlockedTimeSchemas.createUpdateBaseSchema.shape.friday.optional(),
    saturday: BlockedTimeSchemas.createUpdateBaseSchema.shape.saturday.optional(),
    isActive: BlockedTimeSchemas.createUpdateBaseSchema.shape.isActive.optional(),
    reason: BlockedTimeSchemas.createUpdateBaseSchema.shape.reason,
    startTime: BlockedTimeSchemas.createUpdateBaseSchema.shape.startTime
  }).strict()

  public static findByProfessionalAndPeriodParamsSchema = z.object({
    startDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
      message: 'startDate deve ser uma data válida no formato ISO'
    }),
    endDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
      message: 'endDate deve ser uma data válida no formato ISO'
    })
  })

  public static updateParamsSchema = z.object({
    id: z.string().uuid({ message: 'ID inválido' })
  }).strict()

  public static updateSchema = BlockedTimeSchemas.createUpdateBaseSchema.extend({})
}

export { BlockedTimeSchemas }
