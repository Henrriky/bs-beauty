import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'

class RatingSchemas {
  public static createSchema = z.object({
    score: z.number().min(1).max(5).optional(),
    comment: z.string().min(3).max(100).refine((string) => RegexPatterns.observation.test(string)).optional(),
    appointmentId: z.string().uuid()
  }).strict()

  public static updateSchema = z.object({
    score: z.number().min(1).max(5).optional(),
    comment: z.string().min(3).max(100).refine((string) => RegexPatterns.observation.test(string)).optional()
  }).strict()
}

export { RatingSchemas }
