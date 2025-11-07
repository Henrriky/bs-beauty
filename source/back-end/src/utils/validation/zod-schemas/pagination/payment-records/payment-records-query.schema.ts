import z from 'zod'
import { basePaginationSchema } from '../pagination.schema'

export const partialPaymentRecordQuerySchema = {
  q: z.string().max(50).optional()
}

export const paymentRecordQuerySchema = basePaginationSchema.extend(partialPaymentRecordQuerySchema)

export type PaymentRecordQuerySchema = z.infer<typeof paymentRecordQuerySchema>
export type PartialPaymentRecordQuerySchema = Pick<z.infer<typeof paymentRecordQuerySchema>, 'q'>
