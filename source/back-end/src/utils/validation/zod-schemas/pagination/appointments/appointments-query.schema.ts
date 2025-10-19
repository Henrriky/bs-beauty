import { z } from 'zod'
import { basePaginationSchema } from '../pagination.schema'
import { Status } from '@prisma/client'

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

export const appointmentsQuerySchema = basePaginationSchema
  .extend({
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
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
