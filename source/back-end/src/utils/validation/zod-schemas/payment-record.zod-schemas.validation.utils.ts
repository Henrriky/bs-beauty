import { z } from 'zod'

class PaymentRecordSchemas {
  public static createSchema = z.object({
    totalValue: z.number().multipleOf(0.01),
    paymentMethod: z.string(),
    customerId: z.string().uuid(),
    professionalId: z.string().uuid()
  }).strict()

  public static updateSchema = z.object({
    totalValue: z.number().multipleOf(0.01).optional(),
    paymentMethod: z.string().optional(),
    customerId: z.string().uuid().optional()
  }).strict()
}

export { PaymentRecordSchemas }
