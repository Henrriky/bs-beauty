import { z } from 'zod'

class PaymentRecordSchemas {
  public static readonly paymentItemsSchema = z.array(
    z
      .object({
        id: z.string().uuid().optional(),
        quantity: z.number().min(1).default(1),
        discount: z.number().multipleOf(0.01).default(0),
        price: z.number().multipleOf(0.01).default(0),
        offerId: z.string().uuid({
          message: 'Selecione um serviço',
        }),
      })
      .strict(),
  )

  public static readonly createSchema = z
    .object({
      totalValue: z.number().multipleOf(0.01),
      paymentMethod: z.string({
        required_error: 'Selecione um método de pagamento',
      }),
      customerId: z.string({ required_error: 'Selecione um cliente' }).uuid(),
      professionalId: z.string().uuid(),
      items: this.paymentItemsSchema,
    })
    .strict()

  public static readonly updateSchema = z
    .object({
      totalValue: z.number().multipleOf(0.01).optional(),
      paymentMethod: z.string().optional(),
      customerId: z.string().uuid().optional(),
      items: this.paymentItemsSchema.optional(),
    })
    .strict()
}

export { PaymentRecordSchemas }
