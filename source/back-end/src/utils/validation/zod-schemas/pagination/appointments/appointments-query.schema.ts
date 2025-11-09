import { z } from 'zod'
import { basePaginationSchema } from '../pagination.schema'
import { Status } from '@prisma/client'
import { DateTime } from 'luxon'

const StatusEnum = z.nativeEnum(Status)

const statusParam = z.union([
  z
    .string()
    .trim()
    .transform((v) =>
      v
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean)
    )
    .pipe(z.array(StatusEnum).nonempty().optional()),
  z
    .array(z.string())
    .transform((arr) => arr.map((s) => s.trim().toUpperCase()))
    .pipe(z.array(StatusEnum).nonempty().optional())
]).optional()

const viewAllParam = z.union([
  z.literal('true').transform(() => true),
  z.literal('false').transform(() => false),
  z.boolean()
]).optional().default(false)

const TZ = 'America/Sao_Paulo'

const dateInput = z.union([
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format.'),
  z.date()
])

export const appointmentsQuerySchema = basePaginationSchema
  .extend({
    from: dateInput
      .transform((value) => {
        const dt =
          typeof value === 'string'
            ? DateTime.fromISO(value, { zone: TZ })
            : DateTime.fromJSDate(value, { zone: TZ })
        return dt.startOf('day').toUTC().toJSDate()
      })
      .optional(),

    to: dateInput
      .transform((value) => {
        const dt =
          typeof value === 'string'
            ? DateTime.fromISO(value, { zone: TZ })
            : DateTime.fromJSDate(value, { zone: TZ })
        return dt.endOf('day').toUTC().toJSDate()
      })
      .optional(),

    status: statusParam,
    viewAll: viewAllParam
  })
  .superRefine((val, ctx) => {
    const { from, to } = val
    if (from && to && from.getTime() > to.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['from'],
        message: '`from` date must be earlier than or equal to `to` date'
      })
    }
  })

export type AppointmentsQuerySchema = z.infer<typeof appointmentsQuerySchema>
