import { z } from 'zod'
import { basePaginationSchema } from '../pagination.schema'

export const partialServiceQuerySchema = {
  name: z.string().max(191).optional(),
  email: z.string().max(191).optional(),
  q: z.string().max(50).optional(),
  category: z.string().max(30).optional()
}

export const serviceQuerySchema = basePaginationSchema.extend(partialServiceQuerySchema)

export type ServiceQuerySchema = z.infer<typeof serviceQuerySchema>
export type PartialServiceQuerySchema = Pick<z.infer<typeof serviceQuerySchema>, 'q' | 'category' | 'name'>
