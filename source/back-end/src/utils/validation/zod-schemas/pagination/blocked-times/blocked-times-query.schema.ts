import { z } from 'zod'
import { basePaginationSchema } from '../pagination.schema'

export const blockedtimesQuerySchema = basePaginationSchema.extend({
  reason: z.string().max(100).optional()
})

export type BlockedTimesQuerySchema = z.infer<typeof blockedtimesQuerySchema>
