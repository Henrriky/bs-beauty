import { z } from 'zod'

class OfferSchemas {
  public static fetchAvailableSchedullings = z.object({
    dayToFetchAvailableSchedulling: z.preprocess((arg) => {
      if (typeof arg === 'string' || arg instanceof Date) {
        return new Date(arg)
      }

      return arg
    }, z.date().refine((date) => !isNaN(date.getTime())))
  }).strict()

  public static createSchema = z.object({
    estimatedTime: z.number().int(),
    price: z.number().multipleOf(0.01),
    isOffering: z.boolean(),
    serviceId: z.string().uuid(),
    professionalId: z.string().uuid()
  }).strict()

  public static updateSchema = z.object({
    estimatedTime: z.number().int().optional(),
    price: z.number().multipleOf(0.01).optional(),
    isOffering: z.boolean().optional()
  }).strict()
}

export { OfferSchemas }
