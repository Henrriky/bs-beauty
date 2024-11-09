import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'

class CustomerSchemas {
  public static createSchema = z.object({
    name: z.string().min(3).refine((string) => RegexPatterns.names.test(string)),
    birthdate: z.date().refine((date) => !isNaN(date.getTime()) && date < new Date()),
    email: z.string().email(),
    phone: z.string().refine((value) => RegexPatterns.phone.test(value))
  }).strict()

  public static updateSchema = z.object({
    name: z.string().min(3).refine((string) => RegexPatterns.names.test(string)).optional(),
    birthdate: z.date().refine((date) => !isNaN(date.getTime()) && date < new Date()).optional(),
    email: z.string().email().optional(),
    phone: z.string().refine((value) => RegexPatterns.phone.test(value)).optional()
  }).strict()
}

export { CustomerSchemas }
