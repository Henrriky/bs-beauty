import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'

class ServiceSchemas {
  public static createSchema = z.object({
    name: z.string().min(3).refine((string) => RegexPatterns.names.test(string)),
    description: z.string().min(2).refine((string) => RegexPatterns.content.test(string)).optional(),
    category: z.string().min(2).refine((string) => RegexPatterns.names.test(string))
  }).strict()

  public static updateSchema = z.object({
    name: z.string().min(3).refine((string) => RegexPatterns.names.test(string)).optional(),
    description: z.string().min(2).refine((string) => RegexPatterns.content.test(string)).optional(),
    category: z.string().min(2).refine((string) => RegexPatterns.names.test(string)).optional()
  }).strict()
}

export { ServiceSchemas }
