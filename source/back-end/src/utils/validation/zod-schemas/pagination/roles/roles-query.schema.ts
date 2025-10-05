import { z } from 'zod'
import { basePaginationSchema } from '../pagination.schema'

export const roleQuerySchema = basePaginationSchema.extend({
  name: z.string().max(50).optional()
})

export type RoleQuerySchema = z.infer<typeof roleQuerySchema>
