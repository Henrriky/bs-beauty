import { type z } from 'zod'
import { basePaginationSchema } from '../pagination.schema'

export const offerQuerySchema = basePaginationSchema.extend({

})

export type OfferQuerySchema = z.infer<typeof offerQuerySchema>
