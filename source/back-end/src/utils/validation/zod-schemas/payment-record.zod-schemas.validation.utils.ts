import { z } from 'zod'

class PaymentRecordSchemas {
  private static readonly paymentItemsSchema = z.array(z.object({
    id: z.string().uuid().optional(),
    quantity: z.number().min(1),
    discount: z.number().multipleOf(0.01),
    price: z.number().multipleOf(0.01),
    offerId: z.string().uuid()
  }).strict())

  public static readonly createSchema = z.object({
    totalValue: z.number().multipleOf(0.01),
    paymentMethod: z.string(),
    customerId: z.string().uuid(),
    professionalId: z.string().uuid(),
    items: this.paymentItemsSchema
  }).strict()

  public static readonly updateSchema = z.object({
    totalValue: z.number().multipleOf(0.01).optional(),
    paymentMethod: z.string().optional(),
    customerId: z.string().uuid().optional(),
    items: this.paymentItemsSchema.optional()
  }).strict()
}

export { PaymentRecordSchemas }
