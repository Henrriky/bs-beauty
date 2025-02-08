import { z } from 'zod'

class OfferSchemas {
  public static createSchema = z
    .object({
      estimatedTime: z
        .string()
        .min(1, 'A duração do serviço é obrigatória')
        .transform((val) => parseFloat(val))
        .refine((time) => !isNaN(time), 'Duração inválida'),
      price: z
        .string()
        .min(0.01, 'O preço não pode ser R$ 0,00')
        .transform((value) =>
          parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.')),
        )
        .refine((numericValue) => !isNaN(numericValue), {
          message: 'Formato de moeda inválido',
        })
        .refine((numericValue) => numericValue > 0, {
          message: 'O preço não pode ser R$ 0,00',
        }),
      isOffering: z.boolean(),
      serviceId: z.string().uuid(),
      employeeId: z.string().uuid(),
    })
    .strict()

  public static updateSchema = z
    .object({
      estimatedTime: z
        .string()
        .min(1, 'A duração do serviço é obrigatória')
        .transform((val) => parseFloat(val))
        .optional(),
      price: z
        .string()
        .min(0.01, 'O preço não pode ser R$ 0,00')
        .transform((value) =>
          parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.')),
        )
        .refine((numericValue) => !isNaN(numericValue), {
          message: 'Formato de moeda inválido',
        })
        .refine((numericValue) => numericValue > 0, {
          message: 'O preço não pode ser R$ 0,00',
        })
        .optional(),
      isOffering: z.boolean().optional(),
    })
    .strict()
}

export { OfferSchemas }
