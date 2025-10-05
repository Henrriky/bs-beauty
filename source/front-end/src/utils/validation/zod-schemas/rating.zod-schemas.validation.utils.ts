import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'

class RatingSchemas {
  public static ratingUpdateSchema = z
    .object({
      comment: z.preprocess(
        (val) => (val === '' ? undefined : val),
        z
          .string()
          .max(255)
          .refine((string) => RegexPatterns.observation.test(string))
          .optional(),
      ),
      score: z.number().min(1).max(5),
    })
    .strict()
}

export { RatingSchemas }
