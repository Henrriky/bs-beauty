import { z } from 'zod'
import { basePaginationSchema } from '../pagination.schema'

export const customerQuerySchema = basePaginationSchema.extend({
  name: z.string().max(191).optional(),
  email: z.string().max(191).optional(),
})

export type CustomerQuerySchema = z.infer<typeof customerQuerySchema>