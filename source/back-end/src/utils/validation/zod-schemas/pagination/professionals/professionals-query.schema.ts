import { z } from 'zod'
import { basePaginationSchema } from '../pagination.schema'

export const professionalQuerySchema = basePaginationSchema.extend({
  name: z.string().max(191).optional(),
  email: z.string().max(191).optional()
})

export type ProfessionalQuerySchema = z.infer<typeof professionalQuerySchema>
