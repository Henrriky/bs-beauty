import { z } from 'zod'
import { basePaginationSchema } from '../pagination.schema'

export const serviceQuerySchema = basePaginationSchema.extend({
  name: z.string().max(191).optional(),
})

export type ServiceQuerySchema = z.infer<typeof serviceQuerySchema>